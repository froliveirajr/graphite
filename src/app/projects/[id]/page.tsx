import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/data/graphite";
import { getProjectDetails } from "@/lib/repositories/graphite";

const tabs = ["Visao geral", "Ambientes", "Tarefas", "Materiais", "Equipe", "Terceirizados", "Financeiro", "Fotos", "Documentos", "Diario"];

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProjectDetails(id);

  if (!project) {
    notFound();
  }

  return (
    <AppShell>
      <PageHeader
        title={project.name}
        description={`${project.code} · ${project.type} · ${project.address}`}
        action={<StatusBadge value={project.status} />}
      />
      <div className="space-y-6 p-5 sm:p-8">
        <div className="overflow-x-auto border-b border-zinc-200">
          <div className="flex min-w-max gap-2">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`h-10 rounded-t-md px-3 text-sm font-medium ${index === 0 ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-4 lg:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Cliente</p>
            <p className="mt-2 font-semibold">{project.client}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Gestor</p>
            <p className="mt-2 font-semibold">{project.manager}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Tecnico responsavel</p>
            <p className="mt-2 font-semibold">{project.technicalResponsible}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Prazo previsto</p>
            <p className="mt-2 font-semibold">{project.plannedStart} ate {project.plannedEnd}</p>
          </div>
        </section>

        <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Ambientes da obra</h2>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-2">
              {project.areas.map((area) => (
                <div key={area.name} className="rounded-md border border-zinc-200 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{area.name}</h3>
                      <p className="mt-1 text-xs text-zinc-500">{area.owner} · {area.tasks} tarefas</p>
                    </div>
                    <StatusBadge value={area.status} />
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-zinc-100">
                    <div className="h-2 rounded-full bg-[#f9a52c]" style={{ width: `${area.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <h2 className="font-semibold">Resumo financeiro</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between"><span>Orcamento previsto</span><strong>{formatCurrency(project.budget)}</strong></div>
              <div className="flex justify-between"><span>Custo realizado</span><strong>{formatCurrency(project.actualCost)}</strong></div>
              <div className="flex justify-between"><span>Saldo previsto</span><strong>{formatCurrency(project.budget - project.actualCost)}</strong></div>
              <div className="flex justify-between"><span>Uso do orcamento</span><strong>{Math.round((project.actualCost / project.budget) * 100)}%</strong></div>
            </div>
            <div className="mt-5 h-2 rounded-full bg-zinc-100">
              <div className="h-2 rounded-full bg-zinc-950" style={{ width: `${Math.round((project.actualCost / project.budget) * 100)}%` }} />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 p-4">
            <h2 className="font-semibold">Tarefas vinculadas</h2>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
            {project.tasks.map((task) => (
              <div key={task.id} className="rounded-md border border-zinc-200 p-4">
                <StatusBadge value={task.status} />
                <h3 className="mt-3 text-sm font-semibold">{task.title}</h3>
                <p className="mt-2 text-xs text-zinc-500">{task.area} · {task.serviceType}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
                  <span>{task.owner}</span>
                  <span>{task.due}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
