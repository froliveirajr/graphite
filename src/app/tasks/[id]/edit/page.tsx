import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { updateTaskAction } from "@/lib/actions/tasks";
import { getProjectTaskOptions, getTaskDetails } from "@/lib/repositories/graphite";

export default async function EditTaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }, projects] = await Promise.all([params, searchParams, getProjectTaskOptions()]);
  const task = await getTaskDetails(id);

  if (!task) {
    notFound();
  }

  return (
    <AppShell>
      <PageHeader
        title="Editar tarefa"
        description="Atualize obra, ambiente, prazo, prioridade e etapa da atividade."
      />
      <div className="p-5 sm:p-8">
        <form action={updateTaskAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={task.id} />
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Titulo da tarefa
              <input name="title" required defaultValue={task.title} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Obra
              <select name="projectId" required defaultValue={task.projectId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Ambiente
              <select name="areaId" defaultValue={task.areaId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Sem ambiente definido</option>
                {projects.map((project) => (
                  <optgroup key={project.id} label={project.name}>
                    {project.areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Tipo de servico
              <input name="serviceType" required defaultValue={task.serviceType} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Status
              <select name="status" required defaultValue={task.status} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option>A fazer</option>
                <option>Em andamento</option>
                <option>Pausada</option>
                <option>Bloqueada</option>
                <option>Aguardando material</option>
                <option>Aguardando aprovacao</option>
                <option>Concluida</option>
                <option>Reprovada</option>
                <option>Cancelada</option>
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Prioridade
              <select name="priority" required defaultValue={task.priority} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option>Media</option>
                <option>Alta</option>
                <option>Baixa</option>
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Inicio previsto
              <input name="plannedStartDate" type="date" defaultValue={task.plannedStartDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Termino previsto
              <input name="plannedEndDate" type="date" defaultValue={task.plannedEndDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Descricao
              <textarea name="description" rows={4} defaultValue={task.description} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/tasks" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              Salvar alteracoes
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
