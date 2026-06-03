import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="grid min-h-screen bg-zinc-100 lg:grid-cols-[1fr_480px]">
      <section className="hidden bg-zinc-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f9a52c] text-2xl font-black">G</div>
          <div>
            <p className="text-xl font-semibold tracking-wide">GRAPHITE</p>
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">arquitetura e construcao</p>
          </div>
        </div>
        <div>
          <h1 className="max-w-xl text-4xl font-semibold leading-tight">Controle de obras, equipes, materiais e custos em um so lugar.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-300">
            Plataforma operacional criada para a rotina de reformas, restaurantes, apartamentos e ambientes comerciais personalizados.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <form action={loginAction} className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="mb-8 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f9a52c] text-2xl font-black text-white">G</div>
            <h1 className="mt-4 text-2xl font-semibold">Graphite Operacional</h1>
          </div>
          <h2 className="text-xl font-semibold">Entrar</h2>
          <p className="mt-1 text-sm text-zinc-500">Use seu e-mail corporativo e senha.</p>
          {error ? (
            <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}
          <label className="mt-6 block text-sm font-medium">
            E-mail
            <input name="email" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" type="email" placeholder="admin@graphite.local" />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Senha
            <input name="password" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" type="password" placeholder="********" />
          </label>
          <button className="mt-6 h-11 w-full rounded-md bg-zinc-950 text-sm font-semibold text-white">Entrar</button>
          <Link className="mt-4 block text-center text-sm font-medium text-zinc-600 hover:text-zinc-950" href="/">
            Voltar ao painel
          </Link>
        </form>
      </section>
    </main>
  );
}
