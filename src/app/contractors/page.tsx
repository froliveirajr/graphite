import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { getContractors } from "@/lib/repositories/graphite";

export default async function ContractorsPage() {
  const contractors = await getContractors();

  return (
    <AppShell>
      <PageHeader
        title="Terceirizados"
        description="Empresas e profissionais externos, especialidade, contato, avaliacao e contratos vinculados."
        action={<button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Novo terceirizado</button>}
      />
      <div className="p-5 sm:p-8">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
              <tr>
                <th className="px-4 py-3">Terceirizado</th>
                <th className="px-4 py-3">Contato</th>
                <th className="px-4 py-3">Especialidade</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Contratos</th>
                <th className="px-4 py-3">Avaliacao</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {contractors.length > 0 ? contractors.map((contractor) => (
                <tr key={contractor.id} className="hover:bg-zinc-50">
                  <td className="px-4 py-4 font-semibold">{contractor.name}</td>
                  <td className="px-4 py-4 text-zinc-700">{contractor.contactName}</td>
                  <td className="px-4 py-4 text-zinc-700">{contractor.specialty}</td>
                  <td className="px-4 py-4 text-zinc-700">{contractor.phone}</td>
                  <td className="px-4 py-4 text-zinc-700">{contractor.email}</td>
                  <td className="px-4 py-4 font-medium">{contractor.activeContracts}</td>
                  <td className="px-4 py-4">{contractor.rating ? `${contractor.rating}/5` : "-"}</td>
                  <td className="px-4 py-4"><StatusBadge value={contractor.status} /></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-zinc-500">
                    Nenhum terceirizado cadastrado.
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
