import "dotenv/config";
import { randomBytes, scryptSync } from "node:crypto";
import { PrismaClient, ProjectPriority, ProjectStatus, TaskStatus, UserRole } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Configure DIRECT_URL ou DATABASE_URL antes de rodar o seed.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const seedPassword = process.env.GRAPHITE_SEED_PASSWORD ?? "Graphite@2026";

function hashSeedPassword(password: string) {
  const salt = randomBytes(16);
  const derivedKey = scryptSync(password, salt, 64);

  return `scrypt$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

async function main() {
  const passwordHash = hashSeedPassword(seedPassword);

  const admin = await prisma.user.upsert({
    where: { email: "admin@graphite.local" },
    update: {
      passwordHash,
    },
    create: {
      name: "Admin Graphite",
      email: "admin@graphite.local",
      passwordHash,
      role: UserRole.ADMIN,
      phone: "(11) 90000-0000",
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "rafael@graphite.local" },
    update: {
      passwordHash,
    },
    create: {
      name: "Rafael Torres",
      email: "rafael@graphite.local",
      passwordHash,
      role: UserRole.PROJECT_MANAGER,
      phone: "(11) 91111-1111",
    },
  });

  const client = await prisma.client.upsert({
    where: { id: "seed-client-marina" },
    update: {},
    create: {
      id: "seed-client-marina",
      name: "Marina Albuquerque",
      documentType: "CPF",
      documentNumber: "329.880.410-90",
      phone: "(11) 97642-1187",
      whatsapp: "(11) 97642-1187",
      email: "marina.albuquerque@email.com",
      address: "Av. Portugal, 870 - Brooklin",
      clientType: "Pessoa fisica",
      notes: "Cliente de demonstracao para validacao do MVP.",
    },
  });

  const project = await prisma.project.upsert({
    where: { code: "GPH-2026-014" },
    update: {},
    create: {
      code: "GPH-2026-014",
      name: "Apartamento Marina Albuquerque",
      clientId: client.id,
      projectType: "Reforma de apartamento",
      address: "Av. Portugal, 870 - Brooklin",
      managerId: manager.id,
      technicalResponsibleId: admin.id,
      plannedStartDate: new Date("2026-05-06T03:00:00.000Z"),
      plannedEndDate: new Date("2026-08-21T03:00:00.000Z"),
      plannedBudget: 286000,
      actualCost: 148500,
      status: ProjectStatus.IN_PROGRESS,
      priority: ProjectPriority.HIGH,
      notes: "Obra seed para testar detalhes, ambientes e tarefas.",
    },
  });

  const cozinha = await prisma.projectArea.upsert({
    where: {
      projectId_name: {
        projectId: project.id,
        name: "Cozinha",
      },
    },
    update: {},
    create: {
      projectId: project.id,
      name: "Cozinha",
      description: "Area molhada com eletrica, hidraulica, revestimento e marcenaria.",
      approximateArea: 14.5,
      status: "Aguardando material",
      responsibleId: manager.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        id: "seed-task-cozinha-eletrica",
        projectId: project.id,
        areaId: cozinha.id,
        title: "Finalizar infraestrutura eletrica da cozinha",
        description: "Conferir circuitos dedicados e pontos de bancada.",
        serviceType: "Eletrica",
        assignedToUserId: manager.id,
        plannedStartDate: new Date("2026-06-01T03:00:00.000Z"),
        plannedEndDate: new Date("2026-06-04T03:00:00.000Z"),
        status: TaskStatus.IN_PROGRESS,
        priority: ProjectPriority.HIGH,
      },
      {
        id: "seed-task-cozinha-hidraulica",
        projectId: project.id,
        areaId: cozinha.id,
        title: "Instalar registros e pontos hidraulicos",
        description: "Preparar pontos para bancada e filtro.",
        serviceType: "Hidraulica",
        assignedToUserId: manager.id,
        plannedStartDate: new Date("2026-06-05T03:00:00.000Z"),
        plannedEndDate: new Date("2026-06-08T03:00:00.000Z"),
        status: TaskStatus.TODO,
        priority: ProjectPriority.MEDIUM,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.material.createMany({
    data: [
      {
        name: "Argamassa ACIII",
        category: "Cimento e argamassa",
        unit: "saco",
        brand: "Quartzolit",
        internalCode: "MAT-ARG-ACIII",
        averagePrice: 42.9,
        minimumStock: 12,
      },
      {
        name: "Cabo flexivel 2,5mm",
        category: "Eletrica",
        unit: "metro",
        brand: "Sil",
        internalCode: "MAT-ELE-CAB25",
        averagePrice: 2.8,
        minimumStock: 120,
      },
    ],
    skipDuplicates: true,
  });
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
