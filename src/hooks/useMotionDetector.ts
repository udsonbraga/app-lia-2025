
import { useEffect, useCallback, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getCurrentPosition } from "@/utils/geolocationUtils";
import { sendTelegramMessage } from "@/utils/telegramUtils";

export function useMotionDetector() {
  const { toast } = useToast();
  const [isMotionDetectionEnabled, setIsMotionDetectionEnabled] = useState(() => {
    return localStorage.getItem("motionDetectionEnabled") === "true";
  });

  const handleEmergencyAlert = useCallback(async () => {
    if (!isMotionDetectionEnabled) return;
    
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
        if (contact.telegramId) {
          await sendTelegramMessage(contact.telegramId, locationLink);
        }
      }
      
      toast({
        title: "Alerta de emergência enviado",
        description: "Detectamos movimento brusco. Alerta enviado aos seus contatos.",
      });
    } catch (error) {
      console.error("Erro ao enviar alerta automático:", error);
    }
  }, [toast, isMotionDetectionEnabled]);

  // Toggle function for motion detection
  const toggleMotionDetection = () => {
    const newValue = !isMotionDetectionEnabled;
    setIsMotionDetectionEnabled(newValue);
    localStorage.setItem("motionDetectionEnabled", newValue.toString());
    
    if (newValue) {
      toast({
        title: "Detecção de movimento ativada",
        description: "O aplicativo vai monitorar movimentos bruscos e enviar alertas."
      });
    } else {
      toast({
        title: "Detecção de movimento desativada",
        description: "O monitoramento de movimentos bruscos foi desativado."
      });
    }
  };

  useEffect(() => {
    if (!isMotionDetectionEnabled) return;
    
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
  }, [handleEmergencyAlert, isMotionDetectionEnabled]);

  return {
    isMotionDetectionEnabled,
    toggleMotionDetection
  };
}

// Adicionar TypeScript declarations para o SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
