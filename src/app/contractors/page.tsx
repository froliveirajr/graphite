import { BriefcaseBusiness } from "lucide-react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";

export default function ContractorsPage() {
  return (
    <ModulePlaceholder
      title="Terceirizados"
      description="Controle de empresas e profissionais externos, contratos, prazo, valor e avaliacao de entrega."
      icon={BriefcaseBusiness}
      items={["Cadastro externo", "Servicos por obra", "Contratos", "Prazos e pagamentos", "Avaliacao interna"]}
    />
  );
}
