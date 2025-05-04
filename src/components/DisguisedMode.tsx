
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Tag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FinancialNote } from "@/types/financial";

interface DisguisedModeProps {
  notes: FinancialNote[];
  noteToEdit: FinancialNote | null;
  handleSaveNote: (note: FinancialNote) => void;
  toggleNotePaid: (noteId: string) => void;
  handleEditNote: (note: FinancialNote) => void;
  handleDeleteNote: (noteId: string) => void;
  setNoteToEdit: (note: FinancialNote | null) => void;
}

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

export function DisguisedMode({
  notes,
  noteToEdit,
  handleSaveNote,
  toggleNotePaid,
  handleEditNote,
  handleDeleteNote,
  setNoteToEdit
}: DisguisedModeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  useEffect(() => {
    // Produtos para o modo disfarce
    const fakeProducts = [
      {
        id: 1,
        name: "Vestido Floral",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=500",
        category: "roupa"
      },
      {
        id: 2,
        name: "Tênis Casual",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=500",
        category: "calçado"
      },
      {
        id: 3,
        name: "Bolsa de Couro",
        price: 249.90,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500",
        category: "acessório"
      },
      {
        id: 4,
        name: "Camisa Social",
        price: 99.90,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=500",
        category: "roupa"
      },
      {
        id: 5,
        name: "Sandália de Salto",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=500",
        category: "calçado"
      },
      {
        id: 6,
        name: "Colar de Prata",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500",
        category: "acessório"
      },
      {
        id: 7,
        name: "Calça Jeans",
        price: 149.90,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500",
        category: "roupa"
      },
      {
        id: 8,
        name: "Sapato Social",
        price: 219.90,
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=500",
        category: "calçado"
      }
    ];
    
    setProducts(fakeProducts);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  const categories = [
    { id: "roupa", name: "Roupas" },
    { id: "calçado", name: "Calçados" },
    { id: "acessório", name: "Acessórios" }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Banner da loja */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Moda Elegante</h1>
        <p className="text-gray-600">As melhores roupas, calçados e acessórios para você</p>
      </div>
      
      {/* Barra de busca e filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            type="search" 
            placeholder="Buscar produtos..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className="flex-shrink-0"
            >
              <Tag size={16} className="mr-2" />
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Grade de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
              <p className="text-violet-600 font-bold">R$ {product.price.toFixed(2)}</p>
              <div className="flex justify-between items-center mt-4">
                <Button variant="default" size="sm" className="flex items-center">
                  <ShoppingBag size={16} className="mr-2" />
                  Adicionar
                </Button>
                <button className="text-gray-400 hover:text-red-500">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Quando não há produtos */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado.</p>
        </div>
      )}
    </div>
  );
}
