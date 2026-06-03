import { clsx } from "clsx";

const tones: Record<string, string> = {
  "Em andamento": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Aguardando material": "border-amber-200 bg-amber-50 text-amber-700",
  "Em vistoria": "border-sky-200 bg-sky-50 text-sky-700",
  Concluida: "border-zinc-200 bg-zinc-100 text-zinc-700",
  Planejamento: "border-blue-200 bg-blue-50 text-blue-700",
  Pausada: "border-orange-200 bg-orange-50 text-orange-700",
  Alta: "border-red-200 bg-red-50 text-red-700",
  Media: "border-amber-200 bg-amber-50 text-amber-700",
  Baixa: "border-zinc-200 bg-zinc-50 text-zinc-600",
  Ativo: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <span
      className={clsx(
        "inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-medium",
        tones[value] ?? "border-zinc-200 bg-zinc-50 text-zinc-600",
      )}
    >
      {value}
    </span>
  );
}
