
import { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useEmergencySoundDetection() {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();

  // Estado para armazenar a configuração de palavras-chave de emergência
  const [emergencyKeywords] = useState<string[]>([
    "socorro", "ajuda", "emergência", "polícia", "help", 
    "auxílio", "stop", "para", "não", "abuso"
  ]);

  const handleEmergencyDetected = useCallback(async () => {
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
        return;
      }
      
      // Obter localização atual
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      
      // Enviar mensagens para todos os contatos
      for (const contact of contacts) {
        // Enviar mensagem pelo Telegram
        await sendTelegramMessage(contact.telegramId, locationLink);
      }
      
      toast({
        title: "Alerta de emergência enviado",
        description: "Som de emergência detectado! Alertas enviados via Telegram.",
      });
    } catch (error) {
      console.error("Erro ao enviar alerta automático:", error);
      toast({
        title: "Erro ao enviar alerta",
        description: "Não foi possível enviar o alerta de emergência. Tente novamente.",
        variant: "destructive"
      });
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
      const message = `EMERGÊNCIA DETECTADA! Som de emergência identificado. Localização atual: ${locationLink}`;
      
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
            const detected = emergencyKeywords.some(keyword => 
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
  }, [isListening, handleEmergencyDetected, emergencyKeywords, toast]);

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
