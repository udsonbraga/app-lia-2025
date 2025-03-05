
import React from "react";

interface GoogleAccount {
  email: string;
  name: string;
  avatar: string;
}

interface GoogleAccountSelectorProps {
  onCancel: () => void;
  onSelect: (email: string) => void;
}

export const GoogleAccountSelector = ({ onCancel, onSelect }: GoogleAccountSelectorProps) => {
  const accounts: GoogleAccount[] = [
    { email: "usuario1@gmail.com", name: "Usuário 1", avatar: "U1" },
    { email: "maria.silva@gmail.com", name: "Maria Silva", avatar: "MS" },
    { email: "usuario@teste.com", name: "Usuária Teste", avatar: "UT" }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-3">
          <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Escolha uma conta</h2>
        <p className="text-sm text-gray-500 mt-1">para continuar com o Safe Lady</p>
      </div>

      <div className="space-y-3 mb-6">
        {accounts.map((account) => (
          <button
            key={account.email}
            onClick={() => onSelect(account.email)}
            className="w-full flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors border border-gray-100"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-700 font-medium">
              {account.avatar}
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">{account.name}</p>
              <p className="text-sm text-gray-500">{account.email}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onCancel}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Usar outra conta
        </button>
      </div>
    </div>
  );
};
