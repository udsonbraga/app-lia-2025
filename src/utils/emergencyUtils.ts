
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
    let successCount = 0;
    
    for (const contact of contacts) {
      try {
        // Enviar mensagem pelo Telegram e contar sucessos
        const result = await sendTelegramMessage(contact.telegramId, locationLink);
        if (result) successCount++;
      } catch (err) {
        console.error(`Erro ao enviar mensagem para ${contact.name}:`, err);
      }
    }
    
    // Verificar resultados
    if (successCount > 0) {
      toast({
        title: "Alerta de emergência enviado",
        description: `Alertas enviados com sucesso para ${successCount} de ${contacts.length} contatos.`,
      });
    } else {
      throw new Error("Nenhum alerta foi enviado com sucesso");
    }
  } catch (error) {
    console.error("Erro ao enviar alerta automático:", error);
    toast({
      title: "Erro ao enviar alerta",
      description: "Não foi possível enviar o alerta de emergência. Tente novamente.",
      variant: "destructive"
    });
    throw error; // Re-throw para tratamento no componente
  }
};
