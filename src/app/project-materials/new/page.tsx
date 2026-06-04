import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createProjectMaterialAction } from "@/lib/actions/project-materials";
import { getMaterialOptions, getProjectTaskOptions } from "@/lib/repositories/graphite";

export default async function NewProjectMaterialPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; projectId?: string }>;
}) {
  const [{ error, projectId }, projects, materials] = await Promise.all([
    searchParams,
    getProjectTaskOptions(),
    getMaterialOptions(),
  ]);

  return (
    <AppShell>
      <PageHeader
        title="Novo quantitativo de material"
        description="Lance o total previsto do material para a obra, independente do servico especifico."
      />
      <div className="p-5 sm:p-8">
        <form action={createProjectMaterialAction} className="max-w-4xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Obra
              <select name="projectId" required defaultValue={projectId ?? ""} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.code} - {project.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Material
              <select name="materialId" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>{material.name} ({material.unit})</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Quantidade prevista
              <input name="plannedQuantity" type="number" min="0" step="0.001" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Unidade
              <input name="unit" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" placeholder="un, m2, kg, saco" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Valor unitario estimado
              <input name="estimatedUnitPrice" type="number" min="0" step="0.01" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={4} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/project-materials" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">Cancelar</Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Salvar quantitativo</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
