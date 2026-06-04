import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createPurchaseAction } from "@/lib/actions/purchases";
import { getMaterialOptions, getProjectTaskOptions } from "@/lib/repositories/graphite";

const statuses = [
  "Solicitada",
  "Em cotacao",
  "Aguardando aprovacao",
  "Aprovada",
  "Comprada",
  "Recebida",
  "Cancelada",
  "Reprovada",
];

const itemRows = Array.from({ length: 10 }, (_, index) => index);

export default async function NewPurchasePage({ searchParams }: { searchParams: Promise<{ error?: string; projectId?: string }> }) {
  const [{ error, projectId }, projects, materials] = await Promise.all([
    searchParams,
    getProjectTaskOptions(),
    getMaterialOptions(),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Novo pedido de material"
        description="Solicite materiais por obra, com quantidade, prazo, justificativa e valores estimados."
      />
      <div className="p-5 sm:p-8">
        <form action={createPurchaseAction} className="max-w-6xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Obra
              <select name="projectId" required defaultValue={projectId ?? ""} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Status
              <select name="status" defaultValue="Solicitada" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Urgencia
              <input name="urgency" placeholder="Normal, alta, imediata" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Necessario em
              <input name="neededBy" type="date" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Justificativa
              <textarea name="justification" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-950">Itens do pedido</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Materiais cadastrados serao conferidos contra o quantitativo previsto da obra.
            </p>
            <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-3 py-3">Material</th>
                    <th className="px-3 py-3">Descricao livre</th>
                    <th className="px-3 py-3">Qtd.</th>
                    <th className="px-3 py-3">Un.</th>
                    <th className="px-3 py-3">Valor estimado</th>
                    <th className="px-3 py-3">Valor aprovado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {itemRows.map((row) => (
                    <tr key={row}>
                      <td className="px-3 py-3">
                        <select name="materialId" className="h-10 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm">
                          <option value="">Sem cadastro</option>
                          {materials.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.name} ({material.unit})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <input name="description" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="quantity" type="number" min="0" step="0.001" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="unit" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" placeholder="un" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="estimatedUnitPrice" type="number" min="0" step="0.01" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="approvedUnitPrice" type="number" min="0" step="0.01" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link href="/purchases" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Salvar pedido</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
