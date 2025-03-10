
import React from "react";
import { Check } from "lucide-react";

export const SuccessMessage = () => {
  return (
    <div className="text-center space-y-4">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-6 h-6 text-green-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900">Senha alterada com sucesso!</h3>
      <p className="text-sm text-gray-500">
        Você será redirecionado para a tela de login em instantes...
      </p>
    </div>
  );
};
