import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createEmployeeAllocationAction } from "@/lib/actions/employee-allocations";
import { getEmployeeOptions, getProjectTaskOptions } from "@/lib/repositories/graphite";

const statuses = ["Planejada", "Ativa", "Pausada", "Finalizada", "Cancelada"];

export default async function NewEmployeeAllocationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, projects, employees] = await Promise.all([
    searchParams,
    getProjectTaskOptions(),
    getEmployeeOptions(),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Nova locacao de funcionario"
        description="Vincule um funcionario a uma obra com periodo, funcao, servico e custo diario."
      />
      <div className="p-5 sm:p-8">
        <form action={createEmployeeAllocationAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
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
              Funcionario
              <select name="employeeId" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
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
              <input name="role" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" placeholder="Pedreiro, ajudante, eletricista..." />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Status
              <select name="status" defaultValue="Ativa" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Inicio
              <input name="startDate" type="date" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Fim previsto
              <input name="endDate" type="date" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Custo diario
              <input name="dailyRate" type="number" min="0" step="0.01" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Servico previsto
              <textarea name="serviceDescription" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/employee-allocations" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              Salvar locacao
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
