import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createClientAction } from "@/lib/actions/clients";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <AppShell>
      <PageHeader
        title="Novo cliente"
        description="Cadastre o cliente que sera vinculado a uma ou mais obras da Graphite."
      />
      <div className="p-5 sm:p-8">
        <form action={createClientAction} className="max-w-4xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Nome completo ou razao social
              <input name="name" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Tipo de cliente
              <select name="clientType" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option>Pessoa fisica</option>
                <option>Empresa</option>
                <option>Restaurante</option>
                <option>Investidor</option>
                <option>Arquiteto parceiro</option>
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Documento
              <div className="mt-2 grid grid-cols-[110px_1fr] gap-2">
                <select name="documentType" className="h-11 rounded-md border border-zinc-200 bg-white px-3 text-sm">
                  <option>CPF</option>
                  <option>CNPJ</option>
                </select>
                <input name="documentNumber" required className="h-11 rounded-md border border-zinc-200 px-3 text-sm" />
              </div>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Telefone
              <input name="phone" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              WhatsApp
              <input name="whatsapp" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              E-mail
              <input name="email" type="email" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Endereco
              <input name="address" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={4} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/clients" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              Salvar cliente
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
