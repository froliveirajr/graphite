import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { getClients } from "@/lib/repositories/graphite";

type ClientsSearchParams = {
  q?: string | string[];
  type?: string | string[];
  status?: string | string[];
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<ClientsSearchParams>;
}) {
  const params = await searchParams;
  const filters = {
    query: firstValue(params.q)?.trim() ?? "",
    type: firstValue(params.type) ?? "",
    status: firstValue(params.status) ?? "",
  };
  const clients = await getClients(filters);
  const clientTypes = Array.from(new Set(clients.map((client) => client.type))).sort();

  return (
    <AppShell>
      <PageHeader
        title="Clientes"
        description="Cadastro, historico de obras, contatos e documentos vinculados aos clientes da Graphite."
        action={<Link href="/clients/new" className="inline-flex h-10 items-center rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo cliente</Link>}
      />
      <div className="p-5 sm:p-8">
        <form className="mb-4 grid gap-3 md:grid-cols-[1fr_220px_180px_108px]" action="/clients">
          <input
            name="q"
            defaultValue={filters.query}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
            placeholder="Buscar por nome, documento ou e-mail"
          />
          <select
            name="type"
            defaultValue={filters.type}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
          >
            <option value="">Todos os tipos</option>
            {clientTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
          <select
            name="status"
            defaultValue={filters.status}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm"
          >
            <option value="">Status</option>
            <option>Ativo</option>
            <option>Inativo</option>
          </select>
          <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
            Filtrar
          </button>
        </form>
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Contato</th>
                <th className="px-4 py-3">Endereco</th>
                <th className="px-4 py-3">Obras</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {clients.length > 0 ? clients.map((client) => (
                <tr key={client.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-zinc-950">{client.name}</p>
                    <p className="mt-1 text-xs text-zinc-500">{client.document}</p>
                  </td>
                  <td className="px-4 py-4 text-zinc-700">{client.type}</td>
                  <td className="px-4 py-4">
                    <p className="text-zinc-800">{client.phone}</p>
                    <p className="mt-1 text-xs text-zinc-500">{client.email}</p>
                  </td>
                  <td className="px-4 py-4 text-zinc-700">{client.address}</td>
                  <td className="px-4 py-4 font-medium">{client.projects}</td>
                  <td className="px-4 py-4"><StatusBadge value={client.status} /></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhum cliente encontrado com os filtros atuais.
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
