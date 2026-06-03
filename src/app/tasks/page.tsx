import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { deleteTaskAction } from "@/lib/actions/tasks";
import { getTasks } from "@/lib/repositories/graphite";

const columns = ["A fazer", "Em andamento", "Aguardando material", "Concluida"];

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const [{ created, updated, deleted, error }, tasks] = await Promise.all([searchParams, getTasks()]);
  const successMessage = created
    ? "Tarefa cadastrada com sucesso."
    : updated
      ? "Tarefa atualizada com sucesso."
      : deleted
        ? "Tarefa excluida com sucesso."
        : "";

  return (
    <AppShell>
      <PageHeader
        title="Tarefas e cronograma"
        description="Lista, Kanban e calendario para atividades por obra, ambiente, responsavel e prazo."
        action={<Link href="/tasks/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Nova tarefa</Link>}
      />
      <div className="p-5 sm:p-8">
        {successMessage ? (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {successMessage}
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {error}
          </div>
        ) : null}
        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((column) => (
            <div key={column} className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
              <div className="mb-3 flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold">{column}</h2>
                <span className="text-xs text-zinc-500">{tasks.filter((task) => task.status === column).length}</span>
              </div>
              <div className="space-y-3">
                {tasks.filter((task) => task.status === column).length > 0 ? (
                  tasks
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
                      <div className="mt-4 flex items-center gap-2 border-t border-zinc-100 pt-3">
                        <Link href={`/tasks/${task.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">
                          Editar
                        </Link>
                        <form action={deleteTaskAction}>
                          <input type="hidden" name="id" value={task.id} />
                          <button className="h-8 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">
                            Excluir
                          </button>
                        </form>
                      </div>
                    </div>
                    ))
                ) : (
                  <div className="rounded-md border border-dashed border-zinc-200 p-4 text-sm text-zinc-500">
                    Nenhuma tarefa nesta etapa.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
