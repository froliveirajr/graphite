import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/data/graphite";
import { getPurchases } from "@/lib/repositories/graphite";

export default async function PurchasesPage() {
  const purchases = await getPurchases();

  return (
    <AppShell>
      <PageHeader
        title="Compras"
        description="Solicitacao, cotacao, aprovacao, compra, recebimento e vinculo financeiro por obra."
        action={<button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Nova compra</button>}
      />
      <div className="p-5 sm:p-8">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Solicitante</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Urgencia</th>
                <th className="px-4 py-3">Necessario em</th>
                <th className="px-4 py-3">Itens</th>
                <th className="px-4 py-3">Estimado</th>
                <th className="px-4 py-3">Aprovado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {purchases.length > 0 ? purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-semibold">{purchase.project}</td>
                  <td className="px-4 py-4 text-zinc-700">{purchase.requester}</td>
                  <td className="px-4 py-4"><StatusBadge value={purchase.status} /></td>
                  <td className="px-4 py-4 text-zinc-700">{purchase.urgency}</td>
                  <td className="px-4 py-4 text-zinc-700">{purchase.neededBy}</td>
                  <td className="px-4 py-4 font-medium">{purchase.items}</td>
                  <td className="px-4 py-4">{formatCurrency(purchase.estimatedTotal)}</td>
                  <td className="px-4 py-4">{formatCurrency(purchase.approvedTotal)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhuma solicitacao de compra cadastrada.
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
