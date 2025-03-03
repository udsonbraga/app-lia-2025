
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
      const contactName = localStorage.getItem("contactName");
      const contactNumber = localStorage.getItem("contactNumber");
      
      // Verificar se contato está configurado
      if (!contactName || !contactNumber) {
        toast({
          title: "Contato não configurado",
          description: "Por favor, configure um contato de confiança nas configurações.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Obter localização atual
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      
      // Enviar mensagens de emergência por diferentes canais
      const promises = [
        sendSMSMessage(contactNumber, contactName, locationLink),
        sendWhatsAppMessage(contactNumber, locationLink),
        sendTelegramMessage(contactNumber, locationLink)
      ];
      
      await Promise.all(promises);
      
      toast({
        title: "Pedido de ajuda enviado",
        description: "Mensagens de emergência enviadas por SMS, WhatsApp e Telegram.",
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
  
  // Função para simular envio de SMS
  const sendSMSMessage = async (phoneNumber: string, contactName: string, locationLink: string) => {
    // Simular o tempo de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Preparar mensagem
    const message = `EMERGÊNCIA: Preciso de ajuda urgente! Minha localização atual: ${locationLink}`;
    
    console.log(`Enviando SMS para ${contactName} (${phoneNumber}): ${message}`);
    
    // Em uma aplicação real, aqui seria feita uma chamada API para um serviço de SMS
    return true;
  };
  
  // Função para enviar mensagem via WhatsApp
  const sendWhatsAppMessage = async (phoneNumber: string, locationLink: string) => {
    // Formatar número para WhatsApp (remover caracteres não numéricos)
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    
    // Preparar mensagem
    const message = encodeURIComponent(`EMERGÊNCIA: Preciso de ajuda urgente! Minha localização atual: ${locationLink}`);
    
    // Criar link do WhatsApp
    const whatsappLink = `https://wa.me/55${formattedNumber}?text=${message}`;
    
    console.log(`Abrindo WhatsApp com link: ${whatsappLink}`);
    
    // Em um app móvel, isso abriria o WhatsApp diretamente
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
      // Caso seja um dispositivo móvel, tenta abrir direto no app
      window.location.href = whatsappLink;
    } else {
      // Caso seja desktop, abre em nova aba
      window.open(whatsappLink, "_blank");
    }
    
    return true;
  };
  
  // Função para enviar mensagem via Telegram
  const sendTelegramMessage = async (phoneNumber: string, locationLink: string) => {
    // Formatar número para Telegram (remover caracteres não numéricos)
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    
    // Preparar mensagem
    const message = encodeURIComponent(`EMERGÊNCIA: Preciso de ajuda urgente! Minha localização atual: ${locationLink}`);
    
    // Criar link do Telegram (note que o Telegram não suporta diretamente enviar mensagens por número de telefone,
    // então esta é uma abordagem aproximada - em um app real, seria necessário usar a API do Telegram)
    const telegramLink = `https://t.me/+55${formattedNumber}`;
    
    console.log(`Abrindo Telegram para contato: ${telegramLink}`);
    
    // Em um app móvel, isso tentaria abrir o Telegram
    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod/i)) {
      window.location.href = telegramLink;
    } else {
      window.open(telegramLink, "_blank");
    }
    
    return true;
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
