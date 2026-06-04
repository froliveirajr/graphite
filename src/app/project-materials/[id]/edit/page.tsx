import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { updateProjectMaterialAction } from "@/lib/actions/project-materials";
import {
  getMaterialOptions,
  getProjectMaterialRequirementDetails,
  getProjectTaskOptions,
} from "@/lib/repositories/graphite";

export default async function EditProjectMaterialPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }, projects, materials] = await Promise.all([
    params,
    searchParams,
    getProjectTaskOptions(),
    getMaterialOptions(),
  ]);
  const requirement = await getProjectMaterialRequirementDetails(id);

  if (!requirement) {
    notFound();
  }

  return (
    <AppShell>
      <PageHeader title="Editar quantitativo de material" description="Atualize o total previsto do material para a obra." />
      <div className="p-5 sm:p-8">
        <form action={updateProjectMaterialAction} className="max-w-4xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={requirement.id} />
          {error ? <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Obra
              <select name="projectId" required defaultValue={requirement.projectId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.code} - {project.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Material
              <select name="materialId" required defaultValue={requirement.materialId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {materials.map((material) => (
                  <option key={material.id} value={material.id}>{material.name} ({material.unit})</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Quantidade prevista
              <input name="plannedQuantity" type="number" min="0" step="0.001" required defaultValue={requirement.plannedQuantity} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Unidade
              <input name="unit" required defaultValue={requirement.unit} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Valor unitario estimado
              <input name="estimatedUnitPrice" type="number" min="0" step="0.01" defaultValue={requirement.estimatedUnitPrice || ""} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <div className="rounded-md border border-zinc-200 p-4 text-sm">
              <p className="text-zinc-500">Saldo atual para pedido</p>
              <strong className="mt-2 block">{requirement.remainingQuantity} {requirement.unit}</strong>
            </div>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={4} defaultValue={requirement.notes} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/project-materials" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">Cancelar</Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Salvar alteracoes</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
