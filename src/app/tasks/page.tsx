import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { tasks } from "@/lib/data/graphite";

const columns = ["A fazer", "Em andamento", "Aguardando material", "Concluida"];

export default function TasksPage() {
  return (
    <AppShell>
      <PageHeader
        title="Tarefas e cronograma"
        description="Lista, Kanban e calendario para atividades por obra, ambiente, responsavel e prazo."
        action={<button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Nova tarefa</button>}
      />
      <div className="p-5 sm:p-8">
        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((column) => (
            <div key={column} className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold">{column}</h2>
                <span className="text-xs text-zinc-500">{tasks.filter((task) => task.status === column).length}</span>
              </div>
              <div className="space-y-3">
                {tasks
                  .filter((task) => task.status === column)
                  .map((task) => (
                    <div key={task.id} className="rounded-md border border-zinc-200 p-4">
                      <StatusBadge value={task.priority} />
                      <h3 className="mt-3 text-sm font-semibold leading-5">{task.title}</h3>
                      <p className="mt-2 text-xs text-zinc-500">{task.project}</p>
                      <div className="mt-4 flex justify-between text-xs text-zinc-600">
                        <span>{task.owner}</span>
                        <span>{task.due}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
