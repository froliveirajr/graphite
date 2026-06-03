import { Settings } from "lucide-react";
import { ModulePlaceholder } from "@/components/ui/module-placeholder";

export default function SettingsPage() {
  return (
    <ModulePlaceholder
      title="Configuracoes"
      description="Usuarios, perfis, permissoes, parametros de aprovacao, auditoria e preferencias do sistema."
      icon={Settings}
      items={["Usuarios", "Perfis de acesso", "Limites de aprovacao", "Logs de auditoria", "Parametros gerais"]}
    />
  );
}
