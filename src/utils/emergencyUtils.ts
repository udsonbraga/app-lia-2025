
import { getCurrentPosition } from './geolocationUtils';
import { sendTelegramMessage } from './telegramUtils';
import { useToast } from "@/hooks/use-toast";

type EmergencyAlertProps = {
  toast: ReturnType<typeof useToast>['toast'];
  audioBlob?: Blob;
};

/**
 * Handles sending emergency alerts to the support bot
 */
export const handleEmergencyAlert = async ({ toast, audioBlob }: EmergencyAlertProps) => {
  try {
    // Obter localização atual
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    
    // Preparar mensagem de emergência
    const emergencyMessage = `EMERGÊNCIA DETECTADA! ${audioBlob ? 'Som de emergência identificado.' : 'Botão de emergência acionado.'}`;
    
    // Enviar mensagem de emergência para o bot de suporte
    const success = await sendTelegramMessage(emergencyMessage, locationLink, audioBlob);
    
    if (success) {
      toast({
        title: "Alerta de emergência enviado",
        description: `Emergência detectada! Alerta${audioBlob ? " e gravação" : ""} enviado.`,
      });
    } else {
      throw new Error("Falha ao enviar alerta de emergência");
    }
  } catch (error) {
    console.error("Erro ao enviar alerta automático:", error);
    toast({
      title: "Erro ao enviar alerta",
      description: "Não foi possível enviar o alerta de emergência. Tente novamente.",
      variant: "destructive"
    });
  }
};
