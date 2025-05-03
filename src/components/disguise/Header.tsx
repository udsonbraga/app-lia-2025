
import React from "react";
import { ArrowLeft, Plus } from "lucide-react";

interface HeaderProps {
  onExitDisguise: () => void;
  onAddProduct: () => void;
}

export function Header({ onExitDisguise, onAddProduct }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50">
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={onExitDisguise}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-1"
            aria-label="Voltar para o modo normal"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">Voltar</span>
          </button>
          
          <h1 className="text-xl font-semibold text-pink-600">Moda Feminina</h1>
          
          <button
            onClick={onAddProduct}
            className="p-2 bg-pink-50 hover:bg-pink-100 rounded-full transition-colors flex items-center gap-1"
            aria-label="Adicionar produto"
          >
            <Plus className="h-5 w-5 text-pink-600" />
            <span className="text-sm font-medium text-pink-600 hidden sm:inline">Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
