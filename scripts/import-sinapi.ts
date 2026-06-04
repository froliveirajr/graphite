import "dotenv/config";
import AdmZip from "adm-zip";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
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

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Configure DIRECT_URL ou DATABASE_URL antes de importar o SINAPI.");
}

const args = process.argv.slice(2);
const inputArg = args.find((arg) => !arg.startsWith("--"));
const uf = getArg("uf") ?? "SP";
const limit = Number(getArg("limit") ?? "0");
const onlyCodes = new Set((getArg("codes") ?? "").split(",").map((code) => code.trim()).filter(Boolean));

if (!inputArg) {
  throw new Error("Uso: npm run sinapi:import -- caminho/arquivo.zip --uf=SP --limit=200");
}

const inputPath = inputArg;
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

function getArg(name: string) {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

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

function extractFiles(inputPath: string) {
  const absolute = resolve(inputPath);
  const extension = extname(absolute).toLowerCase();

  if (!existsSync(absolute)) {
    throw new Error(`Arquivo nao encontrado: ${absolute}`);
  }

  if (extension !== ".zip") {
    return [absolute];
  }

  const extractDir = resolve("data", "sinapi", "extracted");
  rmSync(extractDir, { force: true, recursive: true });
  mkdirSync(extractDir, { recursive: true });

  const zip = new AdmZip(absolute);
  return zip
    .getEntries()
    .filter((entry) => !entry.isDirectory && [".xlsx", ".xls", ".csv"].includes(extname(entry.entryName).toLowerCase()))
    .map((entry) => {
      const output = join(extractDir, entry.entryName.replace(/[\\/]/g, "_"));
      writeFileSync(output, entry.getData());
      return output;
    });
}

function readRows(filePath: string) {
  const extension = extname(filePath).toLowerCase();

  if (extension === ".csv") {
    const content = readFileSync(filePath, "utf8");
    const [headerLine, ...lines] = content.split(/\r?\n/).filter(Boolean);
    const separator = headerLine.includes(";") ? ";" : ",";
    const headers = headerLine.split(separator).map((header) => header.trim());
    return lines.map((line) => {
      const cells = line.split(separator);
      return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
    });
  }

  const workbook = XLSX.readFile(filePath, { cellDates: false });
  return workbook.SheetNames.flatMap((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });
  });
}

function mapRow(row: Row): SinapiMaterialLine | null {
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

async function main() {
  const files = extractFiles(inputPath);
  const rows = files.flatMap(readRows);
  const lines = rows.map(mapRow).filter((line): line is SinapiMaterialLine => Boolean(line));
  const limitedLines = limit > 0 ? lines.slice(0, limit) : lines;
  const byComposition = new Map<string, SinapiMaterialLine[]>();

  limitedLines.forEach((line) => {
    const current = byComposition.get(line.compositionCode) ?? [];
    current.push(line);
    byComposition.set(line.compositionCode, current);
  });

  let importedMaterials = 0;
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
        notes: `Importado do SINAPI ${uf}.`,
      },
      create: {
        id: `sinapi-${uf}-${compositionCode}`,
        code: compositionCode,
        name: first.compositionName,
        serviceType: first.serviceType,
        unit: first.serviceUnit,
        unitPrice: first.unitPrice || null,
        notes: `Importado do SINAPI ${uf}.`,
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
      importedMaterials += 1;
    }

    importedCompositions += 1;
  }

  console.log(`Arquivos lidos: ${files.length}`);
  console.log(`Linhas compativeis: ${lines.length}`);
  console.log(`Composicoes importadas: ${importedCompositions}`);
  console.log(`Materiais vinculados: ${importedMaterials}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
