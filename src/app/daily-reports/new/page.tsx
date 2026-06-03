import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createDailyReportAction } from "@/lib/actions/daily-reports";
import { getProjectTaskOptions } from "@/lib/repositories/graphite";

export default async function NewDailyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, projects] = await Promise.all([searchParams, getProjectTaskOptions()]);

  return (
    <AppShell>
      <PageHeader
        title="Novo diario de obra"
        description="Registre a rotina da obra no dia: equipe, servicos, materiais, clima, ocorrencias e pendencias."
      />
      <div className="p-5 sm:p-8">
        <form action={createDailyReportAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
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
              Data do diario
              <input name="reportDate" type="date" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Equipe no dia
              <textarea name="teamNotes" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Servicos executados
              <textarea name="servicesExecuted" rows={4} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Materiais recebidos
              <textarea name="materialsReceived" rows={4} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Materiais utilizados
              <textarea name="materialsUsed" rows={4} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Clima e condicoes
              <textarea name="weatherNotes" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Ocorrencias
              <textarea name="occurrences" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Problemas / impedimentos
              <textarea name="issues" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Pendencias
              <textarea name="pendingItems" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/daily-reports" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              Salvar diario
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
