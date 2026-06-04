import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { BudgetGantt } from "@/components/ui/budget-gantt";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/data/graphite";
import { getProjectDetails, type ProjectDetails } from "@/lib/repositories/graphite";

const tabs = [
  { label: "Visao geral", value: "overview" },
  { label: "Ambientes", value: "areas" },
  { label: "Tarefas", value: "tasks" },
  { label: "Materiais", value: "materials" },
  { label: "Equipe", value: "team" },
  { label: "Terceirizados", value: "contractors" },
  { label: "Financeiro", value: "financial" },
  { label: "Fotos", value: "photos" },
  { label: "Documentos", value: "documents" },
  { label: "Diario", value: "daily" },
] as const;

type ProjectTab = (typeof tabs)[number]["value"];

function emptyState(message: string) {
  return <div className="px-4 py-10 text-center text-sm text-zinc-500">{message}</div>;
}

function financialUsage(project: ProjectDetails) {
  if (project.budget <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((project.actualCost / project.budget) * 100));
}

function sumValues(items: Array<{ totalPrice?: number; amountMeasured?: number }>, key: "totalPrice" | "amountMeasured") {
  return items.reduce((total, item) => total + (item[key] ?? 0), 0);
}

function isProjectTab(value: string | undefined): value is ProjectTab {
  return tabs.some((tab) => tab.value === value);
}

export default async function ProjectDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  const project = await getProjectDetails(id);

  if (!project) {
    notFound();
  }

  const activeTab = isProjectTab(tab) ? tab : "overview";
  const usage = financialUsage(project);
  const budgetTotal = sumValues(project.budgetItems, "totalPrice");
  const measuredTotal = sumValues(project.measurements, "amountMeasured");
  const physicalProgress =
    project.budgetItems.length > 0
      ? Math.round(
          project.budgetItems.reduce((total, item) => total + item.physicalProgress * (item.physicalWeight || 1), 0) /
            project.budgetItems.reduce((total, item) => total + (item.physicalWeight || 1), 0),
        )
      : project.progress;
  const photos = project.files.filter((file) => file.fileType.toLocaleLowerCase("pt-BR").includes("foto"));
  const documents = project.files.filter((file) => !file.fileType.toLocaleLowerCase("pt-BR").includes("foto"));

  return (
    <AppShell>
      <PageHeader
        title={project.name}
        description={`${project.code} - ${project.type} - ${project.address}`}
        action={<StatusBadge value={project.status} />}
      />
      <div className="space-y-6 p-5 sm:p-8">
        <div className="overflow-x-auto border-b border-zinc-200">
          <div className="flex min-w-max gap-2">
            {tabs.map((item) => (
              <Link
                key={item.value}
                href={`/projects/${project.id}?tab=${item.value}`}
                className={`inline-flex h-10 items-center rounded-t-md px-3 text-sm font-medium ${
                  activeTab === item.value ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {activeTab === "overview" ? (
          <>
            <section className="grid gap-4 lg:grid-cols-4">
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Cliente</p>
                <p className="mt-2 font-semibold">{project.client}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Gestor</p>
                <p className="mt-2 font-semibold">{project.manager}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Tecnico responsavel</p>
                <p className="mt-2 font-semibold">{project.technicalResponsible}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Prazo previsto</p>
                <p className="mt-2 font-semibold">{project.plannedStart} ate {project.plannedEnd}</p>
              </div>
            </section>

            <section className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="min-w-0 rounded-lg border border-zinc-200 bg-white shadow-sm">
                <div className="border-b border-zinc-200 p-4">
                  <h2 className="font-semibold">Resumo operacional</h2>
                </div>
                <div className="grid gap-3 p-4 md:grid-cols-3">
                  <div className="rounded-md border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Progresso fisico</p>
                    <strong className="mt-2 block text-2xl">{project.progress}%</strong>
                  </div>
                  <div className="rounded-md border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Tarefas atrasadas</p>
                    <strong className="mt-2 block text-2xl">{project.overdueTasks}</strong>
                  </div>
                  <div className="rounded-md border border-zinc-200 p-4">
                    <p className="text-sm text-zinc-500">Aprovacoes pendentes</p>
                    <strong className="mt-2 block text-2xl">{project.pendingApprovals}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <h2 className="font-semibold">Resumo financeiro</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between"><span>Orcamento previsto</span><strong>{formatCurrency(project.budget)}</strong></div>
                  <div className="flex justify-between"><span>Custo realizado</span><strong>{formatCurrency(project.actualCost)}</strong></div>
                  <div className="flex justify-between"><span>Saldo previsto</span><strong>{formatCurrency(project.budget - project.actualCost)}</strong></div>
                  <div className="flex justify-between"><span>Uso do orcamento</span><strong>{usage}%</strong></div>
                </div>
                <div className="mt-5 h-2 rounded-full bg-zinc-100">
                  <div className="h-2 rounded-full bg-zinc-950" style={{ width: `${usage}%` }} />
                </div>
              </div>
            </section>
          </>
        ) : null}

        {activeTab === "areas" ? (
          <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Ambientes da obra</h2>
            </div>
            {project.areas.length > 0 ? (
              <div className="grid gap-3 p-4 md:grid-cols-2">
                {project.areas.map((area) => (
                  <div key={area.name} className="rounded-md border border-zinc-200 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{area.name}</h3>
                        <p className="mt-1 text-xs text-zinc-500">{area.owner} - {area.tasks} tarefas</p>
                      </div>
                      <StatusBadge value={area.status} />
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-zinc-100">
                      <div className="h-2 rounded-full bg-[#f9a52c]" style={{ width: `${area.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : emptyState("Nenhum ambiente cadastrado para esta obra.")}
          </section>
        ) : null}

        {activeTab === "tasks" ? (
          <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Tarefas vinculadas</h2>
              <Link href="/tasks/new" className="text-sm font-semibold text-zinc-900 hover:underline">Nova tarefa</Link>
            </div>
            {project.tasks.length > 0 ? (
              <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-4">
                {project.tasks.map((task) => (
                  <div key={task.id} className="rounded-md border border-zinc-200 p-4">
                    <StatusBadge value={task.status} />
                    <h3 className="mt-3 text-sm font-semibold">{task.title}</h3>
                    <p className="mt-2 text-xs text-zinc-500">{task.area} - {task.serviceType}</p>
                    <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-600">
                      <span>{task.owner}</span>
                      <span>{task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : emptyState("Nenhuma tarefa vinculada a esta obra.")}
          </section>
        ) : null}

        {activeTab === "materials" ? (
          <section className="grid gap-6 xl:grid-cols-2">
            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 p-4">
                <h2 className="font-semibold">Pedidos de materiais</h2>
                <Link href="/purchases" className="text-sm font-semibold text-zinc-900 hover:underline">Ver compras</Link>
              </div>
              {project.materialRequests.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {project.materialRequests.map((purchase) => (
                    <div key={purchase.id} className="grid gap-2 p-4 text-sm md:grid-cols-[1fr_auto]">
                      <div>
                        <StatusBadge value={purchase.status} />
                        <p className="mt-2 font-semibold">{purchase.items} itens - {purchase.urgency}</p>
                        <p className="text-zinc-500">Solicitado por {purchase.requester} para {purchase.neededBy}</p>
                      </div>
                      <strong>{formatCurrency(purchase.estimatedTotal)}</strong>
                    </div>
                  ))}
                </div>
              ) : emptyState("Nenhum pedido de material vinculado a esta obra.")}
            </div>
            <div className="rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 p-4">
                <h2 className="font-semibold">Movimentacoes de estoque</h2>
              </div>
              {project.stockMovements.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {project.stockMovements.map((movement) => (
                    <div key={movement.id} className="grid gap-2 p-4 text-sm md:grid-cols-[1fr_auto]">
                      <div>
                        <p className="font-semibold">{movement.material}</p>
                        <p className="text-zinc-500">{movement.movementType} - {movement.createdAt} por {movement.createdBy}</p>
                      </div>
                      <strong>{movement.quantity} {movement.unit}</strong>
                    </div>
                  ))}
                </div>
              ) : emptyState("Nenhuma movimentacao de material registrada.")}
            </div>
          </section>
        ) : null}

        {activeTab === "team" ? (
          <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Equipe locada</h2>
              <Link href="/employee-allocations/new" className="text-sm font-semibold text-zinc-900 hover:underline">Nova locacao</Link>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-md border border-zinc-200 p-4">
                <p className="text-sm text-zinc-500">Gestor</p>
                <strong className="mt-2 block">{project.manager}</strong>
              </div>
              <div className="rounded-md border border-zinc-200 p-4">
                <p className="text-sm text-zinc-500">Tecnico responsavel</p>
                <strong className="mt-2 block">{project.technicalResponsible}</strong>
              </div>
              {project.employeeAllocations.map((allocation) => (
                <div key={allocation.id} className="rounded-md border border-zinc-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{allocation.employee}</p>
                      <p className="mt-1 text-xs text-zinc-500">{allocation.role} - {allocation.jobTitle}</p>
                    </div>
                    <StatusBadge value={allocation.status} />
                  </div>
                  <p className="mt-3 text-sm text-zinc-700">{allocation.serviceDescription}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 text-xs text-zinc-500">
                    <span>{allocation.startDate} ate {allocation.endDate}</span>
                    <Link href={`/employee-allocations/${allocation.id}/edit`} className="font-semibold text-zinc-900 hover:underline">
                      Editar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            {project.employeeAllocations.length === 0 ? emptyState("Nenhum funcionario locado diretamente para esta obra.") : null}
          </section>
        ) : null}

        {activeTab === "contractors" ? (
          <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Terceirizados da obra</h2>
            </div>
            {project.contractors.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {project.contractors.map((contractor) => (
                  <div key={contractor.id} className="grid gap-2 p-4 text-sm lg:grid-cols-[1fr_180px_140px]">
                    <div>
                      <p className="font-semibold">{contractor.contractor}</p>
                      <p className="text-zinc-500">{contractor.serviceDescription}</p>
                    </div>
                    <span>{contractor.startDate} ate {contractor.endDate}</span>
                    <strong>{formatCurrency(contractor.contractedValue)}</strong>
                  </div>
                ))}
              </div>
            ) : emptyState("Nenhum terceirizado vinculado a esta obra.")}
          </section>
        ) : null}

        {activeTab === "financial" ? (
          <div className="space-y-6">
            <section className="grid gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Orcamento detalhado</p>
                <strong className="mt-2 block text-xl">{formatCurrency(budgetTotal || project.budget)}</strong>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Medido aprovado/registrado</p>
                <strong className="mt-2 block text-xl">{formatCurrency(measuredTotal)}</strong>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Avanco fisico</p>
                <strong className="mt-2 block text-xl">{physicalProgress}%</strong>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
                <p className="text-sm text-zinc-500">Avanco financeiro</p>
                <strong className="mt-2 block text-xl">{budgetTotal > 0 ? Math.round((measuredTotal / budgetTotal) * 100) : 0}%</strong>
              </div>
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 p-4">
                <h2 className="font-semibold">Orcamento e cronograma fisico-financeiro</h2>
                <Link href={`/budget-items/new?projectId=${project.id}`} className="text-sm font-semibold text-zinc-900 hover:underline">Novo item</Link>
              </div>
              {project.budgetItems.length > 0 ? (
                <BudgetGantt items={project.budgetItems} />
              ) : emptyState("Nenhum item de orcamento cadastrado para esta obra.")}
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-200 p-4">
                <h2 className="font-semibold">Medicoes da obra</h2>
                <Link href="/measurements/new" className="text-sm font-semibold text-zinc-900 hover:underline">Nova medicao</Link>
              </div>
              {project.measurements.length > 0 ? (
                <div className="divide-y divide-zinc-100">
                  {project.measurements.map((measurement) => (
                    <div key={measurement.id} className="grid gap-2 p-4 text-sm xl:grid-cols-[120px_1fr_170px_180px_120px]">
                      <strong>{measurement.measuredAt}</strong>
                      <div>
                        <p>{measurement.budgetItem}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {measurement.quantityMeasured} {measurement.budgetUnit} medidos - saldo {measurement.remainingQuantity} {measurement.budgetUnit}
                        </p>
                      </div>
                      <strong>{formatCurrency(measurement.amountMeasured)}</strong>
                      <span className="truncate text-zinc-600">{measurement.executants}</span>
                      <StatusBadge value={measurement.status} />
                    </div>
                  ))}
                </div>
              ) : emptyState("Nenhuma medicao registrada para esta obra.")}
            </section>

            <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="border-b border-zinc-200 p-4">
                <h2 className="font-semibold">Lancamentos financeiros</h2>
              </div>
              {project.financialEntries.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left text-sm">
                    <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                      <tr>
                        <th className="px-4 py-3">Tipo</th>
                        <th className="px-4 py-3">Categoria</th>
                        <th className="px-4 py-3">Descricao</th>
                        <th className="px-4 py-3">Vencimento</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {project.financialEntries.map((entry) => (
                        <tr key={entry.id}>
                          <td className="px-4 py-4">{entry.entryType}</td>
                          <td className="px-4 py-4">{entry.category}</td>
                          <td className="px-4 py-4 font-medium">{entry.description}</td>
                          <td className="px-4 py-4">{entry.dueDate}</td>
                          <td className="px-4 py-4"><StatusBadge value={entry.status} /></td>
                          <td className="px-4 py-4 font-semibold">{formatCurrency(entry.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : emptyState("Nenhum lancamento financeiro cadastrado para esta obra.")}
            </section>
          </div>
        ) : null}

        {activeTab === "photos" ? (
          <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Fotos</h2>
            </div>
            {photos.length > 0 ? (
              <div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
                {photos.map((file) => (
                  <a key={file.id} href={file.fileUrl} className="rounded-md border border-zinc-200 p-4 text-sm hover:bg-zinc-50">
                    <p className="font-semibold">{file.fileName}</p>
                    <p className="mt-1 text-xs text-zinc-500">{file.createdAt} - {file.uploadedBy}</p>
                  </a>
                ))}
              </div>
            ) : emptyState("Nenhuma foto anexada a esta obra.")}
          </section>
        ) : null}

        {activeTab === "documents" ? (
          <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Documentos</h2>
            </div>
            {documents.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {documents.map((file) => (
                  <a key={file.id} href={file.fileUrl} className="grid gap-2 p-4 text-sm hover:bg-zinc-50 md:grid-cols-[1fr_160px_160px]">
                    <span className="font-semibold">{file.fileName}</span>
                    <span>{file.category}</span>
                    <span className="text-zinc-500">{file.createdAt}</span>
                  </a>
                ))}
              </div>
            ) : emptyState("Nenhum documento anexado a esta obra.")}
          </section>
        ) : null}

        {activeTab === "daily" ? (
          <section className="rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-200 p-4">
              <h2 className="font-semibold">Diario de obra</h2>
              <Link href="/daily-reports/new" className="text-sm font-semibold text-zinc-900 hover:underline">Novo diario</Link>
            </div>
            {project.dailyReports.length > 0 ? (
              <div className="divide-y divide-zinc-100">
                {project.dailyReports.map((report) => (
                  <div key={report.id} className="grid gap-2 p-4 text-sm lg:grid-cols-[120px_1fr_180px]">
                    <strong>{report.reportDate}</strong>
                    <div>
                      <p className="font-semibold">{report.servicesExecuted}</p>
                      <p className="text-zinc-500">{report.occurrences}</p>
                    </div>
                    <Link href={`/daily-reports/${report.id}/edit`} className="font-semibold text-zinc-900 hover:underline">
                      Editar registro
                    </Link>
                  </div>
                ))}
              </div>
            ) : emptyState("Nenhum diario cadastrado para esta obra.")}
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
