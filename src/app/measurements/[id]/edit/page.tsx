import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { updateMeasurementAction } from "@/lib/actions/measurements";
import { getBudgetItemOptions, getEmployeeOptions, getMeasurementDetails, getProjectTaskOptions } from "@/lib/repositories/graphite";

const statuses = ["Rascunho", "Enviada", "Aprovada", "Rejeitada", "Faturada"];

export default async function EditMeasurementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }, projects, budgetItems, employees] = await Promise.all([
    params,
    searchParams,
    getProjectTaskOptions(),
    getBudgetItemOptions(),
    getEmployeeOptions(),
  ]);
  const measurement = await getMeasurementDetails(id);

  if (!measurement) {
    notFound();
  }

  const employeeRows = [
    ...measurement.employeeLines,
    ...Array.from({ length: Math.max(3, 8 - measurement.employeeLines.length) }, (_, index) => ({
      id: `blank-${index}`,
      employeeId: "",
      role: "",
      hoursWorked: 0,
      notes: "",
    })),
  ];

  return (
    <AppShell>
      <PageHeader title="Editar medicao" description="Atualize quantidade executada, valor medido e status." />
      <div className="p-5 sm:p-8">
        <form action={updateMeasurementAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={measurement.id} />
          {error ? <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">Obra
              <select name="projectId" required defaultValue={measurement.projectId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.code} - {project.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">Item do orcamento
              <select name="budgetItemId" required defaultValue={measurement.budgetItemId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {budgetItems.map((item) => {
                  const displayedRemaining =
                    item.id === measurement.budgetItemId
                      ? item.remainingQuantity + measurement.quantityMeasured
                      : item.remainingQuantity;

                  return (
                    <option key={item.id} value={item.id}>
                      {item.label} - saldo {displayedRemaining} {item.unit}
                    </option>
                  );
                })}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">Data da medicao
              <input name="measuredAt" type="date" required defaultValue={measurement.measuredAt} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Status
              <select name="status" defaultValue={measurement.status} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">Periodo inicio
              <input name="periodStartDate" type="date" defaultValue={measurement.periodStartDate === "-" ? "" : measurement.periodStartDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Periodo fim
              <input name="periodEndDate" type="date" defaultValue={measurement.periodEndDate === "-" ? "" : measurement.periodEndDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Quantidade medida
              <input name="quantityMeasured" type="number" min="0" step="0.001" required defaultValue={measurement.quantityMeasured} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Valor medido
              <input name="amountMeasured" type="number" min="0" step="0.01" required defaultValue={measurement.amountMeasured} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Avanco fisico %
              <input name="physicalProgress" type="number" min="0" max="100" step="0.01" defaultValue={measurement.physicalProgress} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">Observacoes
              <textarea name="notes" rows={3} defaultValue={measurement.notes} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-950">Funcionarios executantes</h2>
            <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[920px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-3 py-3">Funcionario</th>
                    <th className="px-3 py-3">Atividade</th>
                    <th className="px-3 py-3">Horas</th>
                    <th className="px-3 py-3">Observacao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {employeeRows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-3 py-3">
                        <select name="employeeId" defaultValue={row.employeeId} className="h-10 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm">
                          <option value="">Selecione</option>
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.name} - {employee.jobTitle}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <input name="employeeRole" defaultValue={row.role} className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="employeeHours" type="number" min="0" step="0.25" defaultValue={row.hoursWorked || ""} className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="employeeNotes" defaultValue={row.notes} className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/measurements" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">Cancelar</Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Salvar alteracoes</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
