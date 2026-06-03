import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { formatCurrency } from "@/lib/data/graphite";
import { getMaterials } from "@/lib/repositories/graphite";

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <AppShell>
      <PageHeader
        title="Materiais"
        description="Catalogo padronizado, fornecedores preferenciais, preco medio e estoque minimo."
        action={<button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo material</button>}
      />
      <div className="p-5 sm:p-8">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Material</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Unidade</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3">Minimo</th>
                <th className="px-4 py-3">Preco medio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {materials.length > 0 ? materials.map((material) => (
                <tr key={material.name} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-semibold">{material.name}</td>
                  <td className="px-4 py-4 text-zinc-700">{material.category}</td>
                  <td className="px-4 py-4 text-zinc-700">{material.unit}</td>
                  <td className="px-4 py-4 font-medium">{material.stock}</td>
                  <td className="px-4 py-4">{material.minimum}</td>
                  <td className="px-4 py-4">{formatCurrency(material.averagePrice)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">
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
