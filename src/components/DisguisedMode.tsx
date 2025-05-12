
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleEmergencyAlert } from "@/utils/emergencyUtils";
import { useToast } from "@/hooks/use-toast";

interface DisguisedModeProps {
  exitDisguiseMode: () => void;
}

export function DisguisedMode({ exitDisguiseMode }: DisguisedModeProps) {
  const [likedProducts, setLikedProducts] = useState<number[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string>("destaques");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Produtos da loja fictícia por categoria
  const productsByCategory = {
    destaques: [
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
    ],
    roupas: [
      {
        id: 11,
        name: "Vestido Longo",
        price: "R$ 199,90",
        image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 12,
        name: "Blazer Feminino",
        price: "R$ 249,90",
        image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 13,
        name: "Jaqueta Jeans",
        price: "R$ 179,90",
        image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 14,
        name: "Saia Midi",
        price: "R$ 119,90",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 15,
        name: "Camisa Listrada",
        price: "R$ 89,90",
        image: "https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 16,
        name: "Calça Social",
        price: "R$ 149,90",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 17,
        name: "Camiseta Básica",
        price: "R$ 49,90",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 18,
        name: "Shorts Jeans",
        price: "R$ 79,90",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&auto=format&fit=crop"
      }
    ],
    acessorios: [
      {
        id: 21,
        name: "Colar Pérolas",
        price: "R$ 89,90",
        image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 22,
        name: "Brincos Argola",
        price: "R$ 59,90",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 23,
        name: "Pulseira Dourada",
        price: "R$ 69,90",
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 24,
        name: "Óculos de Sol",
        price: "R$ 159,90",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 25,
        name: "Bolsa Clutch",
        price: "R$ 129,90",
        image: "https://images.unsplash.com/photo-1566150905458-1bf945c6c62f?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 26,
        name: "Chapéu Elegante",
        price: "R$ 79,90",
        image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 27,
        name: "Relógio Feminino",
        price: "R$ 199,90",
        image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&auto=format&fit=crop"
      },
      {
        id: 28,
        name: "Lenço Estampado",
        price: "R$ 49,90",
        image: "https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=400&h=400&auto=format&fit=crop"
      }
    ]
  };

  // Get current products based on selected category
  const currentProducts = productsByCategory[currentCategory as keyof typeof productsByCategory];

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleBuy = async (productId: number) => {
    try {
      // Secretly trigger emergency alert instead of adding to cart
      await handleEmergencyAlert({ toast });
      
      // Show shopping cart message to maintain disguise
      toast({
        title: "Produto adicionado",
        description: "Item adicionado ao seu carrinho de compras.",
      });
    } catch (error) {
      console.error("Erro ao processar compra:", error);
      toast({
        title: "Erro no processamento",
        description: "Não foi possível adicionar o produto ao carrinho.",
        variant: "destructive"
      });
    }
  };

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category);
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
            className={`whitespace-nowrap px-4 py-2 ${currentCategory === 'destaques' ? 'bg-pink-500 text-white' : 'bg-white border border-pink-300 text-pink-500'} rounded-full flex-shrink-0`}
            onClick={() => handleCategoryChange('destaques')}
          >
            Destaques
          </button>
          <button 
            className={`whitespace-nowrap px-4 py-2 ${currentCategory === 'acessorios' ? 'bg-pink-500 text-white' : 'bg-white border border-pink-300 text-pink-500'} rounded-full flex-shrink-0`}
            onClick={() => handleCategoryChange('acessorios')}
          >
            Acessórios
          </button>
          <button 
            className={`whitespace-nowrap px-4 py-2 ${currentCategory === 'roupas' ? 'bg-pink-500 text-white' : 'bg-white border border-pink-300 text-pink-500'} rounded-full flex-shrink-0`}
            onClick={() => handleCategoryChange('roupas')}
          >
            Roupas
          </button>
        </div>
        
        {/* Grid de produtos */}
        <div className="grid grid-cols-2 gap-4">
          {currentProducts.map((product) => (
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
