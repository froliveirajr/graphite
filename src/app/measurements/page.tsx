import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { deleteMeasurementAction } from "@/lib/actions/measurements";
import { formatCurrency } from "@/lib/data/graphite";
import { getMeasurements } from "@/lib/repositories/graphite";

export default async function MeasurementsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const [{ created, updated, deleted, error }, measurements] = await Promise.all([searchParams, getMeasurements()]);
  const successMessage = created ? "Medicao cadastrada com sucesso." : updated ? "Medicao atualizada com sucesso." : deleted ? "Medicao excluida com sucesso." : "";

  return (
    <AppShell>
      <PageHeader
        title="Medicoes de servico"
        description="Acompanhamento de quantidades executadas, valor medido e avanco fisico por item de orcamento."
        action={<Link href="/measurements/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Nova medicao</Link>}
      />
      <div className="p-5 sm:p-8">
        {successMessage ? <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{successMessage}</div> : null}
        {error ? <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">{error}</div> : null}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[1320px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Periodo</th>
                <th className="px-4 py-3">Qtd.</th>
                <th className="px-4 py-3">Saldo item</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Fisico</th>
                <th className="px-4 py-3">Executantes</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {measurements.length > 0 ? measurements.map((measurement) => (
                <tr key={measurement.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-medium">{measurement.measuredAt}</td>
                  <td className="px-4 py-4 font-semibold">{measurement.project}</td>
                  <td className="max-w-[260px] truncate px-4 py-4 text-zinc-700">{measurement.budgetItem}</td>
                  <td className="px-4 py-4 text-zinc-700">{measurement.periodStartDate} ate {measurement.periodEndDate}</td>
                  <td className="px-4 py-4">{measurement.quantityMeasured} {measurement.budgetUnit}</td>
                  <td className="px-4 py-4 text-zinc-700">{measurement.remainingQuantity} de {measurement.budgetQuantity} {measurement.budgetUnit}</td>
                  <td className="px-4 py-4 font-semibold">{formatCurrency(measurement.amountMeasured)}</td>
                  <td className="px-4 py-4">{measurement.physicalProgress}%</td>
                  <td className="max-w-[220px] truncate px-4 py-4 text-zinc-700">{measurement.executants}</td>
                  <td className="px-4 py-4"><StatusBadge value={measurement.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/measurements/${measurement.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">Editar</Link>
                      <form action={deleteMeasurementAction}>
                        <input type="hidden" name="id" value={measurement.id} />
                        <button className="h-8 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">Excluir</button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={11} className="px-4 py-10 text-center text-sm text-zinc-500">Nenhuma medicao cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
