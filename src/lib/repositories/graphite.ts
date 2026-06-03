import {
  clients as demoClients,
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

export type ProjectDetails = ProjectListItem & {
  areas: ProjectAreaItem[];
  tasks: TaskItem[];
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
