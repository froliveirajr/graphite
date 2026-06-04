import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  approvePurchaseAction,
  deletePurchaseAction,
  receivePurchaseAction,
  rejectPurchaseAction,
} from "@/lib/actions/purchases";
import { formatCurrency } from "@/lib/data/graphite";
import { getPurchases } from "@/lib/repositories/graphite";

function message(params: {
  created?: string;
  updated?: string;
  deleted?: string;
  approved?: string;
  rejected?: string;
  received?: string;
  error?: string;
}) {
  if (params.error) {
    return { tone: "error", text: params.error };
  }
  if (params.created) return { tone: "success", text: "Pedido de material cadastrado." };
  if (params.updated) return { tone: "success", text: "Pedido de material atualizado." };
  if (params.deleted) return { tone: "success", text: "Pedido excluido." };
  if (params.approved) return { tone: "success", text: "Pedido aprovado." };
  if (params.rejected) return { tone: "success", text: "Pedido reprovado." };
  if (params.received) return { tone: "success", text: "Pedido recebido e estoque atualizado." };
  return null;
}

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    approved?: string;
    rejected?: string;
    received?: string;
    error?: string;
  }>;
}) {
  const [purchases, params] = await Promise.all([getPurchases(), searchParams]);
  const feedback = message(params);
  const pendingOverruns = purchases.filter((purchase) => purchase.overrunApprovalPending);

  return (
    <AppShell>
      <PageHeader
        title="Compras"
        description="Solicitacao, cotacao, aprovacao, compra, recebimento e vinculo financeiro por obra."
        action={
          <Link href="/purchases/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
            Novo pedido
          </Link>
        }
      />
      <div className="p-5 sm:p-8">
        {feedback ? (
          <div
            className={`mb-5 rounded-md border px-4 py-3 text-sm font-medium ${
              feedback.tone === "error"
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}
        {pendingOverruns.length > 0 ? (
          <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-amber-950">Pedidos acima do quantitativo aguardando autorizacao</h2>
                <p className="mt-1 text-sm text-amber-800">
                  Revise a justificativa e aprove ou reprove antes da compra/recebimento.
                </p>
              </div>
              <strong className="text-sm text-amber-900">{pendingOverruns.length} pendente(s)</strong>
            </div>
            <div className="mt-3 grid gap-2">
              {pendingOverruns.map((purchase) => (
                <div key={purchase.id} className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>{purchase.project}</strong>
                    <span>{purchase.requester}</span>
                  </div>
                  <p className="mt-1 text-amber-900">{purchase.approvalJustification || purchase.justification}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[1240px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Solicitante</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Excecao</th>
                <th className="px-4 py-3">Urgencia</th>
                <th className="px-4 py-3">Necessario em</th>
                <th className="px-4 py-3">Itens</th>
                <th className="px-4 py-3">Estimado</th>
                <th className="px-4 py-3">Aprovado</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {purchases.length > 0 ? purchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-semibold">{purchase.project}</td>
                  <td className="px-4 py-4 text-zinc-700">{purchase.requester}</td>
                  <td className="px-4 py-4"><StatusBadge value={purchase.status} /></td>
                  <td className="px-4 py-4">
                    {purchase.overrunApprovalPending ? (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Aprovar excesso</span>
                    ) : purchase.approvalStatus === "APPROVED" ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">Excesso autorizado</span>
                    ) : (
                      <span className="text-xs text-zinc-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-zinc-700">{purchase.urgency}</td>
                  <td className="px-4 py-4 text-zinc-700">{purchase.neededBy}</td>
                  <td className="px-4 py-4 font-medium">{purchase.items}</td>
                  <td className="px-4 py-4">{formatCurrency(purchase.estimatedTotal)}</td>
                  <td className="px-4 py-4">{formatCurrency(purchase.approvedTotal)}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/purchases/${purchase.id}/edit`} className="inline-flex h-9 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700">
                        Editar
                      </Link>
                      <form action={approvePurchaseAction}>
                        <input type="hidden" name="id" value={purchase.id} />
                        <button className="h-9 rounded-md border border-emerald-200 px-3 text-xs font-semibold text-emerald-700">
                          Aprovar
                        </button>
                      </form>
                      <form action={receivePurchaseAction}>
                        <input type="hidden" name="id" value={purchase.id} />
                        <button className="h-9 rounded-md border border-blue-200 px-3 text-xs font-semibold text-blue-700">
                          Receber
                        </button>
                      </form>
                      <form action={rejectPurchaseAction}>
                        <input type="hidden" name="id" value={purchase.id} />
                        <button className="h-9 rounded-md border border-amber-200 px-3 text-xs font-semibold text-amber-700">
                          Reprovar
                        </button>
                      </form>
                      <form action={deletePurchaseAction}>
                        <input type="hidden" name="id" value={purchase.id} />
                        <button className="h-9 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700">
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-zinc-500">
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
