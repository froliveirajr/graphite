import "dotenv/config";
import { existsSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { importSinapi } from "../src/lib/sinapi/importer";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Configure DIRECT_URL ou DATABASE_URL antes de importar o SINAPI.");
}

const args = process.argv.slice(2);
const inputArg = args.find((arg) => !arg.startsWith("--"));
const uf = getArg("uf") ?? "SP";
const limit = Number(getArg("limit") ?? "0");
const codes = (getArg("codes") ?? "").split(",").map((code) => code.trim()).filter(Boolean);

if (!inputArg) {
  throw new Error("Uso: npm run sinapi:import -- caminho/arquivo.zip --uf=SP --limit=200");
}

const inputPath = resolve(inputArg);

if (!existsSync(inputPath)) {
  throw new Error(`Arquivo nao encontrado: ${inputPath}`);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

function getArg(name: string) {
  const prefix = `--${name}=`;
  return args.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
}

async function main() {
  const result = await importSinapi({
    prisma,
    uf,
    limit,
    codes,
    files: [
      {
        name: basename(inputPath),
        buffer: readFileSync(inputPath),
      },
    ],
  });

  console.log(`Arquivos lidos: ${result.filesRead}`);
  console.log(`Linhas compativeis: ${result.compatibleRows}`);
  console.log(`Composicoes importadas: ${result.importedCompositions}`);
  console.log(`Materiais vinculados: ${result.linkedMaterials}`);
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
