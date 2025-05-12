
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DisguisedModeProps {
  exitDisguiseMode: () => void;
}

export function DisguisedMode({ exitDisguiseMode }: DisguisedModeProps) {
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const navigate = useNavigate();
  
  // Produtos da loja fictícia - limitados a 8
  const products = [
    {
      id: 1,
      name: "Vestido Floral",
      price: "R$ 159,90",
      image: "https://images.unsplash.com/photo-1612722432474-b971cdcea546?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 2,
      name: "Blusa Elegante",
      price: "R$ 89,90",
      image: "https://images.unsplash.com/photo-1551048632-24e444b48a3e?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 3,
      name: "Calça Jeans",
      price: "R$ 129,90",
      image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 4,
      name: "Sandália Elegante",
      price: "R$ 99,90",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 5,
      name: "Bolsa Casual",
      price: "R$ 189,90",
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 6,
      name: "Colar Feminino",
      price: "R$ 59,90",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 7,
      name: "Brinco Dourado",
      price: "R$ 49,90",
      image: "https://images.unsplash.com/photo-1599459183200-28c912c18e1f?w=400&h=400&auto=format&fit=crop"
    },
    {
      id: 8,
      name: "Cinto Fino",
      price: "R$ 79,90",
      image: "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=400&h=400&auto=format&fit=crop"
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

  const handleBuy = (productId: number) => {
    console.log(`Produto ${productId} adicionado ao carrinho`);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6">
        {/* Banner promocional */}
        <div className="bg-pink-100 rounded-lg p-4 mb-6 text-center">
          <h2 className="text-lg font-semibold text-pink-800">Promoção de Verão</h2>
          <p className="text-pink-700">Até 50% de desconto em itens selecionados!</p>
        </div>
        
        {/* Categorias */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-4">
          <button 
            className="whitespace-nowrap px-4 py-2 bg-pink-500 text-white rounded-full flex-shrink-0"
            onClick={() => navigate('/home')}
          >
            Destaques
          </button>
          <button 
            className="whitespace-nowrap px-4 py-2 bg-white border border-pink-300 text-pink-500 rounded-full flex-shrink-0"
            onClick={() => navigate('/accessories')}
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
        
        {/* Grid de produtos */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
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
                <div className="flex flex-col space-y-2 mt-2">
                  <button 
                    className="w-full text-xs bg-pink-500 hover:bg-pink-600 text-white py-1 px-2 rounded"
                    onClick={() => handleBuy(product.id)}
                  >
                    Adicionar ao Carrinho
                  </button>
                  <button 
                    className="w-full text-xs bg-pink-700 hover:bg-pink-800 text-white py-1 px-2 rounded flex items-center justify-center"
                    onClick={() => handleBuy(product.id)}
                  >
                    <ShoppingCart className="w-3 h-3 mr-1" /> Comprar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
