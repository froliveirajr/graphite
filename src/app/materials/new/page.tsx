import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createMaterialAction } from "@/lib/actions/materials";

export default async function NewMaterialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AppShell>
      <PageHeader
        title="Novo material"
        description="Cadastre um item do catalogo com categoria, unidade, preco medio e estoque minimo."
      />
      <div className="p-5 sm:p-8">
        <form action={createMaterialAction} className="max-w-4xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Nome do material
              <input name="name" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Categoria
              <input name="category" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" placeholder="Eletrica, Hidraulica, Tintas" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Unidade
              <input name="unit" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" placeholder="un, m, m2, saco, lata" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Marca
              <input name="brand" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Codigo interno
              <input name="internalCode" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" placeholder="Opcional" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Preco medio
              <input name="averagePrice" type="number" min="0" step="0.01" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Estoque minimo
              <input name="minimumStock" type="number" min="0" step="0.001" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={4} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/materials" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              Salvar material
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
