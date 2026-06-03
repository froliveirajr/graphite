import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { deleteMaterialAction } from "@/lib/actions/materials";
import { formatCurrency } from "@/lib/data/graphite";
import { getMaterials } from "@/lib/repositories/graphite";

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const [{ created, updated, deleted, error }, materials] = await Promise.all([searchParams, getMaterials()]);
  const successMessage = created
    ? "Material cadastrado com sucesso."
    : updated
      ? "Material atualizado com sucesso."
      : deleted
        ? "Material excluido com sucesso."
        : "";


  return (
    <AppShell>
      <PageHeader
        title="Materiais"
        description="Catalogo padronizado, fornecedores preferenciais, preco medio e estoque minimo."
        action={<Link href="/materials/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo material</Link>}
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
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Unidade</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3">Minimo</th>
                <th className="px-4 py-3">Preco medio</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {materials.length > 0 ? materials.map((material) => (
                <tr key={material.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold">{material.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{material.internalCode}</p>
                  </td>
                  <td className="px-4 py-4 text-zinc-700">{material.category}</td>
                  <td className="px-4 py-4 text-zinc-700">{material.unit}</td>
                  <td className="px-4 py-4 font-medium">{material.stock}</td>
                  <td className="px-4 py-4">{material.minimum}</td>
                  <td className="px-4 py-4">{formatCurrency(material.averagePrice)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/materials/${material.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">
                        Editar
                      </Link>
                      <form action={deleteMaterialAction}>
                        <input type="hidden" name="id" value={material.id} />
                        <button className="h-8 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhum material cadastrado.
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
