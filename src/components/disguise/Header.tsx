
import React from "react";
import { ArrowLeft, Plus } from "lucide-react";

interface HeaderProps {
  onExitDisguise: () => void;
  onAddProduct: () => void;
}

export function Header({ onExitDisguise, onAddProduct }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={onExitDisguise}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          
          <h1 className="text-xl font-semibold">Moda Feminina</h1>
          
          <button
            onClick={onAddProduct}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Adicionar produto"
          >
            <Plus className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
