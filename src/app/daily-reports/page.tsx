import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { deleteDailyReportAction } from "@/lib/actions/daily-reports";
import { getDailyReports } from "@/lib/repositories/graphite";

export default async function DailyReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; updated?: string; deleted?: string; error?: string }>;
}) {
  const [{ created, updated, deleted, error }, reports] = await Promise.all([searchParams, getDailyReports()]);
  const successMessage = created
    ? "Diario cadastrado com sucesso."
    : updated
      ? "Diario atualizado com sucesso."
      : deleted
        ? "Diario excluido com sucesso."
        : "";

  return (
    <AppShell>
      <PageHeader
        title="Diario de obra"
        description="Registro diario de equipe, servicos executados, materiais, ocorrencias e pendencias por obra."
        action={<Link href="/daily-reports/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo diario</Link>}
      />
      <div className="p-5 sm:p-8">
        {successMessage ? (
          <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            {successMessage}
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {error}
          </div>
        ) : null}
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Obra</th>
                <th className="px-4 py-3">Responsavel</th>
                <th className="px-4 py-3">Servicos</th>
                <th className="px-4 py-3">Ocorrencias</th>
                <th className="px-4 py-3">Pendencias</th>
                <th className="px-4 py-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {reports.length > 0 ? reports.map((report) => (
                <tr key={report.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-medium">{report.reportDate}</td>
                  <td className="px-4 py-4 font-semibold">{report.project}</td>
                  <td className="px-4 py-4 text-zinc-700">{report.createdBy}</td>
                  <td className="max-w-[240px] truncate px-4 py-4 text-zinc-700">{report.servicesExecuted}</td>
                  <td className="max-w-[220px] truncate px-4 py-4 text-zinc-700">{report.occurrences}</td>
                  <td className="max-w-[220px] truncate px-4 py-4 text-zinc-700">{report.pendingItems}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/daily-reports/${report.id}/edit`} className="inline-flex h-8 items-center rounded-md border border-zinc-200 px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-50">
                        Editar
                      </Link>
                      <form action={deleteDailyReportAction}>
                        <input type="hidden" name="id" value={report.id} />
                        <button className="h-8 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-700 hover:bg-red-50">
                          Excluir
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhum diario de obra cadastrado.
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
