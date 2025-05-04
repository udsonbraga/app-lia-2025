
import { Header } from "@/components/Header";
import { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";

const Clothing = () => {
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const navigate = useNavigate();
  const { isDisguised, exitDisguiseMode } = useDisguiseMode();
  
  // Produtos de roupas
  const clothes = [
    {
      id: 1,
      name: "Vestido Longo",
      price: "R$ 189,90",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Blusa de Seda",
      price: "R$ 119,90",
      image: "https://images.unsplash.com/photo-1588737006914-67962f57a701?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Calça Pantalona",
      price: "R$ 149,90",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Saia Midi",
      price: "R$ 99,90",
      image: "https://images.unsplash.com/photo-1582142306909-195724d33ffc?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Conjunto Alfaiataria",
      price: "R$ 259,90",
      image: "https://images.unsplash.com/photo-1632149877166-f75d49000351?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Jaqueta Jeans",
      price: "R$ 179,90",
      image: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 7,
      name: "Macacão Feminino",
      price: "R$ 169,90",
      image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 8,
      name: "Cardigan de Tricô",
      price: "R$ 129,90",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&auto=format&fit=crop"
    }
  ];

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  if (!isDisguised) {
    navigate('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header isDisguised={isDisguised} toggleDisguise={exitDisguiseMode} />
      
      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="px-4 py-6">
          {/* Categorias */}
          <div className="flex overflow-x-auto gap-2 pb-3 mb-4">
            <button 
              className="whitespace-nowrap px-4 py-2 bg-white border border-pink-300 text-pink-500 rounded-full flex-shrink-0"
              onClick={() => navigate('/home')}
            >
              Destaques
            </button>
            <button 
              className="whitespace-nowrap px-4 py-2 bg-white border border-pink-300 text-pink-500 rounded-full flex-shrink-0"
              onClick={() => navigate('/acessories')}
            >
              Acessórios
            </button>
            <button 
              className="whitespace-nowrap px-4 py-2 bg-pink-500 text-white rounded-full flex-shrink-0"
            >
              Roupas
            </button>
          </div>
          
          {/* Banner promocional */}
          <div className="bg-pink-100 rounded-lg p-4 mb-6 text-center">
            <h2 className="text-lg font-semibold text-pink-800">Nova Coleção 2025</h2>
            <p className="text-pink-700">Novos modelos disponíveis!</p>
          </div>
          
          {/* Grid de produtos */}
          <div className="grid grid-cols-2 gap-4">
            {clothes.map((product) => (
              <div 
                key={product.id} 
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
              >
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full"
                    onClick={() => toggleLike(product.id)}
                  >
                    <Heart 
                      className={`${likedProducts.includes(product.id) ? 'fill-pink-500 text-pink-500' : 'text-gray-500'} w-5 h-5`}
                    />
                  </button>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 text-sm">{product.name}</h3>
                  <p className="text-pink-600 font-semibold mt-1">{product.price}</p>
                  <button className="w-full mt-2 text-xs bg-pink-500 hover:bg-pink-600 text-white py-1 px-2 rounded">
                    Adicionar ao Carrinho
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clothing;
