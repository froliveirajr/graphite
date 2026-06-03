import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/data/graphite";
import { getProjects } from "@/lib/repositories/graphite";

type ProjectsSearchParams = {
  q?: string | string[];
  status?: string | string[];
  manager?: string | string[];
  type?: string | string[];
};

const statusOptions = [
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
];

const typeOptions = [
  "Reforma residencial",
  "Reforma de apartamento",
  "Reforma comercial",
  "Restaurante",
  "Construcao interna",
  "Adequacao de imovel",
  "Manutencao",
  "Obra personalizada",
];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<ProjectsSearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    query: firstValue(params.q)?.trim() ?? "",
    status: firstValue(params.status) ?? "",
    manager: firstValue(params.manager) ?? "",
    type: firstValue(params.type) ?? "",
  };
  const projects = await getProjects(filters);
  const managerOptions = Array.from(
    new Set(projects.map((project) => project.manager).filter((manager) => manager !== "-")),
  ).sort();

  return (
    <AppShell>
      <PageHeader
        title="Obras e reformas"
        description="Controle de obras com cliente, endereco, gestor, status, custos, progresso e prioridades."
        action={<Link href="/projects/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Nova obra</Link>}
      />
      <div className="space-y-4 p-5 sm:p-8">
        <form className="grid gap-3 md:grid-cols-[1fr_180px_180px_180px_108px]" action="/projects">
          <input
            name="q"
            defaultValue={filters.query}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
            placeholder="Buscar obra, cliente ou codigo"
          />
          <select
            name="status"
            defaultValue={filters.status}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
          >
            <option value="">Status</option>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <select
            name="manager"
            defaultValue={filters.manager}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
          >
            <option value="">Gestor</option>
            {managerOptions.map((manager) => (
              <option key={manager}>{manager}</option>
            ))}
          </select>
          <select
            name="type"
            defaultValue={filters.type}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
          >
            <option value="">Tipo</option>
            {typeOptions.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
            Filtrar
          </button>
        </form>
        <div className="grid gap-4 xl:grid-cols-3">
          {projects.length > 0 ? projects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{project.code}</p>
                  <h2 className="mt-2 text-lg font-semibold text-zinc-950">{project.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{project.client}</p>
                </div>
                <StatusBadge value={project.status} />
              </div>
              <div className="mt-5 space-y-3 text-sm text-zinc-700">
                <div className="flex justify-between"><span>Gestor</span><strong>{project.manager}</strong></div>
                <div className="flex justify-between"><span>Tipo</span><strong>{project.type}</strong></div>
                <div className="flex justify-between"><span>Previsto</span><strong>{formatCurrency(project.budget)}</strong></div>
                <div className="flex justify-between"><span>Realizado</span><strong>{formatCurrency(project.actualCost)}</strong></div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs font-medium text-zinc-500">
                  <span>Progresso fisico</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-100">
                  <div className="h-2 rounded-full bg-[#f9a52c]" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Aprovacoes</p>
                  <p className="mt-1 text-lg font-semibold">{project.pendingApprovals}</p>
                </div>
                <div className="rounded-md bg-zinc-50 p-3">
                  <p className="text-xs text-zinc-500">Tarefas vencidas</p>
                  <p className="mt-1 text-lg font-semibold">{project.overdueTasks}</p>
                </div>
              </div>
            </Link>
          )) : (
            <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-500 shadow-sm xl:col-span-3">
              Nenhuma obra encontrada com os filtros atuais.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
