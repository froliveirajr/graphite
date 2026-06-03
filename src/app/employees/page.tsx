import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/data/graphite";
import { getEmployees } from "@/lib/repositories/graphite";

export default async function EmployeesPage() {
  const employees = await getEmployees();

  return (
    <AppShell>
      <PageHeader
        title="Funcionarios"
        description="Cadastro de equipe interna, especialidade, vinculo, contato e custo de mao de obra."
        action={<button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo funcionario</button>}
      />
      <div className="p-5 sm:p-8">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Funcionario</th>
                <th className="px-4 py-3">Cargo</th>
                <th className="px-4 py-3">Especialidade</th>
                <th className="px-4 py-3">Vinculo</th>
                <th className="px-4 py-3">Contato</th>
                <th className="px-4 py-3">Custo diario</th>
                <th className="px-4 py-3">Salario</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {employees.length > 0 ? employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-semibold">{employee.name}</td>
                  <td className="px-4 py-4 text-zinc-700">{employee.jobTitle}</td>
                  <td className="px-4 py-4 text-zinc-700">{employee.specialty}</td>
                  <td className="px-4 py-4 text-zinc-700">{employee.employmentType}</td>
                  <td className="px-4 py-4 text-zinc-700">{employee.phone}</td>
                  <td className="px-4 py-4">{formatCurrency(employee.dailyRate)}</td>
                  <td className="px-4 py-4">{formatCurrency(employee.salary)}</td>
                  <td className="px-4 py-4"><StatusBadge value={employee.status} /></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhum funcionario cadastrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
