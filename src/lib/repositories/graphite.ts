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

const allocationStatusLabels: Record<string, string> = {
  PLANNED: "Planejada",
  ACTIVE: "Ativa",
  PAUSED: "Pausada",
  FINISHED: "Finalizada",
  CANCELED: "Cancelada",
};

const attendanceStatusLabels: Record<string, string> = {
  PRESENT: "Presente",
  PARTIAL: "Parcial",
  ABSENT: "Ausente",
  TRANSFERRED: "Deslocado",
};

const budgetItemStatusLabels: Record<string, string> = {
  PLANNED: "Planejado",
  IN_PROGRESS: "Em andamento",
  COMPLETED: "Concluido",
  CANCELED: "Cancelado",
};

const measurementStatusLabels: Record<string, string> = {
  DRAFT: "Rascunho",
  SUBMITTED: "Enviada",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  INVOICED: "Faturada",
};

export type ClientListItem = (typeof demoClients)[number];
export type ProjectListItem = (typeof demoProjects)[number];
export type ProjectAreaItem = (typeof demoProjectAreas)[number];
export type TaskItem = (typeof demoTasks)[number];
export type MaterialListItem = {
  id: string;
  name: string;
  category: string;
  unit: string;
  brand: string;
  internalCode: string;
  stock: number;
  minimum: number;
  averagePrice: number;
  notes: string;
};

export type ProjectDetails = ProjectListItem & {
  areas: ProjectAreaItem[];
  tasks: TaskItem[];
  materialRequests: PurchaseListItem[];
  stockMovements: StockMovementListItem[];
  employeeAllocations: EmployeeAllocationListItem[];
  contractors: ProjectContractorItem[];
  financialEntries: ProjectFinancialEntryItem[];
  budgetItems: BudgetItemListItem[];
  measurements: MeasurementListItem[];
  files: ProjectFileItem[];
  dailyReports: DailyReportListItem[];
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
  projectId: string;
  project: string;
  requester: string;
  status: string;
  urgency: string;
  neededBy: string;
  estimatedTotal: number;
  approvedTotal: number;
  items: number;
  justification: string;
  notes: string;
};

export type PurchaseRequestItemLine = {
  id: string;
  materialId: string;
  material: string;
  description: string;
  quantity: number;
  unit: string;
  estimatedUnitPrice: number;
  approvedUnitPrice: number;
};

export type PurchaseDetails = PurchaseListItem & {
  itemLines: PurchaseRequestItemLine[];
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

export type ProjectContractorItem = {
  id: string;
  contractor: string;
  contact: string;
  serviceDescription: string;
  contractedValue: number;
  startDate: string;
  endDate: string;
  status: string;
};

export type ProjectFinancialEntryItem = {
  id: string;
  entryType: string;
  category: string;
  description: string;
  amount: number;
  dueDate: string;
  paidAt: string;
  status: string;
};

export type ProjectFileItem = {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  category: string;
  mimeType: string;
  uploadedBy: string;
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

export type EmployeeAllocationListItem = {
  id: string;
  projectId: string;
  project: string;
  employeeId: string;
  employee: string;
  jobTitle: string;
  role: string;
  serviceDescription: string;
  startDate: string;
  endDate: string;
  dailyRate: number;
  status: string;
  notes: string;
};

export type EmployeeAllocationDetails = EmployeeAllocationListItem;

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

export type ProjectTaskOption = {
  id: string;
  name: string;
  code: string;
  areas: Array<{
    id: string;
    name: string;
  }>;
};

export type TaskDetails = {
  id: string;
  projectId: string;
  areaId: string;
  title: string;
  description: string;
  serviceType: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: string;
  priority: string;
};

export type DailyReportListItem = {
  id: string;
  project: string;
  projectId: string;
  reportDate: string;
  createdBy: string;
  servicesExecuted: string;
  occurrences: string;
  issues: string;
  pendingItems: string;
  validatedAt: string;
};

export type DailyReportDetails = DailyReportListItem & {
  teamNotes: string;
  materialsReceived: string;
  materialsUsed: string;
  weatherNotes: string;
  attendances: DailyReportAttendanceItem[];
};

export type DailyReportAttendanceItem = {
  id: string;
  employeeId: string;
  employee: string;
  status: string;
  hoursWorked: number;
  transferredToProjectId: string;
  transferredToProject: string;
  notes: string;
};

export type BudgetItemListItem = {
  id: string;
  projectId: string;
  project: string;
  taskId: string;
  task: string;
  code: string;
  phase: string;
  description: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  physicalWeight: number;
  plannedStartDate: string;
  plannedEndDate: string;
  physicalProgress: number;
  status: string;
  notes: string;
};

export type MeasurementListItem = {
  id: string;
  projectId: string;
  project: string;
  budgetItemId: string;
  budgetItem: string;
  measuredAt: string;
  periodStartDate: string;
  periodEndDate: string;
  quantityMeasured: number;
  amountMeasured: number;
  physicalProgress: number;
  status: string;
  createdBy: string;
  notes: string;
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
    materialRequests: [],
    stockMovements: [],
    employeeAllocations: [],
    contractors: [],
    financialEntries: [],
    budgetItems: [],
    measurements: [],
    files: [],
    dailyReports: [],
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

function getDemoMaterials(): MaterialListItem[] {
  return demoMaterials.map((material) => ({
    id: material.name,
    name: material.name,
    category: material.category,
    unit: material.unit,
    brand: "-",
    internalCode: "-",
    stock: material.stock,
    minimum: material.minimum,
    averagePrice: material.averagePrice,
    notes: "",
  }));
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
        projectContractors: {
          include: {
            contractor: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        purchaseRequests: {
          include: {
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
        },
        stockMovements: {
          include: {
            material: true,
            createdBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 40,
        },
        employeeAllocations: {
          include: {
            employee: true,
          },
          orderBy: {
            startDate: "desc",
          },
        },
        financialEntries: {
          orderBy: {
            dueDate: "asc",
          },
        },
        budgetItems: {
          include: {
            task: true,
          },
          orderBy: [
            {
              plannedStartDate: "asc",
            },
            {
              phase: "asc",
            },
          ],
        },
        serviceMeasurements: {
          include: {
            budgetItem: true,
            createdBy: true,
          },
          orderBy: {
            measuredAt: "desc",
          },
        },
        files: {
          include: {
            uploadedBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        dailyReports: {
          include: {
            createdBy: true,
          },
          orderBy: {
            reportDate: "desc",
          },
          take: 30,
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
      materialRequests: project.purchaseRequests.map((purchase) => ({
        id: purchase.id,
        projectId: purchase.projectId,
        project: project.name,
        requester: purchase.requestedBy.name,
        status: purchaseStatusLabels[purchase.status] ?? purchase.status,
        urgency: purchase.urgency ?? "-",
        neededBy: formatDate(purchase.neededBy),
        estimatedTotal: toNumber(purchase.estimatedTotal),
        approvedTotal: toNumber(purchase.approvedTotal),
        items: purchase._count.items,
        justification: purchase.justification ?? "",
        notes: purchase.notes ?? "",
      })),
      stockMovements: project.stockMovements.map((movement) => ({
        id: movement.id,
        project: project.name,
        material: movement.material.name,
        movementType: stockMovementLabels[movement.movementType] ?? movement.movementType,
        quantity: toNumber(movement.quantity),
        unit: movement.unit,
        totalCost: toNumber(movement.totalCost),
        createdBy: movement.createdBy.name,
        createdAt: formatDate(movement.createdAt),
      })),
      employeeAllocations: project.employeeAllocations.map((allocation) => ({
        id: allocation.id,
        projectId: allocation.projectId,
        project: project.name,
        employeeId: allocation.employeeId,
        employee: allocation.employee.name,
        jobTitle: allocation.employee.jobTitle,
        role: allocation.role,
        serviceDescription: allocation.serviceDescription ?? "-",
        startDate: formatDate(allocation.startDate),
        endDate: formatDate(allocation.endDate),
        dailyRate: toNumber(allocation.dailyRate),
        status: allocationStatusLabels[allocation.status] ?? allocation.status,
        notes: allocation.notes ?? "",
      })),
      contractors: project.projectContractors.map((contract) => ({
        id: contract.id,
        contractor: contract.contractor.name,
        contact: contract.contractor.contactName ?? contract.contractor.phone ?? "-",
        serviceDescription: contract.serviceDescription,
        contractedValue: toNumber(contract.contractedValue),
        startDate: formatDate(contract.startDate),
        endDate: formatDate(contract.endDate),
        status: contract.status,
      })),
      financialEntries: project.financialEntries.map((entry) => ({
        id: entry.id,
        entryType: entry.entryType,
        category: entry.category,
        description: entry.description,
        amount: toNumber(entry.amount),
        dueDate: formatDate(entry.dueDate),
        paidAt: formatDate(entry.paidAt),
        status: entry.status,
      })),
      budgetItems: project.budgetItems.map((item) => ({
        id: item.id,
        projectId: item.projectId,
        project: project.name,
        taskId: item.taskId ?? "",
        task: item.task?.title ?? "-",
        code: item.code ?? "-",
        phase: item.phase,
        description: item.description,
        unit: item.unit,
        quantity: toNumber(item.quantity),
        unitPrice: toNumber(item.unitPrice),
        totalPrice: toNumber(item.totalPrice),
        physicalWeight: toNumber(item.physicalWeight),
        plannedStartDate: formatDate(item.plannedStartDate),
        plannedEndDate: formatDate(item.plannedEndDate),
        physicalProgress: toNumber(item.physicalProgress),
        status: budgetItemStatusLabels[item.status] ?? item.status,
        notes: item.notes ?? "",
      })),
      measurements: project.serviceMeasurements.map((measurement) => ({
        id: measurement.id,
        projectId: measurement.projectId,
        project: project.name,
        budgetItemId: measurement.budgetItemId,
        budgetItem: measurement.budgetItem.description,
        measuredAt: formatDate(measurement.measuredAt),
        periodStartDate: formatDate(measurement.periodStartDate),
        periodEndDate: formatDate(measurement.periodEndDate),
        quantityMeasured: toNumber(measurement.quantityMeasured),
        amountMeasured: toNumber(measurement.amountMeasured),
        physicalProgress: toNumber(measurement.physicalProgress),
        status: measurementStatusLabels[measurement.status] ?? measurement.status,
        createdBy: measurement.createdBy.name,
        notes: measurement.notes ?? "",
      })),
      files: project.files.map((file) => ({
        id: file.id,
        fileName: file.fileName,
        fileUrl: file.fileUrl,
        fileType: file.fileType,
        category: file.category ?? "-",
        mimeType: file.mimeType,
        uploadedBy: file.uploadedBy.name,
        createdAt: formatDate(file.createdAt),
      })),
      dailyReports: project.dailyReports.map((report) => ({
        id: report.id,
        project: project.name,
        projectId: report.projectId,
        reportDate: formatDate(report.reportDate),
        createdBy: report.createdBy.name,
        servicesExecuted: report.servicesExecuted ?? "-",
        occurrences: report.occurrences ?? "-",
        issues: report.issues ?? "-",
        pendingItems: report.pendingItems ?? "-",
        validatedAt: formatDate(report.validatedAt),
      })),
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

export async function getTaskDetails(id: string): Promise<TaskDetails | null> {
  if (!hasDatabaseUrl()) {
    const task = demoTasks.find((item) => item.id === id);

    if (!task) {
      return null;
    }

    const project = demoProjects.find((item) => item.name === task.project);
    const area = demoProjectAreas.find((item) => item.name === task.area);

    return {
      id: task.id,
      projectId: project?.id ?? "",
      areaId: area?.name ?? "",
      title: task.title,
      description: "",
      serviceType: task.serviceType,
      plannedStartDate: "",
      plannedEndDate: task.due === "-" ? "" : task.due,
      status: task.status,
      priority: task.priority,
    };
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      return null;
    }

    return {
      id: task.id,
      projectId: task.projectId,
      areaId: task.areaId ?? "",
      title: task.title,
      description: task.description ?? "",
      serviceType: task.serviceType,
      plannedStartDate: task.plannedStartDate ? task.plannedStartDate.toISOString().slice(0, 10) : "",
      plannedEndDate: task.plannedEndDate ? task.plannedEndDate.toISOString().slice(0, 10) : "",
      status: taskStatusLabels[task.status] ?? task.status,
      priority: priorityLabels[task.priority] ?? task.priority,
    };
  } catch (error) {
    console.warn("Falha ao buscar tarefa no banco.", error);
    return null;
  }
}

export async function getMaterials(): Promise<MaterialListItem[]> {
  if (!hasDatabaseUrl()) {
    return getDemoMaterials();
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
        id: material.id,
        name: material.name,
        category: material.category,
        unit: material.unit,
        brand: material.brand ?? "-",
        internalCode: material.internalCode ?? "-",
        stock,
        minimum: toNumber(material.minimumStock),
        averagePrice: toNumber(material.averagePrice),
        notes: material.notes ?? "",
      };
    });
  } catch (error) {
    console.warn("Falha ao buscar materiais no banco. Usando dados demo.", error);
    return getDemoMaterials();
  }
}

export async function getMaterialDetails(id: string): Promise<MaterialListItem | null> {
  if (!hasDatabaseUrl()) {
    return getDemoMaterials().find((material) => material.id === id) ?? null;
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const material = await prisma.material.findUnique({
      where: {
        id,
      },
      include: {
        stockMovements: {
          select: {
            movementType: true,
            quantity: true,
          },
        },
      },
    });

    if (!material) {
      return null;
    }

    const stock = material.stockMovements.reduce((total, movement) => {
      const sign = stockMovementSigns[movement.movementType] ?? 0;
      return total + Number(movement.quantity) * sign;
    }, 0);

    return {
      id: material.id,
      name: material.name,
      category: material.category,
      unit: material.unit,
      brand: material.brand ?? "",
      internalCode: material.internalCode ?? "",
      stock,
      minimum: toNumber(material.minimumStock),
      averagePrice: toNumber(material.averagePrice),
      notes: material.notes ?? "",
    };
  } catch (error) {
    console.warn("Falha ao buscar material no banco.", error);
    return null;
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
      projectId: purchase.projectId,
      project: purchase.project.name,
      requester: purchase.requestedBy.name,
      status: purchaseStatusLabels[purchase.status] ?? purchase.status,
      urgency: purchase.urgency ?? "-",
      neededBy: formatDate(purchase.neededBy),
      estimatedTotal: toNumber(purchase.estimatedTotal),
      approvedTotal: toNumber(purchase.approvedTotal),
      items: purchase._count.items,
      justification: purchase.justification ?? "",
      notes: purchase.notes ?? "",
    }));
  } catch (error) {
    console.warn("Falha ao buscar compras no banco.", error);
    return [];
  }
}

export async function getPurchaseDetails(id: string): Promise<PurchaseDetails | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const purchase = await prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        project: true,
        requestedBy: true,
        items: {
          include: {
            material: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!purchase) {
      return null;
    }

    return {
      id: purchase.id,
      projectId: purchase.projectId,
      project: purchase.project.name,
      requester: purchase.requestedBy.name,
      status: purchaseStatusLabels[purchase.status] ?? purchase.status,
      urgency: purchase.urgency ?? "",
      neededBy: purchase.neededBy ? formatDate(purchase.neededBy) : "",
      estimatedTotal: toNumber(purchase.estimatedTotal),
      approvedTotal: toNumber(purchase.approvedTotal),
      items: purchase.items.length,
      justification: purchase.justification ?? "",
      notes: purchase.notes ?? "",
      itemLines: purchase.items.map((item) => ({
        id: item.id,
        materialId: item.materialId ?? "",
        material: item.material?.name ?? "-",
        description: item.description ?? "",
        quantity: toNumber(item.quantity),
        unit: item.unit,
        estimatedUnitPrice: toNumber(item.estimatedUnitPrice),
        approvedUnitPrice: toNumber(item.approvedUnitPrice),
      })),
    };
  } catch (error) {
    console.warn("Falha ao buscar pedido de material.", error);
    return null;
  }
}

export async function getMaterialOptions(): Promise<Array<{ id: string; name: string; unit: string; averagePrice: number }>> {
  if (!hasDatabaseUrl()) {
    return getDemoMaterials().map((material) => ({
      id: material.id,
      name: material.name,
      unit: material.unit,
      averagePrice: material.averagePrice,
    }));
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const materials = await prisma.material.findMany({
      select: {
        id: true,
        name: true,
        unit: true,
        averagePrice: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return materials.map((material) => ({
      id: material.id,
      name: material.name,
      unit: material.unit,
      averagePrice: toNumber(material.averagePrice),
    }));
  } catch (error) {
    console.warn("Falha ao buscar materiais para pedido.", error);
    return [];
  }
}

export async function getBudgetItems(): Promise<BudgetItemListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const items = await prisma.budgetItem.findMany({
      include: {
        project: true,
        task: true,
      },
      orderBy: [
        { project: { updatedAt: "desc" } },
        { plannedStartDate: "asc" },
      ],
    });

    return items.map((item) => ({
      id: item.id,
      projectId: item.projectId,
      project: item.project.name,
      taskId: item.taskId ?? "",
      task: item.task?.title ?? "-",
      code: item.code ?? "-",
      phase: item.phase,
      description: item.description,
      unit: item.unit,
      quantity: toNumber(item.quantity),
      unitPrice: toNumber(item.unitPrice),
      totalPrice: toNumber(item.totalPrice),
      physicalWeight: toNumber(item.physicalWeight),
      plannedStartDate: formatDate(item.plannedStartDate),
      plannedEndDate: formatDate(item.plannedEndDate),
      physicalProgress: toNumber(item.physicalProgress),
      status: budgetItemStatusLabels[item.status] ?? item.status,
      notes: item.notes ?? "",
    }));
  } catch (error) {
    console.warn("Falha ao buscar itens de orcamento no banco.", error);
    return [];
  }
}

export async function getBudgetItemDetails(id: string): Promise<BudgetItemListItem | null> {
  const items = await getBudgetItems();
  return items.find((item) => item.id === id) ?? null;
}

export async function getBudgetItemOptions(): Promise<Array<{ id: string; projectId: string; label: string; unitPrice: number }>> {
  const items = await getBudgetItems();
  return items.map((item) => ({
    id: item.id,
    projectId: item.projectId,
    label: `${item.project} - ${item.phase} - ${item.description}`,
    unitPrice: item.unitPrice,
  }));
}

export async function getMeasurements(): Promise<MeasurementListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const measurements = await prisma.serviceMeasurement.findMany({
      include: {
        project: true,
        budgetItem: true,
        createdBy: true,
      },
      orderBy: {
        measuredAt: "desc",
      },
    });

    return measurements.map((measurement) => ({
      id: measurement.id,
      projectId: measurement.projectId,
      project: measurement.project.name,
      budgetItemId: measurement.budgetItemId,
      budgetItem: measurement.budgetItem.description,
      measuredAt: formatDate(measurement.measuredAt),
      periodStartDate: formatDate(measurement.periodStartDate),
      periodEndDate: formatDate(measurement.periodEndDate),
      quantityMeasured: toNumber(measurement.quantityMeasured),
      amountMeasured: toNumber(measurement.amountMeasured),
      physicalProgress: toNumber(measurement.physicalProgress),
      status: measurementStatusLabels[measurement.status] ?? measurement.status,
      createdBy: measurement.createdBy.name,
      notes: measurement.notes ?? "",
    }));
  } catch (error) {
    console.warn("Falha ao buscar medicoes no banco.", error);
    return [];
  }
}

export async function getMeasurementDetails(id: string): Promise<MeasurementListItem | null> {
  const measurements = await getMeasurements();
  return measurements.find((measurement) => measurement.id === id) ?? null;
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

export async function getDailyReports(): Promise<DailyReportListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const reports = await prisma.dailyReport.findMany({
      include: {
        project: true,
        createdBy: true,
        attendances: {
          include: {
            employee: true,
            transferredToProject: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        reportDate: "desc",
      },
      take: 120,
    });

    return reports.map((report) => ({
      id: report.id,
      project: report.project.name,
      projectId: report.projectId,
      reportDate: formatDate(report.reportDate),
      createdBy: report.createdBy.name,
      servicesExecuted: report.servicesExecuted ?? "-",
      occurrences: report.occurrences ?? "-",
      issues: report.issues ?? "-",
      pendingItems: report.pendingItems ?? "-",
      validatedAt: formatDate(report.validatedAt),
    }));
  } catch (error) {
    console.warn("Falha ao buscar diarios de obra no banco.", error);
    return [];
  }
}

export async function getDailyReportDetails(id: string): Promise<DailyReportDetails | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const report = await prisma.dailyReport.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
        createdBy: true,
      },
    });

    if (!report) {
      return null;
    }

    const attendances = await prisma.dailyReportAttendance.findMany({
      where: {
        dailyReportId: id,
      },
      include: {
        employee: true,
        transferredToProject: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return {
      id: report.id,
      project: report.project.name,
      projectId: report.projectId,
      reportDate: formatDate(report.reportDate),
      createdBy: report.createdBy.name,
      servicesExecuted: report.servicesExecuted ?? "",
      occurrences: report.occurrences ?? "",
      issues: report.issues ?? "",
      pendingItems: report.pendingItems ?? "",
      validatedAt: formatDate(report.validatedAt),
      teamNotes: report.teamNotes ?? "",
      materialsReceived: report.materialsReceived ?? "",
      materialsUsed: report.materialsUsed ?? "",
      weatherNotes: report.weatherNotes ?? "",
      attendances: attendances.map((attendance) => ({
        id: attendance.id,
        employeeId: attendance.employeeId,
        employee: attendance.employee.name,
        status: attendanceStatusLabels[attendance.status] ?? attendance.status,
        hoursWorked: toNumber(attendance.hoursWorked),
        transferredToProjectId: attendance.transferredToProjectId ?? "",
        transferredToProject: attendance.transferredToProject?.name ?? "-",
        notes: attendance.notes ?? "",
      })),
    };
  } catch (error) {
    console.warn("Falha ao buscar diario de obra no banco.", error);
    return null;
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

export async function getEmployeeAllocations(): Promise<EmployeeAllocationListItem[]> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const allocations = await prisma.projectEmployeeAllocation.findMany({
      include: {
        project: true,
        employee: true,
      },
      orderBy: [
        {
          startDate: "desc",
        },
        {
          updatedAt: "desc",
        },
      ],
    });

    return allocations.map((allocation) => ({
      id: allocation.id,
      projectId: allocation.projectId,
      project: allocation.project.name,
      employeeId: allocation.employeeId,
      employee: allocation.employee.name,
      jobTitle: allocation.employee.jobTitle,
      role: allocation.role,
      serviceDescription: allocation.serviceDescription ?? "-",
      startDate: formatDate(allocation.startDate),
      endDate: formatDate(allocation.endDate),
      dailyRate: toNumber(allocation.dailyRate),
      status: allocationStatusLabels[allocation.status] ?? allocation.status,
      notes: allocation.notes ?? "",
    }));
  } catch (error) {
    console.warn("Falha ao buscar locacoes de funcionarios no banco.", error);
    return [];
  }
}

export async function getEmployeeAllocationDetails(id: string): Promise<EmployeeAllocationDetails | null> {
  if (!hasDatabaseUrl()) {
    return null;
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const allocation = await prisma.projectEmployeeAllocation.findUnique({
      where: {
        id,
      },
      include: {
        project: true,
        employee: true,
      },
    });

    if (!allocation) {
      return null;
    }

    return {
      id: allocation.id,
      projectId: allocation.projectId,
      project: allocation.project.name,
      employeeId: allocation.employeeId,
      employee: allocation.employee.name,
      jobTitle: allocation.employee.jobTitle,
      role: allocation.role,
      serviceDescription: allocation.serviceDescription ?? "",
      startDate: formatDate(allocation.startDate),
      endDate: allocation.endDate ? formatDate(allocation.endDate) : "",
      dailyRate: toNumber(allocation.dailyRate),
      status: allocationStatusLabels[allocation.status] ?? allocation.status,
      notes: allocation.notes ?? "",
    };
  } catch (error) {
    console.warn("Falha ao buscar locacao de funcionario no banco.", error);
    return null;
  }
}

export async function getEmployeeOptions(): Promise<Array<{ id: string; name: string; jobTitle: string; dailyRate: number }>> {
  if (!hasDatabaseUrl()) {
    return [];
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        jobTitle: true,
        dailyRate: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return employees.map((employee) => ({
      id: employee.id,
      name: employee.name,
      jobTitle: employee.jobTitle,
      dailyRate: toNumber(employee.dailyRate),
    }));
  } catch (error) {
    console.warn("Falha ao buscar funcionarios para locacao.", error);
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

export async function getProjectTaskOptions(): Promise<ProjectTaskOption[]> {
  if (!hasDatabaseUrl()) {
    return demoProjects.map((project) => ({
      id: project.id,
      name: project.name,
      code: project.code,
      areas: demoProjectAreas.map((area) => ({
        id: area.name,
        name: area.name,
      })),
    }));
  }

  try {
    const { prisma } = await import("@/lib/db/prisma");
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        areas: {
          select: {
            id: true,
            name: true,
          },
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return projects;
  } catch (error) {
    console.warn("Falha ao buscar obras para tarefa. Usando dados demo.", error);
    return demoProjects.map((project) => ({
      id: project.id,
      name: project.name,
      code: project.code,
      areas: demoProjectAreas.map((area) => ({
        id: area.name,
        name: area.name,
      })),
    }));
  }
}
