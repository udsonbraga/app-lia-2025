
import { getCurrentPosition } from './geolocationUtils';
import { sendTelegramMessage } from './telegramUtils';
import { useToast } from "@/hooks/use-toast";

type EmergencyAlertProps = {
  toast: ReturnType<typeof useToast>['toast'];
};

/**
 * Handles sending emergency alerts to configured contacts
 */
export const handleEmergencyAlert = async ({ toast }: EmergencyAlertProps) => {
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
    
    // Enviar mensagens para todos os contatos cadastrados
    const promises = [];
    
    for (const contact of contacts) {
      // Enviar mensagem pelo Telegram
      promises.push(
        sendTelegramMessage(contact.telegramId, locationLink)
      );
      
      // Enviar mensagem pelo WhatsApp se as credenciais Twilio estiverem configuradas
      if (contact.twilioAccountSid && contact.twilioAuthToken && contact.twilioWhatsappNumber) {
        promises.push(
          sendWhatsAppMessage(
            contact.twilioAccountSid,
            contact.twilioAuthToken,
            contact.twilioWhatsappNumber,
            contact.phone,
            locationLink
          )
        );
      }
    }
    
    await Promise.allSettled(promises);
    
    toast({
      title: "Alerta de emergência enviado",
      description: "Som de emergência detectado! Alertas enviados via Telegram e WhatsApp.",
    });
  } catch (error) {
    console.error("Erro ao enviar alerta automático:", error);
    toast({
      title: "Erro ao enviar alerta",
      description: "Não foi possível enviar o alerta de emergência. Tente novamente.",
      variant: "destructive"
    });
  }
};

// Função para enviar mensagem via WhatsApp (Twilio)
export const sendWhatsAppMessage = async (
  accountSid: string, 
  authToken: string, 
  fromNumber: string, 
  toNumber: string, 
  locationLink: string
) => {
  try {
    // Formatando o número de telefone de destino para o formato E.164
    let formattedToNumber = toNumber.replace(/\D/g, "");
    if (formattedToNumber.startsWith("0")) {
      formattedToNumber = formattedToNumber.substring(1);
    }
    if (!formattedToNumber.startsWith("+")) {
      formattedToNumber = `+${formattedToNumber}`;
    }
    
    // Garante que o número de origem esteja no formato correto para WhatsApp
    const fromWhatsApp = fromNumber.startsWith("whatsapp:") 
      ? fromNumber 
      : `whatsapp:${fromNumber}`;
    
    // Garante que o número de destino esteja no formato correto para WhatsApp
    const toWhatsApp = `whatsapp:${formattedToNumber}`;
    
    // Mensagem a ser enviada
    const message = `EMERGÊNCIA: Preciso de ajuda urgente! Minha localização atual: ${locationLink}`;

    // Twilio API endpoint para mensagens
    const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    // Credenciais em Base64 para autenticação
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    // Preparar FormData para a requisição
    const formData = new URLSearchParams();
    formData.append('From', fromWhatsApp);
    formData.append('To', toWhatsApp);
    formData.append('Body', message);
    
    // Fazer a requisição para a API do Twilio
    const response = await fetch(twilioApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    
    const responseData = await response.json();
    
    if (response.ok) {
      console.log('Mensagem WhatsApp enviada com sucesso:', responseData);
      return true;
    } else {
      console.error('Erro ao enviar WhatsApp:', responseData);
      return false;
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem via WhatsApp:', error);
    return false;
  }
};
