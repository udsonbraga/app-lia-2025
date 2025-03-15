
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
        
        // Enviar mensagem pelo WhatsApp se as credenciais Twilio estiverem configuradas
        if (contact.twilioAccountSid && contact.twilioAuthToken && contact.twilioWhatsappNumber) {
          promises.push(
            sendWhatsAppMessage(
              contact.twilioAccountSid,
              contact.twilioAuthToken,
              contact.twilioWhatsappNumber,
              contact.phone,
              locationLink
            )
          );
        }
      }
      
      await Promise.allSettled(promises);
      
      toast({
        title: "Pedido de ajuda enviado",
        description: "Mensagens de emergência enviadas para seus contatos seguros via Telegram e WhatsApp.",
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
      const botToken = "7668166969:AAFnukkbhjDnUgGTC5em6vYk1Ch7bXy-rBQ"; // Updated token
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
      console.log('Mensagem Telegram enviada com sucesso:', data);
      return true;
    } catch (error) {
      console.error('Erro ao enviar mensagem via Telegram:', error);
      return false;
    }
  };

  // Função para enviar mensagem via WhatsApp (Twilio)
  const sendWhatsAppMessage = async (
    accountSid: string, 
    authToken: string, 
    fromNumber: string, 
    toNumber: string, 
    locationLink: string
  ) => {
    try {
      // Formatando o número de telefone de destino para o formato E.164
      let formattedToNumber = toNumber.replace(/\D/g, "");
      if (formattedToNumber.startsWith("0")) {
        formattedToNumber = formattedToNumber.substring(1);
      }
      if (!formattedToNumber.startsWith("+")) {
        formattedToNumber = `+55${formattedToNumber}`;
      }
      
      // Garante que o número de origem esteja no formato correto para WhatsApp
      const fromWhatsApp = fromNumber.startsWith("whatsapp:") 
        ? fromNumber 
        : `whatsapp:${fromNumber}`;
      
      // Garante que o número de destino esteja no formato correto para WhatsApp
      const toWhatsApp = formattedToNumber.startsWith("whatsapp:") 
        ? formattedToNumber 
        : `whatsapp:${formattedToNumber}`;
      
      // Mensagem a ser enviada
      const message = `EMERGÊNCIA: Preciso de ajuda urgente! Minha localização atual: ${locationLink}`;

      // Twilio API endpoint para mensagens
      const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
      
      // Credenciais em Base64 para autenticação
      const credentials = btoa(`${accountSid}:${authToken}`);
      
      // Preparar FormData para a requisição
      const formData = new URLSearchParams();
      formData.append('From', fromWhatsApp);
      formData.append('To', toWhatsApp);
      formData.append('Body', message);
      
      // Fazer a requisição para a API do Twilio
      const response = await fetch(twilioApiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      const responseData = await response.json();
      
      if (response.ok) {
        console.log('Mensagem WhatsApp enviada com sucesso:', responseData);
        return true;
      } else {
        console.error('Erro ao enviar WhatsApp:', responseData);
        return false;
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem via WhatsApp:', error);
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
