import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { updatePurchaseAction } from "@/lib/actions/purchases";
import { getMaterialOptions, getProjectTaskOptions, getPurchaseDetails } from "@/lib/repositories/graphite";

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

export default async function EditPurchasePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const [purchase, projects, materials] = await Promise.all([
    getPurchaseDetails(id),
    getProjectTaskOptions(),
    getMaterialOptions(),
  ]);

  if (!purchase) {
    notFound();
  }

  const rows = [
    ...purchase.itemLines,
    ...Array.from({ length: Math.max(3, 10 - purchase.itemLines.length) }, (_, index) => ({
      id: `blank-${index}`,
      materialId: "",
      description: "",
      quantity: 0,
      unit: "",
      estimatedUnitPrice: 0,
      approvedUnitPrice: 0,
    })),
  ];

  return (
    <AppShell>
      <PageHeader
        title="Editar pedido de material"
        description="Atualize itens, cotacao, aprovacao e prazo de necessidade do pedido."
      />
      <div className="p-5 sm:p-8">
        <form action={updatePurchaseAction} className="max-w-6xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={purchase.id} />
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Obra
              <select name="projectId" required defaultValue={purchase.projectId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.code} - {project.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Status
              <select name="status" defaultValue={purchase.status} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Urgencia
              <input name="urgency" defaultValue={purchase.urgency} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Necessario em
              <input name="neededBy" type="date" defaultValue={purchase.neededBy} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Justificativa
              <span className="ml-2 text-xs font-normal text-zinc-500">Obrigatoria se algum item ultrapassar o quantitativo previsto da obra.</span>
              <textarea name="justification" defaultValue={purchase.justification} rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" defaultValue={purchase.notes} rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-950">Itens do pedido</h2>
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
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-3 py-3">
                        <select name="materialId" defaultValue={row.materialId} className="h-10 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm">
                          <option value="">Sem cadastro</option>
                          {materials.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.name} ({material.unit})
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <input name="description" defaultValue={row.description} className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="quantity" type="number" min="0" step="0.001" defaultValue={row.quantity || ""} className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="unit" defaultValue={row.unit} className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" placeholder="un" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="estimatedUnitPrice" type="number" min="0" step="0.01" defaultValue={row.estimatedUnitPrice || ""} className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
                      </td>
                      <td className="px-3 py-3">
                        <input name="approvedUnitPrice" type="number" min="0" step="0.01" defaultValue={row.approvedUnitPrice || ""} className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" />
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
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Salvar alteracoes</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
