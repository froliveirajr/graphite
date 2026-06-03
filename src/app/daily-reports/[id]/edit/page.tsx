import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { updateDailyReportAction } from "@/lib/actions/daily-reports";
import { getDailyReportDetails, getEmployeeOptions, getProjectTaskOptions } from "@/lib/repositories/graphite";

const attendanceStatuses = ["Presente", "Parcial", "Ausente", "Deslocado"];

export default async function EditDailyReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }, projects, employees] = await Promise.all([
    params,
    searchParams,
    getProjectTaskOptions(),
    getEmployeeOptions(),
  ]);
  const report = await getDailyReportDetails(id);

  if (!report) {
    notFound();
  }

  const attendanceRows = [
    ...report.attendances,
    ...Array.from({ length: Math.max(3, 8 - report.attendances.length) }, () => ({
      id: "",
      employeeId: "",
      employee: "",
      status: "Presente",
      hoursWorked: 0,
      transferredToProjectId: "",
      transferredToProject: "",
      notes: "",
    })),
  ];

  return (
    <AppShell>
      <PageHeader
        title="Editar diario de obra"
        description="Atualize o registro diario da obra."
      />
      <div className="p-5 sm:p-8">
        <form action={updateDailyReportAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={report.id} />
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Obra
              <select name="projectId" required defaultValue={report.projectId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
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
              <input name="reportDate" type="date" required defaultValue={report.reportDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Equipe no dia
              <textarea name="teamNotes" rows={3} defaultValue={report.teamNotes} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
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
                    {attendanceRows.map((attendance, index) => (
                      <tr key={`${attendance.id}-${index}`}>
                        <td className="px-3 py-2">
                          <select name="attendanceEmployeeId" defaultValue={attendance.employeeId} className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                            <option value="">Selecione</option>
                            {employees.map((employee) => (
                              <option key={employee.id} value={employee.id}>
                                {employee.name} - {employee.jobTitle}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <select name="attendanceStatus" defaultValue={attendance.status} className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                            {attendanceStatuses.map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input name="attendanceHours" type="number" min="0" step="0.25" defaultValue={attendance.hoursWorked || ""} className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm" />
                        </td>
                        <td className="px-3 py-2">
                          <select name="attendanceTransferredToProjectId" defaultValue={attendance.transferredToProjectId} className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                            <option value="">Nao se aplica</option>
                            {projects.map((project) => (
                              <option key={project.id} value={project.id}>
                                {project.code} - {project.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input name="attendanceNotes" defaultValue={attendance.notes} className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Servicos executados
              <textarea name="servicesExecuted" rows={4} defaultValue={report.servicesExecuted} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Materiais recebidos
              <textarea name="materialsReceived" rows={4} defaultValue={report.materialsReceived} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Materiais utilizados
              <textarea name="materialsUsed" rows={4} defaultValue={report.materialsUsed} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Clima e condicoes
              <textarea name="weatherNotes" rows={3} defaultValue={report.weatherNotes} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Ocorrencias
              <textarea name="occurrences" rows={3} defaultValue={report.occurrences} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Problemas / impedimentos
              <textarea name="issues" rows={3} defaultValue={report.issues} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Pendencias
              <textarea name="pendingItems" rows={3} defaultValue={report.pendingItems} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/daily-reports" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
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
