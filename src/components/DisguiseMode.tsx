
import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { Pagination } from "@/components/ui/pagination";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function DisguiseMode() {
  const navigate = useNavigate();
  const { exitDisguiseMode } = useDisguiseMode();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const itemsPerPage = 10;

  // Mock product data
  useEffect(() => {
    const mockProducts: Product[] = Array(30).fill(null).map((_, index) => ({
      id: index + 1,
      name: `Product ${index + 1}`,
      price: Math.floor(Math.random() * 150) + 50,
      image: `https://picsum.photos/seed/${index + 1}/300/300`,
      category: ["clothes", "shoes", "accessories"][Math.floor(Math.random() * 3)]
    }));
    
    setProducts(mockProducts);
  }, []);

  const filteredProducts = category === "all" 
    ? products 
    : products.filter(product => product.category === category);

  // Get current products
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExitDisguise = () => {
    exitDisguiseMode();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={handleExitDisguise}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            
            <h1 className="text-xl font-semibold">Moda Feminina</h1>
            
            <div className="w-10" />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto pt-20 pb-4">
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
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {currentProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-800 truncate">{product.name}</h3>
                <p className="text-pink-600 font-semibold mt-1">
                  R$ {product.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4">
          <div className="flex justify-center">
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`h-8 w-8 flex items-center justify-center rounded-full ${
                    currentPage === i + 1
                      ? "bg-pink-500 text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
