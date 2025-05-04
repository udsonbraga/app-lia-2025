
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Tag, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FinancialNote } from "@/types/financial";
import { useNavigate } from "react-router-dom";

interface DisguisedModeProps {
  notes: FinancialNote[];
  noteToEdit: FinancialNote | null;
  handleSaveNote: (note: FinancialNote) => void;
  toggleNotePaid: (noteId: string) => void;
  handleEditNote: (note: FinancialNote) => void;
  handleDeleteNote: (noteId: string) => void;
  setNoteToEdit: (note: FinancialNote | null) => void;
  exitDisguiseMode: () => void;
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
  setNoteToEdit,
  exitDisguiseMode
}: DisguisedModeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Produtos para o modo disfarce
    const fakeProducts = [
      // Roupas (15 itens)
      {
        id: 1,
        name: "Vestido Floral",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?q=80&w=500",
        category: "roupa"
      },
      {
        id: 2,
        name: "Camisa Social",
        price: 99.90,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?q=80&w=500",
        category: "roupa"
      },
      {
        id: 3,
        name: "Calça Jeans",
        price: 149.90,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=500",
        category: "roupa"
      },
      {
        id: 4,
        name: "Blusa Listrada",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=500",
        category: "roupa"
      },
      {
        id: 5,
        name: "Jaqueta de Couro",
        price: 259.90,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=500",
        category: "roupa"
      },
      {
        id: 6,
        name: "Saia Midi Plissada",
        price: 119.90,
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=500",
        category: "roupa"
      },
      {
        id: 7,
        name: "Blazer Feminino",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1608234807905-4466023792f5?q=80&w=500",
        category: "roupa"
      },
      {
        id: 8,
        name: "Conjunto Esportivo",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500",
        category: "roupa"
      },
      {
        id: 9,
        name: "Vestido de Festa",
        price: 299.90,
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=500",
        category: "roupa"
      },
      {
        id: 10,
        name: "Macacão Jeans",
        price: 199.90,
        image: "https://images.unsplash.com/photo-1623609163859-ca93c959b98a?q=80&w=500",
        category: "roupa"
      },
      {
        id: 11,
        name: "Cardigan de Tricô",
        price: 139.90,
        image: "https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=500",
        category: "roupa"
      },
      {
        id: 12,
        name: "Blusa de Seda",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?q=80&w=500",
        category: "roupa"
      },
      {
        id: 13,
        name: "Calça Pantalona",
        price: 179.90,
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=500",
        category: "roupa"
      },
      {
        id: 14,
        name: "Shorts Jeans",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=500",
        category: "roupa"
      },
      {
        id: 15,
        name: "Kimono Estampado",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=500",
        category: "roupa"
      },
      
      // Calçados (15 itens)
      {
        id: 16,
        name: "Tênis Casual",
        price: 189.90,
        image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=500",
        category: "calçado"
      },
      {
        id: 17,
        name: "Sandália de Salto",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=500",
        category: "calçado"
      },
      {
        id: 18,
        name: "Sapato Social",
        price: 219.90,
        image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=500",
        category: "calçado"
      },
      {
        id: 19,
        name: "Bota de Couro",
        price: 289.90,
        image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=500",
        category: "calçado"
      },
      {
        id: 20,
        name: "Sapatilha Clássica",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1553545985-1e0d8781d5db?q=80&w=500",
        category: "calçado"
      },
      {
        id: 21,
        name: "Tênis Esportivo",
        price: 249.90,
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=500",
        category: "calçado"
      },
      {
        id: 22,
        name: "Sandália Rasteira",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?q=80&w=500",
        category: "calçado"
      },
      {
        id: 23,
        name: "Scarpin Elegante",
        price: 169.90,
        image: "https://images.unsplash.com/photo-1573100925118-870b8efc799d?q=80&w=500",
        category: "calçado"
      },
      {
        id: 24,
        name: "Ankle Boot",
        price: 239.90,
        image: "https://images.unsplash.com/photo-1543994571-65e9cf0a6f63?q=80&w=500",
        category: "calçado"
      },
      {
        id: 25,
        name: "Tênis Slip On",
        price: 119.90,
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=500",
        category: "calçado"
      },
      {
        id: 26,
        name: "Mocassim de Couro",
        price: 179.90,
        image: "https://images.unsplash.com/photo-1626947346165-4c2288dadc2d?q=80&w=500",
        category: "calçado"
      },
      {
        id: 27,
        name: "Sandália Plataforma",
        price: 149.90,
        image: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?q=80&w=500",
        category: "calçado"
      },
      {
        id: 28,
        name: "Chinelo de Couro",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1603487742131-4160ec999306?q=80&w=500",
        category: "calçado"
      },
      {
        id: 29,
        name: "Oxford Feminino",
        price: 199.90,
        image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=500",
        category: "calçado"
      },
      {
        id: 30,
        name: "Sandália Anabela",
        price: 139.90,
        image: "https://images.unsplash.com/photo-1596703263926-eb0762ee17e4?q=80&w=500",
        category: "calçado"
      },
      
      // Acessórios - Colares (16 itens)
      {
        id: 31,
        name: "Colar de Prata",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=500",
        category: "acessório"
      },
      {
        id: 32,
        name: "Colar de Pérolas",
        price: 119.90,
        image: "https://images.unsplash.com/photo-1602751584581-91565acc5a51?q=80&w=500",
        category: "acessório"
      },
      {
        id: 33,
        name: "Gargantilha Delicada",
        price: 69.90,
        image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=500",
        category: "acessório"
      },
      {
        id: 34,
        name: "Colar Longo Boho",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1611234877954-e1aca5300dbd?q=80&w=500",
        category: "acessório"
      },
      {
        id: 35,
        name: "Choker Gótico",
        price: 59.90,
        image: "https://images.unsplash.com/photo-1574723205475-f785c1f1c50f?q=80&w=500",
        category: "acessório"
      },
      {
        id: 36,
        name: "Colar com Pingente",
        price: 99.90,
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=500",
        category: "acessório"
      },
      {
        id: 37,
        name: "Corrente Masculina",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1600721391689-2564bb8055de?q=80&w=500",
        category: "acessório"
      },
      {
        id: 38,
        name: "Colar Étnico",
        price: 149.90,
        image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=500",
        category: "acessório"
      },
      {
        id: 39,
        name: "Colar Minimalista Ouro",
        price: 159.90,
        image: "https://images.unsplash.com/photo-1618403088890-3d9ff6f4c8b1?q=80&w=500",
        category: "acessório"
      },
      {
        id: 40,
        name: "Colar Camafeu Vintage",
        price: 129.90,
        image: "https://images.unsplash.com/photo-1644172302522-d2ea805fe899?q=80&w=500",
        category: "acessório"
      },
      {
        id: 41,
        name: "Colar Mandala",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1535556116002-6281ff3e9f36?q=80&w=500",
        category: "acessório"
      },
      {
        id: 42,
        name: "Colar com Pedra Natural",
        price: 199.90,
        image: "https://images.unsplash.com/photo-1547127796-06bb04e4b315?q=80&w=500",
        category: "acessório"
      },
      {
        id: 43,
        name: "Colar Cascata",
        price: 169.90,
        image: "https://images.unsplash.com/photo-1599459183200-59c7687a0a6e?q=80&w=500",
        category: "acessório"
      },
      {
        id: 44,
        name: "Colar Família",
        price: 89.90,
        image: "https://images.unsplash.com/photo-1563949193126-eca0142f1319?q=80&w=500",
        category: "acessório"
      },
      {
        id: 45,
        name: "Colar Relicário",
        price: 109.90,
        image: "https://images.unsplash.com/photo-1587308550198-02d410e0bdb0?q=80&w=500",
        category: "acessório"
      },
      {
        id: 46,
        name: "Colar de Coração",
        price: 79.90,
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=500",
        category: "acessório"
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
      {/* Exit button */}
      <div className="absolute top-4 left-4 z-10">
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full p-2 hover:bg-gray-100"
          onClick={exitDisguiseMode}
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Sair do modo disfarce</span>
        </Button>
      </div>
      
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
        <div className="flex gap-2 flex-wrap">
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
