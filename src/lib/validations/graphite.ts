import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Informe o nome do cliente."),
  documentType: z.enum(["CPF", "CNPJ"]).optional(),
  documentNumber: z.string().min(11, "Informe CPF ou CNPJ."),
  phone: z.string().min(8, "Informe um telefone valido."),
  whatsapp: z.string().optional(),
  email: z.email("Informe um e-mail valido.").optional().or(z.literal("")),
  address: z.string().optional(),
  clientType: z.enum(["Pessoa fisica", "Empresa", "Restaurante", "Investidor", "Arquiteto parceiro"]),
  notes: z.string().optional(),
});

export const projectSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(3, "Informe o nome da obra."),
  clientId: z.string().min(1, "Selecione um cliente."),
  projectType: z.enum([
    "Reforma residencial",
    "Reforma de apartamento",
    "Reforma comercial",
    "Restaurante",
    "Construcao interna",
    "Adequacao de imovel",
    "Manutencao",
    "Obra personalizada",
  ]),
  address: z.string().min(5, "Informe o endereco da obra."),
  plannedBudget: z.coerce.number().nonnegative(),
  plannedStartDate: z.string().min(1),
  plannedEndDate: z.string().min(1),
  status: z.enum([
    "Orcamento",
    "Planejamento",
    "Em andamento",
    "Pausada",
    "Aguardando cliente",
    "Aguardando material",
    "Aguardando terceirizado",
    "Em vistoria",
    "Concluida",
    "Cancelada",
  ]),
  priority: z.enum(["Alta", "Media", "Baixa"]).default("Media"),
  notes: z.string().optional(),
});

export const taskSchema = z.object({
  projectId: z.string().min(1),
  areaId: z.string().optional(),
  title: z.string().min(3),
  description: z.string().optional(),
  serviceType: z.string().min(2),
  plannedStartDate: z.string().optional(),
  plannedEndDate: z.string().optional(),
  status: z.enum([
    "A fazer",
    "Em andamento",
    "Pausada",
    "Bloqueada",
    "Aguardando material",
    "Aguardando aprovacao",
    "Concluida",
    "Reprovada",
    "Cancelada",
  ]),
  priority: z.enum(["Alta", "Media", "Baixa"]),
});

export const materialSchema = z.object({
  name: z.string().min(2, "Informe o nome do material."),
  category: z.string().min(2, "Informe a categoria."),
  unit: z.string().min(1, "Informe a unidade."),
  brand: z.string().optional(),
  internalCode: z.string().optional(),
  averagePrice: z.coerce.number().nonnegative("Informe um preco valido.").optional(),
  minimumStock: z.coerce.number().nonnegative("Informe um estoque minimo valido.").optional(),
  notes: z.string().optional(),
});

export const dailyReportSchema = z.object({
  projectId: z.string().min(1, "Selecione uma obra."),
  reportDate: z.string().min(1, "Informe a data do diario."),
  teamNotes: z.string().optional(),
  servicesExecuted: z.string().optional(),
  materialsReceived: z.string().optional(),
  materialsUsed: z.string().optional(),
  occurrences: z.string().optional(),
  issues: z.string().optional(),
  pendingItems: z.string().optional(),
  weatherNotes: z.string().optional(),
});

export const employeeAllocationSchema = z.object({
  projectId: z.string().min(1, "Selecione uma obra."),
  employeeId: z.string().min(1, "Selecione um funcionario."),
  role: z.string().min(2, "Informe a funcao na obra."),
  serviceDescription: z.string().optional(),
  startDate: z.string().min(1, "Informe a data de inicio."),
  endDate: z.string().optional(),
  dailyRate: z.coerce.number().nonnegative("Informe um custo diario valido.").optional(),
  status: z.enum(["Planejada", "Ativa", "Pausada", "Finalizada", "Cancelada"]),
  notes: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type MaterialInput = z.infer<typeof materialSchema>;
export type DailyReportInput = z.infer<typeof dailyReportSchema>;
export type EmployeeAllocationInput = z.infer<typeof employeeAllocationSchema>;
