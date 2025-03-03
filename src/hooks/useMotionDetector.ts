
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
        // Enviar mensagens pelo Telegram
        await sendTelegramMessage(contact.telegramId, locationLink);
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
  
  // Função para enviar mensagem via Telegram Bot
  const sendTelegramMessage = async (telegramId: string, locationLink: string) => {
    try {
      const botToken = "SEU_TOKEN_DO_BOT"; // Substituir pelo token real do seu bot
      const message = `ALERTA AUTOMÁTICO: Movimento brusco detectado. Possível situação de emergência! Localização atual: ${locationLink}`;
      
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
