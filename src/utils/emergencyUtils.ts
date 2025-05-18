
import { getCurrentPosition } from './geolocationUtils';
import { sendTelegramMessage } from './telegramUtils';
import { toast as showToast } from "@/components/ui/use-toast";

type EmergencyAlertProps = {
  toast?: typeof showToast;
};

/**
 * Handles sending emergency alerts to configured contacts
 * @returns {Promise<boolean>} Returns true if alert was sent, false if no contacts configured
 */
export const handleEmergencyAlert = async ({ toast }: EmergencyAlertProps = {}): Promise<boolean> => {
  try {
    // Get the toast function or use the imported one
    const toastFn = toast || showToast;
    
    // Obter contatos de emergência do localStorage
    const safeContacts = localStorage.getItem("safeContacts");
    const contacts = safeContacts ? JSON.parse(safeContacts) : [];
    
    // Verificar se há contatos configurados
    if (contacts.length === 0) {
      toastFn({
        title: "Contatos não configurados",
        description: "Por favor, configure pelo menos um contato de confiança nas configurações.",
        variant: "destructive"
      });
      return false;
    }
    
    // Log para verificar os contatos
    console.log("Contatos de emergência encontrados:", contacts);
    
    // Obter localização atual
    const position = await getCurrentPosition();
    const { latitude, longitude } = position.coords;
    const locationLink = `https://maps.google.com/?q=${latitude},${longitude}`;
    
    // Enviar mensagens para todos os contatos cadastrados
    const promises = [];
    
    for (const contact of contacts) {
      console.log("Enviando alerta para:", contact.name);
      // Enviar mensagem pelo Telegram
      promises.push(
        sendTelegramMessage(contact.telegramId, locationLink)
      );
    }
    
    await Promise.allSettled(promises);
    
    toastFn({
      title: "Alerta de emergência enviado",
      description: "Botão de Emergência Acionado! Alertas enviados via Telegram.",
    });
    
    // Registrar hora do envio
    localStorage.setItem("lastEmergencyAlert", new Date().toISOString());
    
    return true;
  } catch (error) {
    console.error("Erro ao enviar alerta automático:", error);
    const toastFn = toast || showToast;
    toastFn({
      title: "Erro ao enviar alerta",
      description: "Não foi possível enviar o alerta de emergência. Tente novamente.",
      variant: "destructive"
    });
    throw error;
  }
};
