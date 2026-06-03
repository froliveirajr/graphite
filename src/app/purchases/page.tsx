import { PackageCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";

export default function PurchasesPage() {
  return (
    <ModulePlaceholder
      title="Compras"
      description="Solicitacao, cotacao, aprovacao, compra, recebimento e entrada automatica no estoque da obra."
      icon={PackageCheck}
      items={["Solicitacoes por obra", "Fluxo de aprovacao", "Itens e fornecedores", "Recebimento de material", "Vinculo financeiro"]}
    />
  );
}
