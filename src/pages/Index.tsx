
import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Mensagem enviada com sucesso",
      description: "Um contato de emergência foi notificado e responderá em breve.",
    });
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        {/* Hero Section */}
        <div className="w-full max-w-2xl text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Assistência Imediata
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              Com apenas um toque, conecte-se instantaneamente com um contato de emergência seguro.
            </p>
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
              <MessageCircle size={48} className="text-red-500" />
              <span className="text-lg font-semibold text-gray-800">
                {isLoading ? "Enviando..." : "Pedir Ajuda"}
              </span>
            </div>
          </button>

          {/* Supporting Image */}
          <div className="mt-12 relative rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
              alt="Tecnologia de suporte"
              className="w-full h-64 object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Send className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Resposta Instantânea</h3>
              <p className="text-gray-600">
                Envio imediato de mensagem para seu contato de emergência.
              </p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <MessageCircle className="h-8 w-8 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Contato Seguro</h3>
              <p className="text-gray-600">
                Comunicação protegida e confidencial com contatos verificados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
