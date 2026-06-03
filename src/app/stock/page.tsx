import { Archive } from "lucide-react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";

export default function StockPage() {
  return (
    <ModulePlaceholder
      title="Estoque por obra"
      description="Entradas, saidas, consumo, perdas, sobras e transferencias entre obras."
      icon={Archive}
      items={["Saldo por obra", "Movimentacoes", "Baixa por consumo", "Transferencia", "Alertas de estoque baixo"]}
    />
  );
}
