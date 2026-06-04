import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { deleteProjectMaterialAction } from "@/lib/actions/project-materials";
import { formatCurrency } from "@/lib/data/graphite";
import { getProjectMaterialRequirements } from "@/lib/repositories/graphite";

export default async function ProjectMaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const [{ created, updated, deleted, error }, requirements] = await Promise.all([
    searchParams,
    getProjectMaterialRequirements(),
  ]);
  const successMessage = created
    ? "Quantitativo cadastrado."
    : updated
      ? "Quantitativo atualizado."
      : deleted
        ? "Quantitativo excluido."
        : "";

  return (
    <AppShell>
      <PageHeader
        title="Quantitativos de materiais"
        description="Materiais previstos por obra, saldo solicitado e recebimento para orientar pedidos."
        action={<Link href="/project-materials/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo quantitativo</Link>}
      />
      <div className="p-5 sm:p-8">
        {successMessage ? <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</div> : null}
        {error ? <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Previsto</th>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Recebido</th>
                <th className="px-4 py-3">Saldo</th>
                <th className="px-4 py-3">Estimado</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {requirements.length > 0 ? requirements.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-semibold">{item.project}</td>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{item.material}</p>
                    <p className="mt-1 text-xs text-zinc-500">{item.category}</p>
                  </td>
                  <td className="px-4 py-4">{item.plannedQuantity} {item.unit}</td>
                  <td className="px-4 py-4">{item.requestedQuantity} {item.unit}</td>
                  <td className="px-4 py-4">{item.receivedQuantity} {item.unit}</td>
                  <td className="px-4 py-4 font-semibold">{item.remainingQuantity} {item.unit}</td>
                  <td className="px-4 py-4">{formatCurrency(item.estimatedTotal)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/project-materials/${item.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">Editar</Link>
                      <form action={deleteProjectMaterialAction}>
                        <input type="hidden" name="id" value={item.id} />
                        <button className="h-8 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">Excluir</button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhum quantitativo de material cadastrado.
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
