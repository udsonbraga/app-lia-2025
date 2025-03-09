
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useCallback } from "react";
import { getCurrentPosition } from '@/utils/geolocationUtils';
import { sendTelegramMessage } from '@/utils/telegramUtils';

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
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
      
      console.log("Gravação de áudio iniciada");
    } catch (error) {
      console.error("Erro ao iniciar gravação de áudio:", error);
    }
  }, [isRecording]);
  
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

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    
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
        setIsLoading(false);
        return;
      }
      
      // Iniciar gravação de áudio
      await startRecording();
      
      // Obter localização atual
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
      
      // Gravar por 10 segundos antes de enviar
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      // Parar gravação e obter o blob de áudio
      const audioBlob = await stopRecording();
      
      // Enviar mensagens para todos os contatos cadastrados
      const promises = [];
      
      for (const contact of contacts) {
        // Enviar mensagem pelo Telegram com áudio
        promises.push(
          sendTelegramMessage(contact.telegramId, locationLink, audioBlob)
        );
      }
      
      await Promise.allSettled(promises);
      
      toast({
        title: "Pedido de ajuda enviado",
        description: "Mensagens de emergência e gravação de áudio enviadas para todos os seus contatos seguros via Telegram.",
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
