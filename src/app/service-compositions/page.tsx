import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { deleteServiceCompositionAction } from "@/lib/actions/service-compositions";
import { formatCurrency } from "@/lib/data/graphite";
import { getServiceCompositions } from "@/lib/repositories/graphite";

export default async function ServiceCompositionsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const [{ created, updated, deleted, error }, compositions] = await Promise.all([searchParams, getServiceCompositions()]);
  const successMessage = created ? "Composicao cadastrada." : updated ? "Composicao atualizada." : deleted ? "Composicao excluida." : "";

  return (
    <AppShell>
      <PageHeader
        title="Composicoes de servicos"
        description="Servicos com consumo de materiais por unidade para formar orcamento e quantitativos da obra."
        action={<Link href="/service-compositions/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Nova composicao</Link>}
      />
      <div className="p-5 sm:p-8">
        {successMessage ? <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</div> : null}
        {error ? <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Composicao</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Unidade</th>
                <th className="px-4 py-3">Valor unitario</th>
                <th className="px-4 py-3">Materiais</th>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {compositions.length > 0 ? compositions.map((composition) => (
                <tr key={composition.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold">{composition.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{composition.code}</p>
                  </td>
                  <td className="px-4 py-4 text-zinc-700">{composition.serviceType}</td>
                  <td className="px-4 py-4">{composition.unit}</td>
                  <td className="px-4 py-4">{formatCurrency(composition.unitPrice)}</td>
                  <td className="px-4 py-4">{composition.materials}</td>
                  <td className="px-4 py-4 text-zinc-700">{composition.project}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/service-compositions/${composition.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">Editar</Link>
                      <form action={deleteServiceCompositionAction}>
                        <input type="hidden" name="id" value={composition.id} />
                        <button className="h-8 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">Excluir</button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">Nenhuma composicao cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
