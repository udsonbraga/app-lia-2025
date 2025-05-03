
import { useEffect, useState } from 'react';
import { handleEmergencyAlert } from '@/utils/emergencyUtils';
import { useToast } from '@/hooks/use-toast';
import { EMERGENCY_KEYWORDS } from '@/constants/emergencyKeywords';

export function useEmergencySoundDetection() {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);

  const toggleSoundDetection = () => {
    setIsListening(prevState => !prevState);
  };

  useEffect(() => {
    // Only initialize if the browser supports SpeechRecognition and isListening is true
    if (isListening && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        // Configure speech recognition
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'pt-BR'; // Set to Portuguese
        
        recognition.onstart = () => {
          console.log('Voice detection active');
        };
        
        recognition.onresult = async (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript.toLowerCase())
            .join(' ');
          
          console.log('Detected speech:', transcript);
          
          // Check if any emergency keyword is detected
          const hasEmergencyKeyword = EMERGENCY_KEYWORDS.some(keyword => 
            transcript.includes(keyword.toLowerCase())
          );
          
          if (hasEmergencyKeyword) {
            console.log('Emergency keyword detected!');
            recognition.stop();
            
            try {
              await handleEmergencyAlert();
              toast({
                title: "Alerta enviado",
                description: "Um alerta de emergência foi enviado baseado no seu comando de voz.",
              });
            } catch (error) {
              console.error("Erro ao processar alerta de emergência:", error);
              toast({
                title: "Erro ao enviar alerta",
                description: "Não foi possível enviar o alerta de emergência. Verifique suas configurações.",
                variant: "destructive"
              });
            } finally {
              // Resume listening after 5 seconds
              setTimeout(() => {
                recognition.start();
              }, 5000);
            }
          }
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          // Attempt to restart on error after a delay
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.error('Failed to restart speech recognition:', e);
            }
          }, 5000);
        };
        
        recognition.start();
        
        return () => {
          recognition.stop();
        };
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
      }
    }
  }, [toast, isListening]);

  return {
    isListening,
    toggleSoundDetection
  };
}
