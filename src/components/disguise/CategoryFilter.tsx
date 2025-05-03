
import React from "react";

interface CategoryFilterProps {
  category: string;
  setCategory: (category: string) => void;
}

export function CategoryFilter({ category, setCategory }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto py-2 px-4">
      <button 
        onClick={() => setCategory("all")}
        className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
          category === "all" 
            ? "bg-pink-500 text-white" 
            : "bg-gray-100 text-gray-800"
        }`}
      >
        Todos
      </button>
      <button 
        onClick={() => setCategory("clothes")}
        className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
          category === "clothes" 
            ? "bg-pink-500 text-white" 
            : "bg-gray-100 text-gray-800"
        }`}
      >
        Roupas
      </button>
      <button 
        onClick={() => setCategory("shoes")}
        className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
          category === "shoes" 
            ? "bg-pink-500 text-white" 
            : "bg-gray-100 text-gray-800"
        }`}
      >
        Calçados
      </button>
      <button 
        onClick={() => setCategory("accessories")}
        className={`px-4 py-1 rounded-full text-sm whitespace-nowrap ${
          category === "accessories" 
            ? "bg-pink-500 text-white" 
            : "bg-gray-100 text-gray-800"
        }`}
      >
        Acessórios
      </button>
    </div>
  );
}
