import {
  clients as demoClients,
  materials as demoMaterials,
  projectAreas as demoProjectAreas,
  projects as demoProjects,
  tasks as demoTasks,
} from "@/lib/data/graphite";

export type ClientFilters = {
  query?: string;
  type?: string;
  status?: string;
};

export type ProjectFilters = {
  query?: string;
  status?: string;
  manager?: string;
  type?: string;
};

const projectStatusLabels: Record<string, string> = {
  BUDGET: "Orcamento",
  PLANNING: "Planejamento",
  IN_PROGRESS: "Em andamento",
  PAUSED: "Pausada",
  WAITING_CLIENT: "Aguardando cliente",
  WAITING_MATERIAL: "Aguardando material",
  WAITING_CONTRACTOR: "Aguardando terceirizado",
  INSPECTION: "Em vistoria",
  COMPLETED: "Concluida",
  CANCELED: "Cancelada",
};

const priorityLabels: Record<string, string> = {
  HIGH: "Alta",
  MEDIUM: "Media",
  LOW: "Baixa",
};

const recordStatusLabels: Record<string, string> = {
  ACTIVE: "Ativo",
  INACTIVE: "Inativo",
  ARCHIVED: "Arquivado",
};

const taskStatusLabels: Record<string, string> = {
  TODO: "A fazer",
  IN_PROGRESS: "Em andamento",
  PAUSED: "Pausada",
  BLOCKED: "Bloqueada",
  WAITING_MATERIAL: "Aguardando material",
  WAITING_APPROVAL: "Aguardando aprovacao",
  COMPLETED: "Concluida",
  REJECTED: "Reprovada",
  CANCELED: "Cancelada",
};

export type ClientListItem = (typeof demoClients)[number];
export type ProjectListItem = (typeof demoProjects)[number];
export type ProjectAreaItem = (typeof demoProjectAreas)[number];
export type TaskItem = (typeof demoTasks)[number];
export type MaterialListItem = (typeof demoMaterials)[number];

export type ProjectDetails = ProjectListItem & {
  areas: ProjectAreaItem[];
  tasks: TaskItem[];
};

const stockMovementSigns: Record<string, number> = {
  PURCHASE_ENTRY: 1,
  TRANSFER_ENTRY: 1,
  CONSUMPTION: -1,
  DISPOSAL: -1,
  LOSS: -1,
  RETURN_TO_CENTRAL: -1,
};

const purchaseStatusLabels: Record<string, string> = {
  REQUESTED: "Solicitada",
  QUOTING: "Em cotacao",
  WAITING_APPROVAL: "Aguardando aprovacao",
  APPROVED: "Aprovada",
  PURCHASED: "Comprada",
  RECEIVED: "Recebida",
  CANCELED: "Cancelada",
  REJECTED: "Reprovada",
};

const stockMovementLabels: Record<string, string> = {
  PURCHASE_ENTRY: "Entrada por compra",
  TRANSFER_ENTRY: "Entrada por transferencia",
  CONSUMPTION: "Consumo",
  DISPOSAL: "Descarte",
  LOSS: "Perda",
  RETURN_TO_CENTRAL: "Retorno ao central",
};

export type PurchaseListItem = {
  id: string;
  project: string;
  requester: string;
  status: string;
  urgency: string;
  neededBy: string;
  estimatedTotal: number;
  approvedTotal: number;
  items: number;
};

export type StockMovementListItem = {
  id: string;
  project: string;
  material: string;
  movementType: string;
  quantity: number;
  unit: string;
  totalCost: number;
  createdBy: string;
  createdAt: string;
};

export type EmployeeListItem = {
  id: string;
  name: string;
  jobTitle: string;
  specialty: string;
  employmentType: string;
  phone: string;
  status: string;
  dailyRate: number;
  salary: number;
};

export type ContractorListItem = {
  id: string;
  name: string;
  contactName: string;
  specialty: string;
  phone: string;
  email: string;
  status: string;
  rating: number | null;
  activeContracts: number;
};

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

function formatDate(value: Date | null | undefined) {
  return value ? value.toISOString().slice(0, 10) : "-";
}

function toNumber(value: unknown) {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}

function projectProgress(tasks: Array<{ status: string }>) {
  if (tasks.length === 0) {
    return 0;
  }

  const completed = tasks.filter((task) => task.status === "COMPLETED").length;
  return Math.round((completed / tasks.length) * 100);
}

function demoProjectDetails(id: string): ProjectDetails | null {
  const project = demoProjects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  return {
    ...project,
    areas: demoProjectAreas,
    tasks: demoTasks,
  };
}

function includesNormalized(value: string, query: string) {
  return value.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"));
}

function filterDemoClients(filters: ClientFilters) {
  const query = filters.query?.trim() ?? "";

  return demoClients.filter((client) => {
    const matchesQuery =
      !query ||
      [client.name, client.document, client.email, client.phone].some((value) => includesNormalized(value, query));
    const matchesType = !filters.type || client.type === filters.type;
    const matchesStatus = !filters.status || client.status === filters.status;

    return matchesQuery && matchesType && matchesStatus;
  });
}

function filterDemoProjects(filters: ProjectFilters) {
  const query = filters.query?.trim() ?? "";

  return demoProjects.filter((project) => {
    const matchesQuery =
      !query ||
      [project.name, project.client, project.code, project.address].some((value) => includesNormalized(value, query));
    const matchesStatus = !filters.status || project.status === filters.status;
    const matchesManager = !filters.manager || project.manager === filters.manager;
    const matchesType = !filters.type || project.type === filters.type;

    return matchesQuery && matchesStatus && matchesManager && matchesType;
  });
}

export async function getClients(filters: ClientFilters = {}): Promise<ClientListItem[]> {
  if (!hasDatabaseUrl()) {
    return filterDemoClients(filters);
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const clients = await prisma.client.findMany({
      where: {
        AND: [
          filters.query
            ? {
                OR: [
                  { name: { contains: filters.query, mode: "insensitive" } },
                  { documentNumber: { contains: filters.query, mode: "insensitive" } },
                  { email: { contains: filters.query, mode: "insensitive" } },
                  { phone: { contains: filters.query, mode: "insensitive" } },
                ],
              }
            : {},
          filters.type ? { clientType: filters.type } : {},
          filters.status
            ? {
                status: Object.entries(recordStatusLabels).find(([, label]) => label === filters.status)?.[0] as
                  | "ACTIVE"
                  | "INACTIVE"
                  | "ARCHIVED"
                  | undefined,
              }
            : {},
        ],
      },
      include: {
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return clients.map((client) => ({
      id: client.id,
      name: client.name,
      type: client.clientType,
      document: client.documentNumber ?? "-",
      phone: client.phone ?? client.whatsapp ?? "-",
      email: client.email ?? "-",
      address: client.address ?? "-",
      status: recordStatusLabels[client.status] ?? client.status,
      projects: client._count.projects,
      lastContact: formatDate(client.updatedAt),
    }));
  } catch (error) {
    console.warn("Falha ao buscar clientes no banco. Usando dados demo.", error);
    return filterDemoClients(filters);
  }
}

export async function getProjects(filters: ProjectFilters = {}): Promise<ProjectListItem[]> {
  if (!hasDatabaseUrl()) {
    return filterDemoProjects(filters);
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const projects = await prisma.project.findMany({
      where: {
        AND: [
          filters.query
            ? {
                OR: [
                  { name: { contains: filters.query, mode: "insensitive" } },
                  { code: { contains: filters.query, mode: "insensitive" } },
                  { address: { contains: filters.query, mode: "insensitive" } },
                  { client: { name: { contains: filters.query, mode: "insensitive" } } },
                ],
              }
            : {},
          filters.status
            ? {
                status: Object.entries(projectStatusLabels).find(([, label]) => label === filters.status)?.[0] as
                  | "BUDGET"
                  | "PLANNING"
                  | "IN_PROGRESS"
                  | "PAUSED"
                  | "WAITING_CLIENT"
                  | "WAITING_MATERIAL"
                  | "WAITING_CONTRACTOR"
                  | "INSPECTION"
                  | "COMPLETED"
                  | "CANCELED"
                  | undefined,
              }
            : {},
          filters.manager ? { manager: { name: filters.manager } } : {},
          filters.type ? { projectType: filters.type } : {},
        ],
      },
      include: {
        client: true,
        manager: true,
        technicalResponsible: true,
        tasks: {
          select: {
            status: true,
            plannedEndDate: true,
          },
        },
        _count: {
          select: {
            purchaseRequests: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return projects.map((project) => ({
      id: project.id,
      code: project.code,
      name: project.name,
      client: project.client.name,
      type: project.projectType,
      address: project.address,
      manager: project.manager?.name ?? "-",
      technicalResponsible: project.technicalResponsible?.name ?? "-",
      plannedStart: formatDate(project.plannedStartDate),
      plannedEnd: formatDate(project.plannedEndDate),
      budget: toNumber(project.plannedBudget),
      actualCost: toNumber(project.actualCost),
      progress: projectProgress(project.tasks),
      status: projectStatusLabels[project.status] ?? project.status,
      priority: priorityLabels[project.priority] ?? project.priority,
      pendingApprovals: project._count.purchaseRequests,
      overdueTasks: project.tasks.filter(
        (task) => task.plannedEndDate && task.plannedEndDate < new Date() && task.status !== "COMPLETED",
      ).length,
    }));
  } catch (error) {
    console.warn("Falha ao buscar obras no banco. Usando dados demo.", error);
    return filterDemoProjects(filters);
  }
}

export async function getProjectDetails(id: string): Promise<ProjectDetails | null> {
  if (!hasDatabaseUrl()) {
    return demoProjectDetails(id);
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
      include: {
        client: true,
        manager: true,
        technicalResponsible: true,
        areas: {
          include: {
            responsible: true,
            tasks: {
              select: {
                status: true,
              },
            },
          },
          orderBy: {
            name: "asc",
          },
        },
        tasks: {
          include: {
            area: true,
            assignedToUser: true,
            assignedToContractor: true,
          },
          orderBy: {
            plannedEndDate: "asc",
          },
        },
        _count: {
          select: {
            purchaseRequests: true,
          },
        },
      },
    });

    if (!project) {
      return null;
    }

    const mappedTasks: TaskItem[] = project.tasks.map((task) => ({
      id: task.id,
      title: task.title,
      project: project.name,
      area: task.area?.name ?? "-",
      serviceType: task.serviceType,
      owner: task.assignedToUser?.name ?? task.assignedToContractor?.name ?? "-",
      status: taskStatusLabels[task.status] ?? task.status,
      priority: priorityLabels[task.priority] ?? task.priority,
      due: formatDate(task.plannedEndDate),
    }));

    return {
      id: project.id,
      code: project.code,
      name: project.name,
      client: project.client.name,
      type: project.projectType,
      address: project.address,
      manager: project.manager?.name ?? "-",
      technicalResponsible: project.technicalResponsible?.name ?? "-",
      plannedStart: formatDate(project.plannedStartDate),
      plannedEnd: formatDate(project.plannedEndDate),
      budget: toNumber(project.plannedBudget),
      actualCost: toNumber(project.actualCost),
      progress: projectProgress(project.tasks),
      status: projectStatusLabels[project.status] ?? project.status,
      priority: priorityLabels[project.priority] ?? project.priority,
      pendingApprovals: project._count.purchaseRequests,
      overdueTasks: project.tasks.filter(
        (task) => task.plannedEndDate && task.plannedEndDate < new Date() && task.status !== "COMPLETED",
      ).length,
      areas: project.areas.map((area) => ({
        name: area.name,
        status: area.status,
        progress: projectProgress(area.tasks),
        owner: area.responsible?.name ?? "-",
        tasks: area.tasks.length,
      })),
      tasks: mappedTasks,
    };
  } catch (error) {
    console.warn("Falha ao buscar detalhe da obra no banco. Usando dados demo.", error);
    return demoProjectDetails(id);
  }
}

export async function getTasks(): Promise<TaskItem[]> {
  if (!hasDatabaseUrl()) {
    return demoTasks;
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const tasks = await prisma.task.findMany({
      include: {
        project: true,
        area: true,
        assignedToUser: true,
        assignedToContractor: true,
      },
      orderBy: [
        {
          plannedEndDate: "asc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });

    return tasks.map((task) => ({
      id: task.id,
      title: task.title,
      project: task.project.name,
      area: task.area?.name ?? "-",
      serviceType: task.serviceType,
      owner: task.assignedToUser?.name ?? task.assignedToContractor?.name ?? "-",
      status: taskStatusLabels[task.status] ?? task.status,
      priority: priorityLabels[task.priority] ?? task.priority,
      due: formatDate(task.plannedEndDate),
    }));
  } catch (error) {
    console.warn("Falha ao buscar tarefas no banco. Usando dados demo.", error);
    return demoTasks;
  }
}

export async function getMaterials(): Promise<MaterialListItem[]> {
  if (!hasDatabaseUrl()) {
    return demoMaterials;
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const materials = await prisma.material.findMany({
      include: {
        stockMovements: {
          select: {
            movementType: true,
            quantity: true,
          },
        },
      },
      orderBy: [
        {
          category: "asc",
        },
        {
          name: "asc",
        },
      ],
    });

    return materials.map((material) => {
      const stock = material.stockMovements.reduce((total, movement) => {
        const sign = stockMovementSigns[movement.movementType] ?? 0;
        return total + Number(movement.quantity) * sign;
      }, 0);

      return {
        name: material.name,
        category: material.category,
        unit: material.unit,
        stock,
        minimum: toNumber(material.minimumStock),
        averagePrice: toNumber(material.averagePrice),
      };
    });
  } catch (error) {
    console.warn("Falha ao buscar materiais no banco. Usando dados demo.", error);
    return demoMaterials;
  }
}

export async function getPurchases(): Promise<PurchaseListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const purchases = await prisma.purchaseRequest.findMany({
      include: {
        project: true,
        requestedBy: true,
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return purchases.map((purchase) => ({
      id: purchase.id,
      project: purchase.project.name,
      requester: purchase.requestedBy.name,
      status: purchaseStatusLabels[purchase.status] ?? purchase.status,
      urgency: purchase.urgency ?? "-",
      neededBy: formatDate(purchase.neededBy),
      estimatedTotal: toNumber(purchase.estimatedTotal),
      approvedTotal: toNumber(purchase.approvedTotal),
      items: purchase._count.items,
    }));
  } catch (error) {
    console.warn("Falha ao buscar compras no banco.", error);
    return [];
  }
}

export async function getStockMovements(): Promise<StockMovementListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const movements = await prisma.stockMovement.findMany({
      include: {
        project: true,
        material: true,
        createdBy: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 80,
    });

    return movements.map((movement) => ({
      id: movement.id,
      project: movement.project.name,
      material: movement.material.name,
      movementType: stockMovementLabels[movement.movementType] ?? movement.movementType,
      quantity: toNumber(movement.quantity),
      unit: movement.unit,
      totalCost: toNumber(movement.totalCost),
      createdBy: movement.createdBy.name,
      createdAt: formatDate(movement.createdAt),
    }));
  } catch (error) {
    console.warn("Falha ao buscar movimentacoes de estoque no banco.", error);
    return [];
  }
}

export async function getEmployees(): Promise<EmployeeListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const employees = await prisma.employee.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return employees.map((employee) => ({
      id: employee.id,
      name: employee.name,
      jobTitle: employee.jobTitle,
      specialty: employee.specialty ?? "-",
      employmentType: employee.employmentType ?? "-",
      phone: employee.phone ?? "-",
      status: recordStatusLabels[employee.status] ?? employee.status,
      dailyRate: toNumber(employee.dailyRate),
      salary: toNumber(employee.salary),
    }));
  } catch (error) {
    console.warn("Falha ao buscar funcionarios no banco.", error);
    return [];
  }
}

export async function getContractors(): Promise<ContractorListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const contractors = await prisma.contractor.findMany({
      include: {
        _count: {
          select: {
            projectContracts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return contractors.map((contractor) => ({
      id: contractor.id,
      name: contractor.name,
      contactName: contractor.contactName ?? "-",
      specialty: contractor.specialty ?? "-",
      phone: contractor.phone ?? "-",
      email: contractor.email ?? "-",
      status: recordStatusLabels[contractor.status] ?? contractor.status,
      rating: contractor.rating,
      activeContracts: contractor._count.projectContracts,
    }));
  } catch (error) {
    console.warn("Falha ao buscar terceirizados no banco.", error);
    return [];
  }
}
