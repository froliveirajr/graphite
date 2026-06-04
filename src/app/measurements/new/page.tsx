import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createMeasurementAction } from "@/lib/actions/measurements";
import { getBudgetItemOptions, getProjectTaskOptions } from "@/lib/repositories/graphite";

const statuses = ["Rascunho", "Enviada", "Aprovada", "Rejeitada", "Faturada"];

export default async function NewMeasurementPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [{ error }, projects, budgetItems] = await Promise.all([searchParams, getProjectTaskOptions(), getBudgetItemOptions()]);

  return (
    <AppShell>
      <PageHeader title="Nova medicao" description="Registre quantidade executada, valor medido e avanco fisico." />
      <div className="p-5 sm:p-8">
        <form action={createMeasurementAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">Obra
              <select name="projectId" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {projects.map((project) => <option key={project.id} value={project.id}>{project.code} - {project.name}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">Item do orcamento
              <select name="budgetItemId" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {budgetItems.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">Data da medicao
              <input name="measuredAt" type="date" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Status
              <select name="status" defaultValue="Rascunho" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">Periodo inicio
              <input name="periodStartDate" type="date" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Periodo fim
              <input name="periodEndDate" type="date" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Quantidade medida
              <input name="quantityMeasured" type="number" min="0" step="0.001" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Valor medido
              <input name="amountMeasured" type="number" min="0" step="0.01" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">Avanco fisico %
              <input name="physicalProgress" type="number" min="0" max="100" step="0.01" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">Observacoes
              <textarea name="notes" rows={3} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/measurements" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">Cancelar</Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Salvar medicao</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
