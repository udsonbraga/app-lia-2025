
import { Shield } from "lucide-react";

export function RegisterFormHeader() {
  return (
    <div className="text-center mb-8">
      <Shield className="h-12 w-12 text-[#8B5CF6] mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
      <p className="text-gray-600 mt-2">
        Proteja-se e junte-se à nossa rede de apoio
      </p>
    </div>
  );
}
