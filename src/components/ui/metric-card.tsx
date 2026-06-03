import type { LucideIcon } from "lucide-react";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-zinc-600">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-zinc-950">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-zinc-950 text-white">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-500">{detail}</p>
    </div>
  );
}
