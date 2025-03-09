
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { EMERGENCY_KEYWORDS } from "@/constants/emergencyKeywords";
import { handleEmergencyAlert } from "@/utils/emergencyUtils";

/**
 * Hook for handling emergency sound detection functionality
 */
export function useEmergencySoundDetection() {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback(async () => {
    if (isRecording) return;
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      // Gravar por no máximo 30 segundos
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording();
        }
      }, 30000);
      
      console.log("Gravação de áudio iniciada");
    } catch (error) {
      console.error("Erro ao iniciar gravação de áudio:", error);
      toast({
        title: "Erro na gravação",
        description: "Não foi possível iniciar a gravação de áudio.",
        variant: "destructive"
      });
    }
  }, [isRecording, toast]);
  
  const stopRecording = useCallback(async () => {
    if (!isRecording || !mediaRecorderRef.current) return null;
    
    return new Promise<Blob>((resolve) => {
      mediaRecorderRef.current!.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = [];
        setIsRecording(false);
        console.log("Gravação de áudio finalizada");
        resolve(audioBlob);
      };
      
      mediaRecorderRef.current!.stop();
      mediaRecorderRef.current!.stream.getTracks().forEach(track => track.stop());
    });
  }, [isRecording]);

  const handleEmergencyDetected = useCallback(async () => {
    console.log("Emergência detectada, iniciando gravação");
    await startRecording();
    
    // Esperar 10 segundos de gravação após a detecção
    setTimeout(async () => {
      const audioBlob = await stopRecording();
      await handleEmergencyAlert({ toast, audioBlob });
    }, 10000);
  }, [toast, startRecording, stopRecording]);

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
          description: "O aplicativo está monitorando sons de emergência e gravará áudio se detectar uma emergência.",
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
      
      // Parar gravação se estiver ocorrendo
      if (isRecording) {
        stopRecording();
      }
    };
  }, [isListening, handleEmergencyDetected, toast, isRecording, stopRecording]);

  const toggleSoundDetection = () => {
    setIsListening(prevState => !prevState);
  };

  return {
    isListening,
    isRecording,
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
