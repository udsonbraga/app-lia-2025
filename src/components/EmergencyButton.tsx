
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { handleEmergencyAlert } from "@/utils/emergencyUtils";
import { getCurrentPosition } from "@/utils/geolocationUtils";
import { sendTelegramMessage } from "@/utils/telegramUtils";

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    
    try {
      // Usar o sistema padrão de alerta de emergência
      await handleEmergencyAlert({ toast });
      
      // Exemplo de como enviar para um número específico com template (opcional)
      // Se quiser testar com o número fornecido, descomentar este código:
      /*
      try {
        const position = await getCurrentPosition();
        const { latitude, longitude } = position.coords;
        const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        
        // Dados específicos do exemplo fornecido
        const accountSid = "ACa442b3fbd9216a4ba74662505c414e2b";
        const authToken = "a9cfb35d626f6eb0ac331d2740aa211f"; // Substitua pelo token real
        const twilioWhatsappNumber = "+14155238886";
        const destinationNumber = "+559285231265";
        const templateId = "HXb5b62575e6e4ff6129ad7c8efe1f983e";
        const templateParams = { "1": "12/1", "2": "3pm" };
        
        await sendWhatsAppMessage(
          accountSid,
          authToken,
          twilioWhatsappNumber,
          destinationNumber,
          locationLink,
          templateId,
          templateParams
        );
      } catch (err) {
        console.error("Erro ao enviar WhatsApp com template:", err);
      }
      */
      
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
        hover:bg-safelady-light
        ${isLoading ? "animate-pulse bg-safelady-light" : ""}
      `}
    >
      <div className="absolute inset-0 bg-safelady rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="flex flex-col items-center gap-2">
        <Shield size={50} className={`text-safelady ${isLoading ? "animate-pulse" : ""}`} />
        <span className="text-base font-semibold text-gray-800">
          {isLoading ? "Enviando..." : "Emergência"}
        </span>
      </div>
    </button>
  );
}
