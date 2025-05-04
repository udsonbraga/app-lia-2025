
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DisguisedModeProps {
  exitDisguiseMode: () => void;
}

export function DisguisedMode({ exitDisguiseMode }: DisguisedModeProps) {
  // Produtos da loja fictícia
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
    }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6">
        {/* Banner promocional */}
        <div className="bg-pink-100 rounded-lg p-4 mb-6 text-center">
          <h2 className="text-lg font-semibold text-pink-800">Promoção de Verão</h2>
          <p className="text-pink-700">Até 50% de desconto em itens selecionados!</p>
        </div>
        
        {/* Grid de produtos */}
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
            >
              <div className="h-40 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
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

      {/* Botão escondido na parte inferior para sair do modo disfarce */}
      <div className="fixed bottom-4 right-4 opacity-30 hover:opacity-100 transition-opacity">
        <Button
          onClick={exitDisguiseMode}
          variant="outline"
          size="sm"
          className="bg-white shadow-md"
        >
          Sair
        </Button>
      </div>
    </div>
  );
}
