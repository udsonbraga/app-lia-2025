
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
    
    // Primeiro verificar se o usuário está autenticado
    console.log("=== CHECKING AUTHENTICATION ===");
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log("Auth state:", { 
      hasSession: !!session, 
      userId: session?.user?.id, 
      sessionError 
    });
    
    let contacts = [];
    
    if (session?.user?.id) {
      console.log("✅ User authenticated, checking Supabase for contacts");
      
      // Buscar contatos no Supabase primeiro
      try {
        const { data: supabaseContacts, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('user_id', session.user.id);
        
        console.log("Supabase contacts query result:", { data: supabaseContacts, error });
        
        if (error) {
          console.error("❌ Error fetching contacts from Supabase:", error);
          toastFn({
            title: "Erro ao verificar contatos",
            description: "Não foi possível verificar seus contatos na nuvem.",
            variant: "destructive"
          });
          return false;
        }
        
        if (supabaseContacts && supabaseContacts.length > 0) {
          console.log("✅ Found contacts in Supabase:", supabaseContacts.length);
          // Converter formato do Supabase para formato do app
          contacts = supabaseContacts.map(contact => ({
            id: contact.id,
            name: contact.name,
            phone: contact.phone,
            telegramId: contact.telegram_id || "",
            relationship: contact.is_primary ? "Primário" : "Secundário"
          }));
        } else {
          console.log("⚠️ No contacts found in Supabase for authenticated user");
          toastFn({
            title: "Nenhum contato encontrado",
            description: "Configure pelo menos um contato de confiança nas configurações.",
            variant: "destructive"
          });
          return false;
        }
      } catch (supabaseError) {
        console.error("❌ Error in Supabase query:", supabaseError);
        toastFn({
          title: "Erro ao verificar contatos",
          description: "Não foi possível verificar seus contatos na nuvem.",
          variant: "destructive"
        });
        return false;
      }
    } else {
      console.log("❌ User not authenticated, checking localStorage");
      // Fallback para localStorage se não estiver logado
      const safeContacts = localStorage.getItem("safeContacts");
      contacts = safeContacts ? JSON.parse(safeContacts) : [];
      console.log("Emergency contacts from localStorage:", contacts);
      
      if (contacts.length === 0) {
        console.log("❌ No emergency contacts configured");
        toastFn({
          title: "Contatos não configurados",
          description: "Por favor, configure pelo menos um contato de confiança nas configurações.",
          variant: "destructive"
        });
        return false;
      }
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
    
    // Salvar o alerta no banco de dados se estiver autenticado
    if (session?.user) {
      console.log("✅ User authenticated, saving alert to database");
      
      try {
        const locationData = await getCurrentPosition();
        console.log("Location data obtained:", locationData);
        
        const alertData = {
          user_id: session.user.id,
          alert_type: 'button_press',
          location_data: locationData,
          contacts_notified: notifiedContacts,
          resolved: false
        };
        
        console.log("Alert data to insert:", alertData);
        
        const { data, error } = await supabase
          .from('emergency_alerts')
          .insert(alertData)
          .select();
          
        console.log("Database insert result:", { data, error });
          
        if (error) {
          console.error("❌ Error saving alert to database:", error);
          console.error("Error details:", error.message, error.code, error.details);
        } else {
          console.log("✅ Alert saved successfully to database");
          console.log("Alert data saved:", data);
        }
      } catch (dbError) {
        console.error("❌ Error in database operation:", dbError);
      }
    } else {
      console.log("❌ User not authenticated, alert not saved to database");
    }
    
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

const getCurrentPosition = (): Promise<{ latitude: number; longitude: number } | null> => {
  console.log("Getting current position...");
  
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log("❌ Geolocation not supported");
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        console.log("✅ Location obtained:", location);
        resolve(location);
      },
      (error) => {
        console.log("❌ Error getting location:", error);
        resolve(null);
      },
      { 
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};
