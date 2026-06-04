import AdmZip from "adm-zip";
import { extname } from "node:path";
import type { PrismaClient } from "@/generated/prisma/client";
import * as XLSX from "xlsx";

type Row = Record<string, unknown>;

type SinapiMaterialLine = {
  compositionCode: string;
  compositionName: string;
  serviceUnit: string;
  serviceType: string;
  unitPrice: number;
  materialCode: string;
  materialName: string;
  materialUnit: string;
  quantityPerUnit: number;
};

export type SinapiImportResult = {
  filesRead: number;
  compatibleRows: number;
  importedCompositions: number;
  linkedMaterials: number;
};

export type SinapiImportInput = {
  files: Array<{
    name: string;
    buffer: Buffer;
  }>;
  uf: string;
  limit?: number;
  codes?: string[];
  prisma: PrismaClient;
};

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function text(value: unknown) {
  return String(value ?? "").trim();
}

function num(value: unknown) {
  if (typeof value === "number") return value;
  const cleaned = text(value).replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function keyFor(row: Row, patterns: string[]) {
  const entries = Object.keys(row).map((key) => ({ key, normalized: normalize(key) }));
  return entries.find((entry) => patterns.some((pattern) => entry.normalized.includes(pattern)))?.key;
}

function value(row: Row, patterns: string[]) {
  const key = keyFor(row, patterns);
  return key ? row[key] : undefined;
}

function expandFiles(files: SinapiImportInput["files"]) {
  return files.flatMap((file) => {
    if (extname(file.name).toLowerCase() !== ".zip") {
      return [file];
    }

    const zip = new AdmZip(file.buffer);
    return zip
      .getEntries()
      .filter((entry) => !entry.isDirectory && [".xlsx", ".xls", ".csv"].includes(extname(entry.entryName).toLowerCase()))
      .map((entry) => ({
        name: entry.entryName,
        buffer: entry.getData(),
      }));
  });
}

function readRows(file: { name: string; buffer: Buffer }) {
  const extension = extname(file.name).toLowerCase();

  if (extension === ".csv") {
    const content = file.buffer.toString("utf8");
    const [headerLine, ...lines] = content.split(/\r?\n/).filter(Boolean);
    const separator = headerLine.includes(";") ? ";" : ",";
    const headers = headerLine.split(separator).map((header) => header.trim());

    return lines.map((line) => {
      const cells = line.split(separator);
      return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    });
  }

  const workbook = XLSX.read(file.buffer, { type: "buffer", cellDates: false });
  return workbook.SheetNames.flatMap((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });
  });
}

function mapRow(row: Row, uf: string, onlyCodes: Set<string>): SinapiMaterialLine | null {
  const compositionCode = text(value(row, ["codigo composicao", "cod composicao", "codigo do servico", "cod servico"]));
  const compositionName = text(value(row, ["descricao composicao", "desc composicao", "descricao do servico", "servico"]));
  const materialCode = text(value(row, ["codigo insumo", "cod insumo", "codigo material", "cod material"]));
  const materialName = text(value(row, ["descricao insumo", "desc insumo", "descricao material", "insumo"]));
  const quantityPerUnit = num(value(row, ["coeficiente", "quantidade", "consumo"]));

  if (!compositionCode || !compositionName || !materialCode || !materialName || quantityPerUnit <= 0) {
    return null;
  }

  if (onlyCodes.size > 0 && !onlyCodes.has(compositionCode)) {
    return null;
  }

  return {
    compositionCode,
    compositionName,
    serviceUnit: text(value(row, ["unidade composicao", "un composicao", "unidade do servico", "und servico"])) || "un",
    serviceType: text(value(row, ["grupo", "classe", "tipo", "categoria"])) || `SINAPI ${uf}`,
    unitPrice: num(value(row, ["custo total", "preco total", "valor total", "custo"])),
    materialCode,
    materialName,
    materialUnit: text(value(row, ["unidade insumo", "un insumo", "unidade material", "und insumo"])) || "un",
    quantityPerUnit,
  };
}

export async function importSinapi({ files, uf, limit = 0, codes = [], prisma }: SinapiImportInput): Promise<SinapiImportResult> {
  const onlyCodes = new Set(codes.map((code) => code.trim()).filter(Boolean));
  const expandedFiles = expandFiles(files);
  const rows = expandedFiles.flatMap(readRows);
  const lines = rows.map((row) => mapRow(row, uf, onlyCodes)).filter((line): line is SinapiMaterialLine => Boolean(line));
  const limitedLines = limit > 0 ? lines.slice(0, limit) : lines;
  const byComposition = new Map<string, SinapiMaterialLine[]>();

  limitedLines.forEach((line) => {
    const current = byComposition.get(line.compositionCode) ?? [];
    current.push(line);
    byComposition.set(line.compositionCode, current);
  });

  let linkedMaterials = 0;
  let importedCompositions = 0;

  for (const [compositionCode, compositionLines] of byComposition) {
    const first = compositionLines[0];
    const composition = await prisma.serviceComposition.upsert({
      where: {
        id: `sinapi-${uf}-${compositionCode}`,
      },
      update: {
        code: compositionCode,
        name: first.compositionName,
        serviceType: first.serviceType,
        unit: first.serviceUnit,
        unitPrice: first.unitPrice || null,
        notes: `Importado do SINAPI ${uf}. Quantidades e valores podem ser ajustados no Graphite.`,
      },
      create: {
        id: `sinapi-${uf}-${compositionCode}`,
        code: compositionCode,
        name: first.compositionName,
        serviceType: first.serviceType,
        unit: first.serviceUnit,
        unitPrice: first.unitPrice || null,
        notes: `Importado do SINAPI ${uf}. Quantidades e valores podem ser ajustados no Graphite.`,
      },
    });

    await prisma.serviceCompositionMaterial.deleteMany({ where: { compositionId: composition.id } });

    for (const line of compositionLines) {
      const material = await prisma.material.upsert({
        where: {
          internalCode: `SINAPI-${uf}-${line.materialCode}`,
        },
        update: {
          name: line.materialName,
          category: `SINAPI ${uf}`,
          unit: line.materialUnit,
        },
        create: {
          name: line.materialName,
          category: `SINAPI ${uf}`,
          unit: line.materialUnit,
          internalCode: `SINAPI-${uf}-${line.materialCode}`,
        },
      });

      await prisma.serviceCompositionMaterial.create({
        data: {
          compositionId: composition.id,
          materialId: material.id,
          quantityPerUnit: line.quantityPerUnit,
          unit: line.materialUnit,
        },
      });
      linkedMaterials += 1;
    }

    importedCompositions += 1;
  }

  return {
    filesRead: expandedFiles.length,
    compatibleRows: lines.length,
    importedCompositions,
    linkedMaterials,
  };
}
