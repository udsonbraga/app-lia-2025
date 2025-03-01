
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
      
      // Simular envio de SMS (em produção, isso seria conectado a uma API real)
      // Aqui usamos uma simulação de API
      await sendEmergencyMessage(contactNumber, contactName, locationLink);
      
      toast({
        title: "Pedido de ajuda enviado",
        description: "As autoridades e seus contatos de confiança foram notificados.",
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
  
  // Função para simular envio de SMS (em um app real, seria conectado a uma API)
  const sendEmergencyMessage = async (phoneNumber: string, contactName: string, locationLink: string) => {
    // Simular o tempo de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Preparar mensagem
    const message = `EMERGÊNCIA: Preciso de ajuda urgente! Minha localização atual: ${locationLink}`;
    
    console.log(`Enviando SMS para ${contactName} (${phoneNumber}): ${message}`);
    
    // Em uma aplicação real, aqui seria feita uma chamada API para um serviço de SMS
    // return fetch('https://api.sms-service.com/send', {
    //   method: 'POST',
    //   body: JSON.stringify({ to: phoneNumber, message }),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    
    // Para demonstração, apenas retornamos sucesso
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
        hover:bg-red-50
        ${isLoading ? "animate-pulse bg-red-100" : ""}
      `}
    >
      <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <div className="flex flex-col items-center gap-2">
        <Shield size={50} className={`text-red-500 ${isLoading ? "animate-pulse" : ""}`} />
        <span className="text-base font-semibold text-gray-800">
          {isLoading ? "Enviando..." : "Emergência"}
        </span>
      </div>
    </button>
  );
}
