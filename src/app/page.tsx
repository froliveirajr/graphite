import Link from "next/link";
import Image from "next/image";
import { AppShell } from "@/components/layout/app-shell";
import { MetricCard } from "@/components/ui/metric-card";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { activity, alerts, dashboardStats, formatCurrency, projects, tasks } from "@/lib/data/graphite";

export default function DashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard geral"
        description="Visao consolidada de obras, tarefas, materiais, custos, descartes e aprovacoes pendentes."
        action={
          <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white hover:bg-zinc-800">
            Nova obra
          </button>
        }
      />
      <div className="space-y-6 p-5 sm:p-8">
        <section className="flex flex-col gap-5 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-44 items-center justify-center rounded-md border border-zinc-100 bg-white p-3">
              <Image
                src="/graphite-logo.svg"
                alt="Graphite arquitetura e construcao"
                width={220}
                height={128}
                priority
                className="h-auto w-full"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#f9a52c]">Sistema operacional</p>
              <h2 className="mt-1 text-xl font-semibold text-zinc-950">Graphite Arquitetura e Construcao</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-600">
                Controle centralizado para escritorio, obras, equipes, materiais, descartes e financeiro.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((stat) => (
            <MetricCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 p-4">
              <h2 className="text-base font-semibold">Obras em foco</h2>
              <Link href="/projects" className="text-sm font-medium text-zinc-700 hover:text-zinc-950">
                Ver todas
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Obra</th>
                    <th className="px-4 py-3">Gestor</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Progresso</th>
                    <th className="px-4 py-3">Realizado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-zinc-50">
                      <td className="px-4 py-4">
                        <Link href={`/projects/${project.id}`} className="font-semibold text-zinc-950 hover:underline">
                          {project.name}
                        </Link>
                        <p className="mt-1 text-xs text-zinc-500">{project.code} · {project.client}</p>
                      </td>
                      <td className="px-4 py-4 text-zinc-700">{project.manager}</td>
                      <td className="px-4 py-4"><StatusBadge value={project.status} /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-2 w-28 rounded-full bg-zinc-100">
                            <div className="h-2 rounded-full bg-[#f9a52c]" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-xs font-medium">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-medium">{formatCurrency(project.actualCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold">Alertas criticos</h2>
              <div className="mt-4 grid gap-3">
                {alerts.map((alert) => (
                  <div key={alert.label} className="flex items-center gap-3 rounded-md border border-zinc-100 p-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-zinc-100 text-zinc-700">
                      <alert.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{alert.label}</p>
                      <p className="text-xs text-zinc-500">Revisar no fluxo operacional</p>
                    </div>
                    <span className="text-lg font-semibold">{alert.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold">Atividade recente</h2>
              <div className="mt-4 space-y-4">
                {activity.map((item) => (
                  <div key={item.text} className="flex gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 text-zinc-500" aria-hidden="true" />
                    <div>
                      <p className="text-sm text-zinc-800">{item.text}</p>
                      <p className="text-xs text-zinc-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 p-4">
            <h2 className="text-base font-semibold">Tarefas do dia</h2>
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-md border border-zinc-200 p-4">
                <StatusBadge value={task.priority} />
                <h3 className="mt-3 text-sm font-semibold leading-5">{task.title}</h3>
                <p className="mt-2 text-xs text-zinc-500">{task.project}</p>
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
