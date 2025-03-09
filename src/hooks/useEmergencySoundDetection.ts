
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EMERGENCY_KEYWORDS } from "@/constants/emergencyKeywords";
import { handleEmergencyAlert } from "@/utils/emergencyUtils";

/**
 * Hook for handling emergency sound detection functionality
 */
export function useEmergencySoundDetection() {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  const handleEmergencyDetected = useCallback(async () => {
    await handleEmergencyAlert({ toast });
  }, [toast]);

  useEffect(() => {
    if (!isListening) return;

    let recognitionInstance: any = null;
    let isRecognitionActive = false;

    const startSpeechRecognition = () => {
      try {
        // Verificar se a API de reconhecimento de fala está disponível
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
          toast({
            title: "Não suportado",
            description: "Seu navegador não suporta reconhecimento de fala.",
            variant: "destructive"
          });
          setIsListening(false);
          return;
        }

        // Iniciar reconhecimento de fala
        recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = 'pt-BR';
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        isRecognitionActive = true;

        recognitionInstance.onresult = (event: any) => {
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript.toLowerCase();
            console.log("Texto detectado:", transcript);
            
            // Verificar se alguma palavra-chave de emergência foi detectada
            const detected = EMERGENCY_KEYWORDS.some(keyword => 
              transcript.includes(keyword.toLowerCase())
            );
            
            if (detected) {
              console.log("Palavra-chave de emergência detectada!");
              handleEmergencyDetected();
              break;
            }
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Erro de reconhecimento de fala:", event.error);
          if (isRecognitionActive) {
            // Tentar reiniciar em caso de erro
            setTimeout(startSpeechRecognition, 1000);
          }
        };

        recognitionInstance.onend = () => {
          if (isRecognitionActive) {
            // Reiniciar quando terminar
            recognitionInstance.start();
          }
        };

        recognitionInstance.start();
        
        toast({
          title: "Detecção de som ativada",
          description: "O aplicativo está monitorando sons de emergência.",
        });
      } catch (error) {
        console.error("Erro ao iniciar reconhecimento de fala:", error);
        toast({
          title: "Erro ao ativar detecção",
          description: "Não foi possível iniciar a detecção de sons.",
          variant: "destructive"
        });
        setIsListening(false);
      }
    };

    startSpeechRecognition();

    return () => {
      isRecognitionActive = false;
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
        } catch (e) {
          console.error("Erro ao parar reconhecimento de fala:", e);
        }
      }
    };
  }, [isListening, handleEmergencyDetected, toast]);

  const toggleSoundDetection = () => {
    setIsListening(prevState => !prevState);
  };

  return {
    isListening,
    toggleSoundDetection
  };
}

// Adicionar TypeScript declarations para o SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
