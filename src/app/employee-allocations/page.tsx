import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { deleteEmployeeAllocationAction } from "@/lib/actions/employee-allocations";
import { formatCurrency } from "@/lib/data/graphite";
import { getEmployeeAllocations } from "@/lib/repositories/graphite";

export default async function EmployeeAllocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const [{ created, updated, deleted, error }, allocations] = await Promise.all([
    searchParams,
    getEmployeeAllocations(),
  ]);
  const successMessage = created
    ? "Locacao cadastrada com sucesso."
    : updated
      ? "Locacao atualizada com sucesso."
      : deleted
        ? "Locacao excluida com sucesso."
        : "";

  return (
    <AppShell>
      <PageHeader
        title="Locacoes de funcionarios"
        description="Alocacao de mao de obra por obra, funcao, periodo, status e custo diario."
        action={<Link href="/employee-allocations/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Nova locacao</Link>}
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
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[1040px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Funcionario</th>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Funcao</th>
                <th className="px-4 py-3">Servico</th>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Custo diario</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {allocations.length > 0 ? allocations.map((allocation) => (
                <tr key={allocation.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold">{allocation.employee}</p>
                    <p className="text-xs text-zinc-500">{allocation.jobTitle}</p>
                  </td>
                  <td className="px-4 py-4 font-medium">{allocation.project}</td>
                  <td className="px-4 py-4 text-zinc-700">{allocation.role}</td>
                  <td className="max-w-[220px] truncate px-4 py-4 text-zinc-700">{allocation.serviceDescription}</td>
                  <td className="px-4 py-4 text-zinc-700">{allocation.startDate} ate {allocation.endDate}</td>
                  <td className="px-4 py-4">{formatCurrency(allocation.dailyRate)}</td>
                  <td className="px-4 py-4"><StatusBadge value={allocation.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/employee-allocations/${allocation.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">
                        Editar
                      </Link>
                      <form action={deleteEmployeeAllocationAction}>
                        <input type="hidden" name="id" value={allocation.id} />
                        <button className="h-8 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhuma locacao de funcionario cadastrada.
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
