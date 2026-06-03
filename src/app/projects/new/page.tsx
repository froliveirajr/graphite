import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { createProjectAction } from "@/lib/actions/projects";
import { getClients } from "@/lib/repositories/graphite";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [{ error }, clients] = await Promise.all([searchParams, getClients()]);

  return (
    <AppShell>
      <PageHeader
        title="Nova obra"
        description="Abra uma obra vinculada a um cliente, com tipo, endereco, orcamento, prazo e status inicial."
      />
      <div className="p-5 sm:p-8">
        <form action={createProjectAction} className="max-w-5xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          {error ? (
            <div className="mb-5 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Nome da obra
              <input name="name" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Codigo interno
              <input name="code" placeholder="Opcional" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Cliente
              <select name="clientId" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option value="">Selecione</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Tipo de obra
              <select name="projectType" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option>Reforma residencial</option>
                <option>Reforma de apartamento</option>
                <option>Reforma comercial</option>
                <option>Restaurante</option>
                <option>Construcao interna</option>
                <option>Adequacao de imovel</option>
                <option>Manutencao</option>
                <option>Obra personalizada</option>
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Endereco da obra
              <input name="address" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Inicio previsto
              <input name="plannedStartDate" type="date" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Termino previsto
              <input name="plannedEndDate" type="date" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Orcamento previsto
              <input name="plannedBudget" type="number" min="0" step="0.01" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Status inicial
              <select name="status" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option>Orcamento</option>
                <option>Planejamento</option>
                <option>Em andamento</option>
                <option>Pausada</option>
                <option>Aguardando cliente</option>
                <option>Aguardando material</option>
                <option>Aguardando terceirizado</option>
                <option>Em vistoria</option>
                <option>Concluida</option>
                <option>Cancelada</option>
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Prioridade
              <select name="priority" required className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                <option>Media</option>
                <option>Alta</option>
                <option>Baixa</option>
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800 md:col-span-2">
              Observacoes
              <textarea name="notes" rows={4} className="mt-2 w-full rounded-md border border-zinc-200 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Link href="/projects" className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700">
              Cancelar
            </Link>
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">
              Salvar obra
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
