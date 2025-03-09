
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { handleEmergencyAlert } from '@/utils/emergencyUtils';

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    
    try {
      // Usar a função utilitária de emergência que agora usa o chat ID correto
      await handleEmergencyAlert({ toast });
      
      toast({
        title: "Pedido de ajuda enviado",
        description: "Mensagem de emergência enviada via Telegram.",
      });
    } catch (error) {
      console.error("Erro ao enviar alerta de emergência:", error);
      toast({
        title: "Erro ao enviar alerta",
        description: "Não foi possível enviar o alerta de emergência. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleEmergencyContact}
      disabled={isLoading}
      className={`
        relative group flex items-center justify-center gap-3
        w-48 h-48 sm:w-56 sm:h-56 rounded-full mx-auto
        bg-white shadow-lg hover:shadow-xl active:scale-95
        transition-all duration-300 ease-in-out mb-8
        hover:bg-[#FF84C6]
        ${isLoading ? "animate-pulse bg-[#FF84C6]" : ""}
      `}
    >
      <div className="absolute inset-0 bg-[#FF84C6] rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="flex flex-col items-center gap-2">
        <Shield size={50} className={`text-[#FF84C6] ${isLoading ? "animate-pulse" : ""}`} />
        <span className="text-base font-semibold text-gray-800">
          {isLoading ? "Enviando..." : "Emergência"}
        </span>
      </div>
    </button>
  );
}
