import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createDailyReportAction } from "@/lib/actions/daily-reports";
import { getEmployeeOptions, getProjectTaskOptions } from "@/lib/repositories/graphite";

const attendanceStatuses = ["Presente", "Parcial", "Ausente", "Deslocado"];

export default async function NewDailyReportPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, projects, employees] = await Promise.all([
    searchParams,
    getProjectTaskOptions(),
    getEmployeeOptions(),
  ]);
  const attendanceRows = Array.from({ length: 8 });

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
            <div className="md:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-zinc-900">Presenca e deslocamento de mao de obra</h2>
                <span className="text-xs text-zinc-500">Preencha somente as linhas usadas</span>
              </div>
              <div className="overflow-x-auto rounded-md border border-zinc-200">
                <table className="w-full min-w-[920px] text-left text-sm">
                  <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-3 py-2">Funcionario</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Horas</th>
                      <th className="px-3 py-2">Deslocado para</th>
                      <th className="px-3 py-2">Observacao</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {attendanceRows.map((_, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2">
                          <select name="attendanceEmployeeId" className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                            <option value="">Selecione</option>
                            {employees.map((employee) => (
                              <option key={employee.id} value={employee.id}>
                                {employee.name} - {employee.jobTitle}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select name="attendanceStatus" defaultValue="Presente" className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                            {attendanceStatuses.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input name="attendanceHours" type="number" min="0" step="0.25" className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm" />
                        </td>
                        <td className="px-3 py-2">
                          <select name="attendanceTransferredToProjectId" className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                            <option value="">Nao se aplica</option>
                            {projects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.code} - {project.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input name="attendanceNotes" className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
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
