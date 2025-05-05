
import { Header } from "@/components/Header";
import { useState, useEffect } from "react";
import { Heart, Glasses } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";

const Accessories = () => {
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const navigate = useNavigate();
  const { isDisguised, exitDisguiseMode } = useDisguiseMode();
  
  // Produtos de acessórios
  const accessories = [
    {
      id: 1,
      name: "Colar de Pérolasssss",
      price: "R$ 79,90",
      image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Brincos Dourados",
      price: "R$ 49,90",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Pulseira de Prata",
      price: "R$ 89,90",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Anel com Pedra",
      price: "R$ 69,90",
      image: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Tiara Elegante",
      price: "R$ 39,90",
      image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Lenço Estampado",
      price: "R$ 59,90",
      image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 7,
      name: "Óculos de Sol",
      price: "R$ 129,90",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 8,
      name: "Chapéu de Praia",
      price: "R$ 79,90",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&auto=format&fit=crop"
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

  // Verificar o modo de disfarce no useEffect para evitar avisos de navegação
  useEffect(() => {
    if (!isDisguised) {
      navigate('/home');
    }
  }, [isDisguised, navigate]);

  // Se não estiver no modo disfarce, não renderiza nada até que o useEffect redirecione
  if (!isDisguised) {
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
              className="whitespace-nowrap px-4 py-2 bg-pink-500 text-white rounded-full flex-shrink-0"
            >
              Acessórios
            </button>
            <button 
              className="whitespace-nowrap px-4 py-2 bg-white border border-pink-300 text-pink-500 rounded-full flex-shrink-0"
              onClick={() => navigate('/clothing')}
            >
              Roupas
            </button>
          </div>
          
          {/* Banner promocional */}
          <div className="bg-pink-100 rounded-lg p-4 mb-6 text-center">
            <h2 className="text-lg font-semibold text-pink-800">Acessórios em Promoção</h2>
            <p className="text-pink-700">Compre 3 e leve 4!</p>
          </div>
          
          {/* Grid de produtos */}
          <div className="grid grid-cols-2 gap-4">
            {accessories.map((product) => (
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

export default Accessories;
