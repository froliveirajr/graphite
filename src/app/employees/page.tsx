import { ShieldCheck } from "lucide-react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";

export default function EmployeesPage() {
  return (
    <ModulePlaceholder
      title="Funcionarios"
      description="Cadastro de equipe interna, alocacao em obras, presenca, horas e custo de mao de obra."
      icon={ShieldCheck}
      items={["Cadastro da equipe", "Alocacao em obras", "Presenca diaria", "Horas trabalhadas", "Custo por obra"]}
    />
  );
}
