
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    
    try {
      // Obter contatos de emergência do localStorage
      const safeContacts = localStorage.getItem("safeContacts");
      const contacts = safeContacts ? JSON.parse(safeContacts) : [];
      
      // Verificar se há contatos configurados
      if (contacts.length === 0) {
        toast({
          title: "Contatos não configurados",
          description: "Por favor, configure pelo menos um contato de confiança nas configurações.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Obter localização atual
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      
      // Enviar mensagens para todos os contatos cadastrados
      const promises = [];
      
      for (const contact of contacts) {
        // Enviar mensagem pelo Telegram
        promises.push(
          sendTelegramMessage(contact.telegramId, locationLink)
        );
      }
      
      await Promise.allSettled(promises);
      
      toast({
        title: "Pedido de ajuda enviado",
        description: "Mensagens de emergência enviadas para todos os seus contatos seguros via Telegram.",
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
  
  // Função para obter posição atual
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização não suportada pelo navegador"));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };
  
  // Função para enviar mensagem via Telegram Bot
  const sendTelegramMessage = async (telegramId: string, locationLink: string) => {
    try {
      const botToken = "SEU_TOKEN_DO_BOT"; // Substituir pelo token real do seu bot
      const message = `EMERGÊNCIA: Preciso de ajuda urgente! Minha localização atual: ${locationLink}`;
      
      // URL da API do Telegram para enviar mensagem
      const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      
      // Preparar o corpo da requisição
      const requestBody = {
        chat_id: telegramId,
        text: message,
        parse_mode: "HTML"
      };
      
      // Fazer a requisição para a API do Telegram
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Mensagem enviada com sucesso:', data);
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem via Telegram:', error);
      return false;
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
