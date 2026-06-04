import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createServiceCompositionAction } from "@/lib/actions/service-compositions";
import { getMaterialOptions, getProjectTaskOptions } from "@/lib/repositories/graphite";

const rows = Array.from({ length: 12 }, (_, index) => index);

export default async function NewServiceCompositionPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, projects, materials] = await Promise.all([searchParams, getProjectTaskOptions(), getMaterialOptions()]);

  return (
    <AppShell>
      <PageHeader title="Nova composicao" description="Cadastre consumo de materiais por unidade do servico." />
      <div className="p-5 sm:p-8">
        <form action={createServiceCompositionAction} className="max-w-6xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">Nome
              <input name="name" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Codigo
              <input name="code" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Tipo de servico
              <input name="serviceType" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Unidade do servico
              <input name="unit" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" placeholder="m2, m, un" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Valor unitario
              <input name="unitPrice" type="number" min="0" step="0.01" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Obra especifica
              <select name="projectId" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Composicao padrao</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.code} - {project.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">Observacoes
              <textarea name="notes" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-950">Materiais da composicao</h2>
            <div className="mt-3 overflow-x-auto rounded-lg border border-zinc-200">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr>
                    <th className="px-3 py-3">Material</th>
                    <th className="px-3 py-3">Consumo por unidade</th>
                    <th className="px-3 py-3">Un.</th>
                    <th className="px-3 py-3">Perda %</th>
                    <th className="px-3 py-3">Observacao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {rows.map((row) => (
                    <tr key={row}>
                      <td className="px-3 py-3">
                        <select name="materialId" className="h-10 w-full rounded-md border border-zinc-200 bg-white px-2 text-sm">
                          <option value="">Selecione</option>
                          {materials.map((material) => <option key={material.id} value={material.id}>{material.name} ({material.unit})</option>)}
                        </select>
                      </td>
                      <td className="px-3 py-3"><input name="quantityPerUnit" type="number" min="0" step="0.0001" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" /></td>
                      <td className="px-3 py-3"><input name="materialUnit" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" placeholder="un" /></td>
                      <td className="px-3 py-3"><input name="wastePercent" type="number" min="0" step="0.01" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" /></td>
                      <td className="px-3 py-3"><input name="materialNotes" className="h-10 w-full rounded-md border border-zinc-200 px-2 text-sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <Link href="/service-compositions" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">Cancelar</Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Salvar composicao</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
