
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
      if (contact.twilioAccountSid && contact.twilioAuthToken && contact.twilioWhatsappNumber && contact.phone) {
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
      description: "Alertas enviados via Telegram e WhatsApp para seus contatos de segurança.",
    });
  } catch (error) {
    console.error("Erro ao enviar alerta automático:", error);
    throw error; // Propagar o erro para ser tratado pelo componente
  }
};

// Função para enviar mensagem via WhatsApp (Twilio)
export const sendWhatsAppMessage = async (
  accountSid: string, 
  authToken: string, 
  fromNumber: string, 
  toNumber: string, 
  locationLink: string,
  templateId?: string,
  templateParams?: Record<string, string>
) => {
  try {
    // Extrair o número puro de um formato como (+55) 92 85231-265
    let formattedToNumber = toNumber.replace(/\D/g, "");
    
    // Se o número tiver o formato internacional com parênteses (+XX)
    if (toNumber.includes('(+')) {
      const countryCodeMatch = toNumber.match(/\(\+(\d+)\)/);
      if (countryCodeMatch && countryCodeMatch[1]) {
        // Garantir que o código do país está no início do número
        if (!formattedToNumber.startsWith(countryCodeMatch[1])) {
          formattedToNumber = countryCodeMatch[1] + formattedToNumber;
        }
      }
    }
    
    // Remover código do país duplicado se existir
    const countryCodeRegex = /^(\d{2})\1/;
    if (countryCodeRegex.test(formattedToNumber)) {
      formattedToNumber = formattedToNumber.replace(countryCodeRegex, '$1');
    }
    
    // Adicionar o prefixo + se não existir
    if (!formattedToNumber.startsWith("+")) {
      formattedToNumber = `+${formattedToNumber}`;
    }
    
    // Garantir que o número de origem esteja no formato correto para WhatsApp
    const fromWhatsApp = fromNumber.startsWith("whatsapp:") 
      ? fromNumber 
      : `whatsapp:${fromNumber}`;
    
    // Garantir que o número de destino esteja no formato correto para WhatsApp
    const toWhatsApp = `whatsapp:${formattedToNumber}`;
    
    console.log("Enviando WhatsApp para:", toWhatsApp);
    
    // Twilio API endpoint para mensagens
    const twilioApiUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    
    // Credenciais em Base64 para autenticação
    const credentials = btoa(`${accountSid}:${authToken}`);
    
    // Preparar FormData para a requisição
    const formData = new URLSearchParams();
    formData.append('From', fromWhatsApp);
    formData.append('To', toWhatsApp);
    
    // Se tiver um template ID, usa o template, senão usa mensagem customizada
    if (templateId) {
      formData.append('ContentSid', templateId);
      
      // Adiciona parâmetros do template se fornecidos
      if (templateParams) {
        formData.append('ContentVariables', JSON.stringify(templateParams));
      }
    } else {
      // Mensagem padrão a ser enviada se não houver template
      const message = `EMERGÊNCIA: Preciso de ajuda urgente! Minha localização atual: ${locationLink}`;
      formData.append('Body', message);
    }
    
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
