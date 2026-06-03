import Link from "next/link";
import { Bell, LogOut, Search } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import { requireSession } from "@/lib/auth/session";
import { navigation } from "@/lib/data/graphite";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  PROJECT_MANAGER: "Gestor de obras",
  OFFICE: "Escritorio",
  FOREMAN: "Encarregado",
  EMPLOYEE: "Funcionario",
  CONTRACTOR: "Terceirizado",
  CLIENT: "Cliente",
};

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const userName = session.name;
  const userRole = roleLabels[session.role] ?? session.role;

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200 bg-zinc-950 text-white lg:block">
        <div className="flex h-20 items-center gap-3 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#f9a52c] text-xl font-black text-white">
            G
          </div>
          <div>
            <p className="text-lg font-semibold tracking-wide">GRAPHITE</p>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">operacional</p>
          </div>
        </div>
        <nav className="space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f9a52c] font-black text-white lg:hidden">
              G
            </div>
            <div className="hidden h-10 w-full max-w-md items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-3 text-sm text-zinc-500 md:flex">
              <Search className="h-4 w-4" aria-hidden="true" />
              Buscar obra, cliente, material ou tarefa
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
              aria-label="Notificacoes"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{userName}</p>
              <p className="text-xs text-zinc-500">{userRole}</p>
            </div>
            <form action={logoutAction}>
              <button
                className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                aria-label="Sair"
                title="Sair"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
