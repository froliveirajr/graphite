import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";

export function ModulePlaceholder({
  title,
  description,
  icon: Icon,
  items,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
}) {
  return (
    <AppShell>
      <PageHeader
        title={title}
        description={description}
        action={<button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo registro</button>}
      />
      <div className="p-5 sm:p-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f9a52c] text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-semibold">Escopo inicial do modulo</h2>
              <p className="text-sm text-zinc-500">Preparado para receber CRUD, filtros, permissoes e integracao Prisma.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <div key={item} className="rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm font-medium text-zinc-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
