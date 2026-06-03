import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { updateEmployeeAllocationAction } from "@/lib/actions/employee-allocations";
import { getEmployeeAllocationDetails, getEmployeeOptions, getProjectTaskOptions } from "@/lib/repositories/graphite";

const statuses = ["Planejada", "Ativa", "Pausada", "Finalizada", "Cancelada"];

export default async function EditEmployeeAllocationPage({
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
  const allocation = await getEmployeeAllocationDetails(id);

  if (!allocation) {
    notFound();
  }

  return (
    <AppShell>
      <PageHeader
        title="Editar locacao de funcionario"
        description="Atualize obra, funcionario, funcao, periodo, status e custo da locacao."
      />
      <div className="p-5 sm:p-8">
        <form action={updateEmployeeAllocationAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={allocation.id} />
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Obra
              <select name="projectId" required defaultValue={allocation.projectId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Funcionario
              <select name="employeeId" required defaultValue={allocation.employeeId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} - {employee.jobTitle}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Funcao na obra
              <input name="role" required defaultValue={allocation.role} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Status
              <select name="status" defaultValue={allocation.status} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Inicio
              <input name="startDate" type="date" required defaultValue={allocation.startDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Fim previsto
              <input name="endDate" type="date" defaultValue={allocation.endDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Custo diario
              <input name="dailyRate" type="number" min="0" step="0.01" defaultValue={allocation.dailyRate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Servico previsto
              <textarea name="serviceDescription" rows={3} defaultValue={allocation.serviceDescription} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={3} defaultValue={allocation.notes} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/employee-allocations" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
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
