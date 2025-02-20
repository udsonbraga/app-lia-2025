import { useState } from "react";
import { MessageCircle, Shield, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Pedido de ajuda enviado",
      description: "As autoridades e seus contatos de confiança foram notificados.",
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Maria da Penha
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Proteção imediata ao alcance de um toque. Você não está sozinha.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-red-500 hover:bg-red-600 transition-colors"
            >
              Criar Conta
            </button>
          </div>

          {/* Main Action Button */}
          <button
            onClick={handleEmergencyContact}
            disabled={isLoading}
            className={`
              relative group flex items-center justify-center gap-3
              w-64 h-64 rounded-full
              bg-white shadow-lg hover:shadow-xl
              transition-all duration-300 ease-in-out
              ${isLoading ? "animate-button-press" : ""}
            `}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <div className="flex flex-col items-center gap-2">
              <Bell size={48} className="text-red-500" />
              <span className="text-lg font-semibold text-gray-800">
                {isLoading ? "Enviando..." : "Botão do Pânico"}
              </span>
            </div>
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Shield className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Proteção Imediata</h3>
              <p className="text-gray-600">
                Acione autoridades e contatos de confiança com um toque.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Bell className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Resposta Rápida</h3>
              <p className="text-gray-600">
                Sistema integrado com órgãos de proteção à mulher.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <MessageCircle className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Rede de Apoio</h3>
              <p className="text-gray-600">
                Conexão direta com sua rede de contatos de confiança.
              </p>
            </div>
          </div>

          {/* Informational Section */}
          <div className="mt-12 p-6 bg-white rounded-xl shadow-lg text-left">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Lembre-se:</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                • Em caso de emergência, ligue também para 190 (Polícia)
              </li>
              <li className="flex items-center gap-2">
                • Disque 180 para denúncias e orientações
              </li>
              <li className="flex items-center gap-2">
                • Procure a Delegacia da Mulher mais próxima
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
