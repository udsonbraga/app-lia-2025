
import { useState } from "react";
import { Users, BookOpen, Phone, Shield } from "lucide-react";
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
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
          {/* App Title */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Safe Lady
            </h1>
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              Proteção imediata ao alcance de um toque. Você não está sozinha.
            </p>
          </div>

          {/* Main Emergency Button */}
          <button
            onClick={handleEmergencyContact}
            disabled={isLoading}
            className={`
              relative group flex items-center justify-center gap-3
              w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto
              bg-white shadow-lg hover:shadow-xl
              transition-all duration-300 ease-in-out
              ${isLoading ? "animate-button-press" : ""}
            `}
          >
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            <div className="flex flex-col items-center gap-2">
              <Shield size={40} className="text-red-500" />
              <span className="text-base font-semibold text-gray-800">
                {isLoading ? "Enviando..." : "Botão de Emergência"}
              </span>
            </div>
          </button>

          {/* Feature Buttons */}
          <div className="flex flex-col gap-3 max-w-xs mx-auto px-4">
            <button
              onClick={() => navigate("/support-network")}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
            >
              <Users className="h-5 w-5 text-red-500" />
              <span className="font-medium text-gray-800">Rede de Apoio</span>
            </button>

            <button
              onClick={() => navigate("/diary")}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
            >
              <BookOpen className="h-5 w-5 text-red-500" />
              <span className="font-medium text-gray-800">Diário Seguro</span>
            </button>

            <button
              onClick={() => navigate("/safe-contact")}
              className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
            >
              <Phone className="h-5 w-5 text-red-500" />
              <span className="font-medium text-gray-800">Contato Seguro</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
