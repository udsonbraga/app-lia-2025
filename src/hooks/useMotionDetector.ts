
import { useEffect, useCallback, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { handleEmergencyAlert } from '@/utils/emergencyUtils';

export function useMotionDetector() {
  const { toast } = useToast();
  const [isMotionDetectionEnabled, setIsMotionDetectionEnabled] = useState(() => {
    return localStorage.getItem("motionDetectionEnabled") === "true";
  });

  const handleMotionEmergency = useCallback(async () => {
    if (!isMotionDetectionEnabled) return;
    
    try {
      // Usar a função utilitária de emergência que agora usa o chat ID correto
      await handleEmergencyAlert({ 
        toast,
        // Sem audioBlob para alertas de movimento
      });
    } catch (error) {
      console.error("Erro ao enviar alerta automático de movimento:", error);
      toast({
        title: "Erro ao enviar alerta",
        description: "Não foi possível enviar o alerta de movimento brusco.",
        variant: "destructive"
      });
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
        handleMotionEmergency();
        
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
  }, [handleMotionEmergency, isMotionDetectionEnabled]);

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
