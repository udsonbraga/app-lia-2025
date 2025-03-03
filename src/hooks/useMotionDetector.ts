
import { useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useMotionDetector() {
  const { toast } = useToast();

  const handleEmergencyAlert = useCallback(async () => {
    try {
      // Obter contatos de emergência do localStorage
      const safeContacts = localStorage.getItem("safeContacts");
      const contacts = safeContacts ? JSON.parse(safeContacts) : [];
      
      // Verificar se há contatos configurados
      if (contacts.length === 0) {
        console.log("Contatos de emergência não configurados");
        return;
      }
      
      // Obter localização atual
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      
      // Enviar mensagens para todos os contatos
      for (const contact of contacts) {
        // Enviar mensagens por diferentes canais
        await sendEmergencyMessage(contact.number, contact.name, locationLink);
        await sendWhatsAppMessage(contact.number, locationLink);
        await sendTelegramMessage(contact.number, locationLink);
      }
      
      toast({
        title: "Alerta de emergência enviado",
        description: "Detectamos movimento brusco. Alerta enviado aos seus contatos.",
      });
    } catch (error) {
      console.error("Erro ao enviar alerta automático:", error);
    }
  }, [toast]);

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
  const sendEmergencyMessage = async (phoneNumber: string, contactName: string, locationLink: string) => {
    // Simular o tempo de envio
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Preparar mensagem
    const message = `ALERTA AUTOMÁTICO: Movimento brusco detectado. Possível situação de emergência! Localização atual: ${locationLink}`;
    
    console.log(`Enviando SMS para ${contactName} (${phoneNumber}): ${message}`);
    
    // Em uma aplicação real, aqui seria feita uma chamada API para um serviço de SMS
    return true;
  };
  
  // Função para enviar mensagem via WhatsApp
  const sendWhatsAppMessage = async (phoneNumber: string, locationLink: string) => {
    // Formatar número para WhatsApp (remover caracteres não numéricos)
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    
    // Preparar mensagem
    const message = encodeURIComponent(`ALERTA AUTOMÁTICO: Movimento brusco detectado. Possível situação de emergência! Localização atual: ${locationLink}`);
    
    // Criar link do WhatsApp
    const whatsappLink = `https://wa.me/55${formattedNumber}?text=${message}`;
    
    console.log(`Preparando mensagem WhatsApp: ${whatsappLink}`);
    
    // Em uma implementação real, isso seria feito via API do WhatsApp Business
    return true;
  };
  
  // Função para enviar mensagem via Telegram
  const sendTelegramMessage = async (phoneNumber: string, locationLink: string) => {
    // Formatar número para Telegram
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    
    // Preparar mensagem
    const message = `ALERTA AUTOMÁTICO: Movimento brusco detectado. Possível situação de emergência! Localização atual: ${locationLink}`;
    
    console.log(`Preparando mensagem Telegram para +55${formattedNumber}: ${message}`);
    
    // Em uma implementação real, isso seria feito via API do Telegram Bot
    return true;
  };

  useEffect(() => {
    // Motion detection code
    let lastY = 0;
    let lastX = 0;
    let lastZ = 0;
    let lastTime = new Date().getTime();
    let alertCooldown = false;

    const handleMotion = (event: DeviceMotionEvent) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTime;
      
      if (timeDiff < 100) return;
      
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;
      
      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;
      
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);
      
      if (deltaX + deltaY + deltaZ > 30 && !alertCooldown) {
        // Evitar múltiplos alertas em sequência
        alertCooldown = true;
        
        // Trigger emergency contact
        handleEmergencyAlert();
        
        // Reset cooldown após 30 segundos
        setTimeout(() => {
          alertCooldown = false;
        }, 30000);
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
      lastTime = currentTime;
    };

    window.addEventListener('devicemotion', handleMotion);
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [handleEmergencyAlert]);
}
