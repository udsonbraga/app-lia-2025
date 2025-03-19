
import { Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { handleEmergencyAlert } from "@/utils/emergencyUtils";

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    
    try {
      // Usar o sistema de alerta de emergência que utiliza os dados salvos pelo usuário
      await handleEmergencyAlert({ toast });
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden group flex items-center justify-center gap-3
        w-full h-20 rounded-full mx-auto
        bg-gradient-to-r from-rose-500 to-red-500
        shadow-lg hover:shadow-xl active:scale-95
        transition-all duration-300 ease-in-out mb-8
        ${isLoading ? "animate-pulse" : ""}
      `}
    >
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex items-center justify-between w-full px-6">
        <div className="flex items-center gap-4">
          {/* Shield icon with animated pulse effect */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm">
            <Shield size={30} className={`text-white ${isLoading ? "animate-pulse" : ""}`} />
          </div>
          
          <div className="text-left">
            <span className="text-xl font-bold text-white">
              {isLoading ? "Enviando..." : "Emergência"}
            </span>
            <p className="text-white/80 text-sm hidden md:block">
              Acionar contatos de emergência
            </p>
          </div>
        </div>
        
        {/* Alert icon on right side - appears on hover */}
        <div className={`flex items-center justify-center w-10 h-10 rounded-full 
          ${isHovered ? "bg-white/20 backdrop-blur-sm" : "bg-transparent"}
          transition-all duration-300`}>
          <AlertTriangle className={`h-5 w-5 text-white transition-opacity duration-300 
            ${isHovered ? "opacity-100" : "opacity-0"}`} />
        </div>
      </div>
    </button>
  );
}
