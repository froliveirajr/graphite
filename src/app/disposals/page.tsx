import { Truck } from "lucide-react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";

export default function DisposalsPage() {
  return (
    <ModulePlaceholder
      title="Descarte"
      description="Solicitacao, aprovacao, agendamento, comprovantes, fotos e custo por obra."
      icon={Truck}
      items={["Tipos de residuo", "Agendamentos", "Comprovantes", "Fotos de retirada", "Custo de descarte"]}
    />
  );
}
