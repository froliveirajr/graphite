import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createTaskAction } from "@/lib/actions/tasks";
import { getProjectTaskOptions } from "@/lib/repositories/graphite";

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, projects] = await Promise.all([searchParams, getProjectTaskOptions()]);

  return (
    <AppShell>
      <PageHeader
        title="Nova tarefa"
        description="Cadastre uma atividade vinculada a obra, ambiente, prazo, prioridade e etapa do cronograma."
      />
      <div className="p-5 sm:p-8">
        <form action={createTaskAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Titulo da tarefa
              <input name="title" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Obra
              <select name="projectId" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
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
              <select name="areaId" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
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
              <input name="serviceType" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" placeholder="Eletrica, Piso, Pintura" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Status
              <select name="status" required defaultValue="A fazer" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
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
              <select name="priority" required defaultValue="Media" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option>Media</option>
                <option>Alta</option>
                <option>Baixa</option>
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Inicio previsto
              <input name="plannedStartDate" type="date" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Termino previsto
              <input name="plannedEndDate" type="date" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Descricao
              <textarea name="description" rows={4} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/tasks" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              Salvar tarefa
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
