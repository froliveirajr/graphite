import {
  AlertTriangle,
  Archive,
  Boxes,
  BriefcaseBusiness,
  CalendarDays,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  NotebookText,
  HandCoins,
  HardHat,
  Home,
  LayoutDashboard,
  PackageCheck,
  PercentCircle,
  UserCheck,
  Settings,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";

export type ProjectStatus =
  | "Orcamento"
  | "Planejamento"
  | "Em andamento"
  | "Pausada"
  | "Aguardando material"
  | "Em vistoria"
  | "Concluida";

export type Priority = "Alta" | "Media" | "Baixa";

export const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Clientes", href: "/clients", icon: Users },
  { label: "Obras", href: "/projects", icon: HardHat },
  { label: "Tarefas", href: "/tasks", icon: ClipboardCheck },
  { label: "Materiais", href: "/materials", icon: Boxes },
  { label: "Quantitativos", href: "/project-materials", icon: ClipboardCheck },
  { label: "Compras", href: "/purchases", icon: PackageCheck },
  { label: "Orcamento", href: "/budget-items", icon: PercentCircle },
  { label: "Medicoes", href: "/measurements", icon: ClipboardCheck },
  { label: "Estoque", href: "/stock", icon: Archive },
  { label: "Diario de obra", href: "/daily-reports", icon: NotebookText },
  { label: "Funcionarios", href: "/employees", icon: ShieldCheck },
  { label: "Locacoes", href: "/employee-allocations", icon: UserCheck },
  { label: "Terceirizados", href: "/contractors", icon: BriefcaseBusiness },
  { label: "Descarte", href: "/disposals", icon: Truck },
  { label: "Relatorios", href: "/reports", icon: FileText },
  { label: "Configuracoes", href: "/settings", icon: Settings },
];

export const clients = [
  {
    id: "cl-001",
    name: "Restaurante Orla Norte",
    type: "Restaurante",
    document: "12.430.900/0001-72",
    phone: "(11) 98932-4410",
    email: "operacao@orlanorte.com",
    address: "Rua Amauri, 132 - Itaim Bibi",
    status: "Ativo",
    projects: 2,
    lastContact: "2026-05-29",
  },
  {
    id: "cl-002",
    name: "Marina Albuquerque",
    type: "Pessoa fisica",
    document: "329.880.410-90",
    phone: "(11) 97642-1187",
    email: "marina.albuquerque@email.com",
    address: "Av. Portugal, 870 - Brooklin",
    status: "Ativo",
    projects: 1,
    lastContact: "2026-06-01",
  },
  {
    id: "cl-003",
    name: "Vista Capital Offices",
    type: "Empresa",
    document: "44.219.800/0001-31",
    phone: "(11) 3320-1180",
    email: "facilities@vistacapital.com",
    address: "Av. Paulista, 171 - Bela Vista",
    status: "Ativo",
    projects: 3,
    lastContact: "2026-05-24",
  },
];

export const projects = [
  {
    id: "obra-apto-marina",
    code: "GPH-2026-014",
    name: "Apartamento Marina Albuquerque",
    client: "Marina Albuquerque",
    type: "Reforma de apartamento",
    address: "Av. Portugal, 870 - Brooklin",
    manager: "Rafael Torres",
    technicalResponsible: "Camila Duarte",
    plannedStart: "2026-05-06",
    plannedEnd: "2026-08-21",
    budget: 286000,
    actualCost: 148500,
    progress: 54,
    status: "Em andamento" satisfies ProjectStatus,
    priority: "Alta" satisfies Priority,
    pendingApprovals: 3,
    overdueTasks: 2,
  },
  {
    id: "restaurante-orla",
    code: "GPH-2026-011",
    name: "Restaurante Orla Norte",
    client: "Restaurante Orla Norte",
    type: "Restaurante",
    address: "Rua Amauri, 132 - Itaim Bibi",
    manager: "Bianca Reis",
    technicalResponsible: "Camila Duarte",
    plannedStart: "2026-04-18",
    plannedEnd: "2026-07-04",
    budget: 421000,
    actualCost: 332900,
    progress: 72,
    status: "Aguardando material" satisfies ProjectStatus,
    priority: "Alta" satisfies Priority,
    pendingApprovals: 5,
    overdueTasks: 4,
  },
  {
    id: "vista-capital",
    code: "GPH-2026-008",
    name: "Salas Vista Capital",
    client: "Vista Capital Offices",
    type: "Reforma comercial",
    address: "Av. Paulista, 171 - Bela Vista",
    manager: "Rafael Torres",
    technicalResponsible: "Nadia Martins",
    plannedStart: "2026-03-10",
    plannedEnd: "2026-06-28",
    budget: 198000,
    actualCost: 181200,
    progress: 88,
    status: "Em vistoria" satisfies ProjectStatus,
    priority: "Media" satisfies Priority,
    pendingApprovals: 1,
    overdueTasks: 1,
  },
];

export const projectAreas = [
  { name: "Sala integrada", status: "Em andamento", progress: 62, owner: "Equipe interna", tasks: 11 },
  { name: "Cozinha", status: "Aguardando material", progress: 38, owner: "Terceirizado", tasks: 8 },
  { name: "Banheiro social", status: "Concluida", progress: 100, owner: "Equipe interna", tasks: 6 },
  { name: "Varanda", status: "Planejamento", progress: 18, owner: "Rafael Torres", tasks: 4 },
];

export const tasks = [
  {
    id: "tsk-001",
    title: "Finalizar infraestrutura eletrica da cozinha",
    project: "Apartamento Marina Albuquerque",
    area: "Cozinha",
    serviceType: "Eletrica",
    owner: "Andre Lima",
    status: "Em andamento",
    priority: "Alta",
    due: "2026-06-04",
  },
  {
    id: "tsk-002",
    title: "Conferir nivelamento do contrapiso",
    project: "Restaurante Orla Norte",
    area: "Salao do restaurante",
    serviceType: "Piso",
    owner: "Equipe interna",
    status: "Aguardando material",
    priority: "Alta",
    due: "2026-06-03",
  },
  {
    id: "tsk-003",
    title: "Vistoria final de pintura",
    project: "Salas Vista Capital",
    area: "Escritorio",
    serviceType: "Pintura",
    owner: "Bianca Reis",
    status: "A fazer",
    priority: "Media",
    due: "2026-06-07",
  },
  {
    id: "tsk-004",
    title: "Instalar metais do banheiro social",
    project: "Apartamento Marina Albuquerque",
    area: "Banheiro social",
    serviceType: "Acabamento",
    owner: "Terceirizado",
    status: "Concluida",
    priority: "Baixa",
    due: "2026-06-01",
  },
];

export const materials = [
  { name: "Argamassa ACIII", category: "Cimento e argamassa", unit: "saco", stock: 18, minimum: 12, averagePrice: 42.9 },
  { name: "Cabo flexivel 2,5mm", category: "Eletrica", unit: "metro", stock: 240, minimum: 120, averagePrice: 2.8 },
  { name: "Tinta acrilica premium", category: "Tintas", unit: "lata", stock: 7, minimum: 8, averagePrice: 318.0 },
  { name: "Registro esfera 3/4", category: "Hidraulica", unit: "un", stock: 21, minimum: 10, averagePrice: 34.5 },
];

export const alerts = [
  { label: "Compras aguardando aprovacao", value: 9, icon: HandCoins, tone: "amber" },
  { label: "Tarefas vencidas", value: 7, icon: AlertTriangle, tone: "red" },
  { label: "Descartes agendados no mes", value: 6, icon: Truck, tone: "blue" },
  { label: "Fotos anexadas esta semana", value: 84, icon: Camera, tone: "green" },
];

export const dashboardStats = [
  { label: "Obras em andamento", value: "12", detail: "3 com prioridade alta", icon: Home },
  { label: "Custo previsto x realizado", value: "76%", detail: "R$ 662,6 mil realizados", icon: HandCoins },
  { label: "Materiais pendentes", value: "18", detail: "9 aguardando aprovacao", icon: PackageCheck },
  { label: "Tarefas do dia", value: "31", detail: "7 vencidas", icon: Clock3 },
];

export const activity = [
  { icon: CheckCircle2, text: "Diario validado na obra Apartamento Marina", time: "08:42" },
  { icon: CalendarDays, text: "Descarte de gesso agendado para Restaurante Orla", time: "09:10" },
  { icon: PackageCheck, text: "Compra de revestimento enviada para aprovacao", time: "09:35" },
  { icon: Camera, text: "24 fotos adicionadas em Salas Vista Capital", time: "10:05" },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}
