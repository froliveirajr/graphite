import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { updateBudgetItemAction } from "@/lib/actions/budget-items";
import { getBudgetItemDetails, getProjectTaskOptions } from "@/lib/repositories/graphite";

const statuses = ["Planejado", "Em andamento", "Concluido", "Cancelado"];

export default async function EditBudgetItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ id }, { error }, projects] = await Promise.all([params, searchParams, getProjectTaskOptions()]);
  const item = await getBudgetItemDetails(id);

  if (!item) {
    notFound();
  }

  return (
    <AppShell>
      <PageHeader title="Editar item de orcamento" description="Atualize etapa, valor, cronograma e avanco fisico." />
      <div className="p-5 sm:p-8">
        <form action={updateBudgetItemAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <input type="hidden" name="id" value={item.id} />
          {error ? <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">Obra
              <select name="projectId" required defaultValue={item.projectId} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.code} - {project.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">Codigo
              <input name="code" defaultValue={item.code === "-" ? "" : item.code} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Etapa
              <input name="phase" required defaultValue={item.phase} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Status
              <select name="status" defaultValue={item.status} className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">Descricao
              <textarea name="description" required rows={3} defaultValue={item.description} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Unidade
              <input name="unit" required defaultValue={item.unit} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Quantidade
              <input name="quantity" type="number" min="0" step="0.001" required defaultValue={item.quantity} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Valor unitario
              <input name="unitPrice" type="number" min="0" step="0.01" required defaultValue={item.unitPrice} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Peso fisico %
              <input name="physicalWeight" type="number" min="0" max="100" step="0.01" defaultValue={item.physicalWeight} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Inicio planejado
              <input name="plannedStartDate" type="date" defaultValue={item.plannedStartDate === "-" ? "" : item.plannedStartDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Fim planejado
              <input name="plannedEndDate" type="date" defaultValue={item.plannedEndDate === "-" ? "" : item.plannedEndDate} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Avanco fisico %
              <input name="physicalProgress" type="number" min="0" max="100" step="0.01" defaultValue={item.physicalProgress} className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">Observacoes
              <textarea name="notes" rows={3} defaultValue={item.notes} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <input type="hidden" name="taskId" value={item.taskId} />
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/budget-items" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">Cancelar</Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Salvar alteracoes</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
