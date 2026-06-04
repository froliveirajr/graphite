import Link from "next/link";
import { formatCurrency } from "@/lib/data/graphite";
import type { BudgetItemListItem } from "@/lib/repositories/graphite";

type BudgetGanttProps = {
  items: BudgetItemListItem[];
  showProject?: boolean;
};

function parseDate(value: string) {
  if (!value || value === "-") {
    return null;
  }

  const date = new Date(`${value}T03:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function daysBetween(start: Date, end: Date) {
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

function formatShortDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function BudgetGantt({ items, showProject = false }: BudgetGanttProps) {
  const scheduledItems = items
    .map((item) => ({
      ...item,
      start: parseDate(item.plannedStartDate),
      end: parseDate(item.plannedEndDate),
    }))
    .filter((item): item is typeof item & { start: Date; end: Date } => Boolean(item.start && item.end))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (scheduledItems.length === 0) {
    return <div className="px-4 py-10 text-center text-sm text-zinc-500">Cadastre datas de inicio e fim para gerar o Gantt.</div>;
  }

  const minDate = new Date(Math.min(...scheduledItems.map((item) => item.start.getTime())));
  const maxDate = new Date(Math.max(...scheduledItems.map((item) => item.end.getTime())));
  const totalDays = Math.max(1, daysBetween(minDate, maxDate) + 1);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[980px]">
        <div className="grid grid-cols-[300px_1fr_170px] border-b border-zinc-200 bg-zinc-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-500">
          <span>Item</span>
          <div className="flex justify-between">
            <span>{formatShortDate(minDate)}</span>
            <span>{formatShortDate(maxDate)}</span>
          </div>
          <span className="text-right">Fisico-financeiro</span>
        </div>
        <div className="divide-y divide-zinc-100">
          {scheduledItems.map((item) => {
            const offset = (daysBetween(minDate, item.start) / totalDays) * 100;
            const width = Math.max(3, ((daysBetween(item.start, item.end) + 1) / totalDays) * 100);
            const progress = Math.min(100, Math.max(0, item.physicalProgress));

            return (
              <div key={item.id} className="grid grid-cols-[300px_1fr_170px] items-center gap-4 px-4 py-4 text-sm">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 font-semibold text-zinc-950">{item.code === "-" ? item.phase : item.code}</span>
                    <Link href={`/budget-items/${item.id}/edit`} className="truncate text-xs font-semibold text-zinc-500 hover:text-zinc-950">
                      Editar
                    </Link>
                  </div>
                  <p className="mt-1 truncate text-xs text-zinc-500">
                    {showProject ? `${item.project} - ` : ""}{item.phase} - {item.description}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    {item.quantity} {item.unit} x {formatCurrency(item.unitPrice)}
                  </p>
                </div>
                <div>
                  <div className="relative h-8 rounded-md bg-zinc-100">
                    <div
                      className="absolute top-1 h-6 rounded-md bg-zinc-900"
                      style={{ left: `${offset}%`, width: `${Math.min(width, 100 - offset)}%` }}
                    >
                      <div className="h-6 rounded-md bg-[#f9a52c]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-zinc-500">
                    <span>{item.plannedStartDate}</span>
                    <span>{item.plannedEndDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <strong className="block">{formatCurrency(item.totalPrice)}</strong>
                  <span className="text-xs text-zinc-500">{progress}% fisico - peso {item.physicalWeight}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
