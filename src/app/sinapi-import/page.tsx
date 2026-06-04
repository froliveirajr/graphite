import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/ui/page-header";
import { importSinapiAction } from "@/lib/actions/sinapi-import";

const ufs = [
  "AC",
  "AL",
  "AM",
  "AP",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MG",
  "MS",
  "MT",
  "PA",
  "PB",
  "PE",
  "PI",
  "PR",
  "RJ",
  "RN",
  "RO",
  "RR",
  "RS",
  "SC",
  "SE",
  "SP",
  "TO",
];

export default async function SinapiImportPage({
  searchParams,
}: {
  searchParams: Promise<{
    imported?: string;
    error?: string;
    files?: string;
    rows?: string;
    compositions?: string;
    materials?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <AppShell>
      <PageHeader
        title="Importacao SINAPI"
        description="Importe ZIP, XLSX, XLS ou CSV do SINAPI para alimentar o banco de composicoes."
        action={<Link href="/service-compositions" className="inline-flex h-10 items-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700">Ver composicoes</Link>}
      />
      <div className="space-y-6 p-5 sm:p-8">
        {params.error ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            {params.error}
          </div>
        ) : null}
        {params.imported ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            Importacao concluida: {params.compositions ?? 0} composicoes, {params.materials ?? 0} materiais vinculados, {params.rows ?? 0} linhas compativeis em {params.files ?? 0} arquivo(s).
          </div>
        ) : null}

        <form action={importSinapiAction} className="max-w-4xl rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-zinc-800">
              Arquivo SINAPI
              <input
                name="file"
                type="file"
                required
                accept=".zip,.xlsx,.xls,.csv"
                className="mt-2 block w-full rounded-md border border-zinc-200 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-zinc-950 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              UF
              <select name="uf" defaultValue="SP" className="mt-2 h-11 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm">
                {ufs.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Limite de linhas
              <input name="limit" type="number" min="0" step="1" placeholder="0 para importar tudo" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
            <label className="text-sm font-medium text-zinc-800">
              Codigos especificos
              <input name="codes" placeholder="Ex: 87248, 88489" className="mt-2 h-11 w-full rounded-md border border-zinc-200 px-3 text-sm" />
            </label>
          </div>

          <div className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            As composicoes importadas entram como base SINAPI. Depois da importacao, voce pode editar quantidades dos materiais, perdas e valor unitario em Composicoes.
          </div>

          <div className="mt-6 flex justify-end">
            <button className="h-10 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white">Importar SINAPI</button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
