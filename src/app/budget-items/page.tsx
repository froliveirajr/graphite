import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { BudgetGantt } from "@/components/ui/budget-gantt";
import { StatusBadge } from "@/components/ui/status-badge";
import { deleteBudgetItemAction } from "@/lib/actions/budget-items";
import { formatCurrency } from "@/lib/data/graphite";
import { getBudgetItems } from "@/lib/repositories/graphite";

export default async function BudgetItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const [{ created, updated, deleted, error }, items] = await Promise.all([searchParams, getBudgetItems()]);
  const successMessage = created ? "Item cadastrado com sucesso." : updated ? "Item atualizado com sucesso." : deleted ? "Item excluido com sucesso." : "";
  const budgetTotal = items.reduce((total, item) => total + item.totalPrice, 0);
  const weightedProgress =
    items.length > 0
      ? Math.round(
          items.reduce((total, item) => total + item.physicalProgress * (item.physicalWeight || 1), 0) /
            items.reduce((total, item) => total + (item.physicalWeight || 1), 0),
        )
      : 0;
  const plannedItems = items.filter((item) => item.plannedStartDate !== "-" && item.plannedEndDate !== "-").length;

  return (
    <AppShell>
      <PageHeader
        title="Orcamento detalhado"
        description="Itens por obra, etapa, quantidade, valor, cronograma fisico e progresso."
        action={<Link href="/budget-items/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo item</Link>}
      />
      <div className="p-5 sm:p-8">
        {successMessage ? <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</div> : null}
        {error ? <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
        <section className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Total orcado</p>
            <strong className="mt-2 block text-xl">{formatCurrency(budgetTotal)}</strong>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Avanco fisico ponderado</p>
            <strong className="mt-2 block text-xl">{weightedProgress}%</strong>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-zinc-500">Itens no cronograma</p>
            <strong className="mt-2 block text-xl">{plannedItems}/{items.length}</strong>
          </div>
        </section>
        <section className="mb-6 rounded-lg border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-200 p-4">
            <h2 className="font-semibold">Grafico de Gantt</h2>
          </div>
          <BudgetGantt items={items} showProject />
        </section>
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[1180px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Etapa</th>
                <th className="px-4 py-3">Descricao</th>
                <th className="px-4 py-3">Qtd.</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Fisico</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {items.length > 0 ? items.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-semibold">{item.project}</td>
                  <td className="px-4 py-4">{item.phase}</td>
                  <td className="max-w-[280px] truncate px-4 py-4 text-zinc-700">{item.description}</td>
                  <td className="px-4 py-4">{item.quantity} {item.unit}</td>
                  <td className="px-4 py-4 font-semibold">{formatCurrency(item.totalPrice)}</td>
                  <td className="px-4 py-4 text-zinc-700">{item.plannedStartDate} ate {item.plannedEndDate}</td>
                  <td className="px-4 py-4">{item.physicalProgress}%</td>
                  <td className="px-4 py-4"><StatusBadge value={item.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/budget-items/${item.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">Editar</Link>
                      <form action={deleteBudgetItemAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="h-8 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">Excluir</button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-zinc-500">Nenhum item de orcamento cadastrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
