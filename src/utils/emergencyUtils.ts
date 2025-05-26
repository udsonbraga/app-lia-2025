
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
  console.log("=== EMERGENCY ALERT TRIGGERED ===");
  
  try {
    const toastFn = toast || showToast;
    
    console.log("=== CHECKING FOR CONTACTS ===");
    
    // Load contacts from localStorage only
    console.log("=== LOADING FROM LOCALSTORAGE ===");
    const safeContacts = localStorage.getItem("safeContacts");
    const contacts = safeContacts ? JSON.parse(safeContacts) : [];
    console.log("Emergency contacts from localStorage:", contacts);
    
    if (contacts.length === 0) {
      console.log("❌ No emergency contacts configured");
      toastFn({
        title: "Contatos não configurados",
        description: "Por favor, configure pelo menos um contato de confiança nas configurações.",
        variant: "destructive",
      });
      return false;
    }
    
    console.log("✅ Emergency contacts found:", contacts.length);
    
    // Show loading toast for location
    toastFn({
      title: "Obtendo localização...",
      description: "Preparando alerta de emergência com sua localização.",
    });
    
    // Enviar mensagens para todos os contatos cadastrados
    const notifiedContacts = [];
    
    for (const contact of contacts) {
      console.log("Sending alert to contact:", contact.name, contact.id);
      
      if (contact.telegramId) {
        console.log("Sending Telegram message with location to:", contact.telegramId);
        const sent = await sendTelegramMessage(contact.telegramId);
        console.log("Telegram message result:", sent);
        
        if (sent) {
          notifiedContacts.push(contact.id);
          console.log("✅ Contact notified successfully with location:", contact.id);
        } else {
          console.log("❌ Failed to notify contact:", contact.id);
        }
      } else {
        console.log("⚠️ Contact has no Telegram ID:", contact.name);
      }
    }
    
    console.log("Contacts notified:", notifiedContacts);
    console.log("✅ Emergency alert process completed");
    
    toastFn({
      title: "Alerta de emergência enviado",
      description: `Alertas com localização enviados para ${notifiedContacts.length} contato(s) via Telegram.`,
    });
    
    localStorage.setItem("lastEmergencyAlert", new Date().toISOString());
    console.log("Last emergency alert timestamp saved");
    
    return true;
  } catch (error) {
    console.error("❌ Error in emergency alert process:", error);
    console.error("Full error details:", error);
    const toastFn = toast || showToast;
    toastFn({
      title: "Erro ao enviar alerta",
      description: "Não foi possível enviar o alerta de emergência. Tente novamente.",
      variant: "destructive"
    });
    throw error;
  }
};
