import { FileText } from "lucide-react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";

export default function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Relatorios"
      description="Relatorios gerenciais por obra, cliente, fornecedor, periodo, materiais, fotos e financeiro."
      icon={FileText}
      items={["Relatorio geral da obra", "Financeiro", "Materiais", "Mao de obra", "Fotografico", "Diario em PDF"]}
    />
  );
}
