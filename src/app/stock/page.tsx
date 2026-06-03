import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { formatCurrency } from "@/lib/data/graphite";
import { getStockMovements } from "@/lib/repositories/graphite";

export default async function StockPage() {
  const movements = await getStockMovements();

  return (
    <AppShell>
      <PageHeader
        title="Estoque por obra"
        description="Entradas, saidas, consumo, perdas, sobras e transferencias entre obras."
        action={<button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Nova movimentacao</button>}
      />
      <div className="p-5 sm:p-8">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Movimento</th>
                <th className="px-4 py-3">Quantidade</th>
                <th className="px-4 py-3">Custo total</th>
                <th className="px-4 py-3">Responsavel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {movements.length > 0 ? movements.map((movement) => (
                <tr key={movement.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 text-zinc-700">{movement.createdAt}</td>
                  <td className="px-4 py-4 font-semibold">{movement.project}</td>
                  <td className="px-4 py-4 text-zinc-700">{movement.material}</td>
                  <td className="px-4 py-4 text-zinc-700">{movement.movementType}</td>
                  <td className="px-4 py-4 font-medium">{movement.quantity} {movement.unit}</td>
                  <td className="px-4 py-4">{formatCurrency(movement.totalCost)}</td>
                  <td className="px-4 py-4 text-zinc-700">{movement.createdBy}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhuma movimentacao de estoque registrada.
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
