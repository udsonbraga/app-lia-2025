
import { sendTelegramMessage } from './telegramUtils';
import { toast as showToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
    
    // Check if user is authenticated first
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    console.log("=== CHECKING FOR CONTACTS ===");
    console.log("User authenticated:", !!userId);
    
    let contacts = [];
    
    if (userId) {
      // Try to load contacts from database if user is authenticated
      try {
        console.log("=== LOADING FROM DATABASE ===");
        const { data, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log("Database error, falling back to localStorage:", error);
          throw error;
        }

        if (data && data.length > 0) {
          // Convert database format to app format
          contacts = data.map(contact => ({
            id: contact.id,
            name: contact.name,
            phone: contact.phone,
            telegramId: contact.telegram_id || '',
            relationship: 'Contato'
          }));
          console.log("Emergency contacts from database:", contacts);
        } else {
          console.log("No contacts found in database, checking localStorage");
          throw new Error("No contacts in database");
        }
      } catch (dbError) {
        // Fallback to localStorage if database fails
        console.log("=== FALLBACK TO LOCALSTORAGE ===");
        const safeContacts = localStorage.getItem("safeContacts");
        contacts = safeContacts ? JSON.parse(safeContacts) : [];
        console.log("Emergency contacts from localStorage:", contacts);
      }
    } else {
      // User not authenticated, use localStorage only
      console.log("=== USER NOT AUTHENTICATED - USING LOCALSTORAGE ===");
      const safeContacts = localStorage.getItem("safeContacts");
      contacts = safeContacts ? JSON.parse(safeContacts) : [];
      console.log("Emergency contacts from localStorage:", contacts);
    }
    
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
    
    // Enviar mensagens para todos os contatos cadastrados
    const notifiedContacts = [];
    
    for (const contact of contacts) {
      console.log("Sending alert to contact:", contact.name, contact.id);
      
      if (contact.telegramId) {
        console.log("Sending Telegram message to:", contact.telegramId);
        const sent = await sendTelegramMessage(contact.telegramId);
        console.log("Telegram message result:", sent);
        
        if (sent) {
          notifiedContacts.push(contact.id);
          console.log("✅ Contact notified successfully:", contact.id);
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
      description: `Alertas enviados para ${notifiedContacts.length} contato(s) via Telegram.`,
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
