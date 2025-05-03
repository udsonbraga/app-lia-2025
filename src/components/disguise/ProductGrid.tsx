
import React from "react";
import { Product } from "@/lib/supabase";
import { Pencil, Trash2 } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  openEditModal: (product: Product) => void;
  openDeleteModal: (product: Product) => void;
}

export function ProductGrid({ products, openEditModal, openDeleteModal }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow relative group">
          <div className="absolute top-2 right-2 flex gap-1 z-10">
            <button 
              onClick={() => openEditModal(product)} 
              className="bg-white p-1 rounded-full shadow"
              aria-label="Editar produto"
            >
              <Pencil className="h-4 w-4 text-gray-600" />
            </button>
            <button 
              onClick={() => openDeleteModal(product)} 
              className="bg-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Excluir produto"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
          </div>
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/300x300?text=Image+Error';
              }}
            />
          </div>
          <div className="p-3">
            <h3 className="text-sm font-medium text-gray-800 truncate">{product.name}</h3>
            <p className="text-pink-600 font-semibold mt-1">
              R$ {product.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {product.category === "clothes" ? "Roupas" : 
               product.category === "shoes" ? "Calçados" : "Acessórios"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
