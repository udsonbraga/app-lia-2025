import { ArrowLeft } from "lucide-react";

interface DisguisedModeProps {
  exitDisguiseMode: () => void;
}

export function DisguisedMode({ exitDisguiseMode }: DisguisedModeProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Bem-vinda à Moda Elegante
        </h1>
        <p className="text-gray-600 mb-8">
          Este aplicativo parece ser uma loja de roupas.
        </p>
        <button
          onClick={exitDisguiseMode}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Sair do Modo Disfarce
        </button>
      </div>
    </div>
  );
}
