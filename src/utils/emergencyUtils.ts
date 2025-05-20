
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
    
    // Enviar mensagens para todos os contatos cadastrados
    const promises = [];
    const notifiedContacts = [];
    
    for (const contact of contacts) {
      console.log("Enviando alerta para:", contact.name);
      // Enviar mensagem pelo Telegram
      if (contact.telegramId) {
        const sent = await sendTelegramMessage(contact.telegramId);
        if (sent) {
          notifiedContacts.push(contact.id);
        }
      }
    }
    
    // Salvar o alerta no banco de dados se estiver autenticado
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      try {
        // Obter localização atual
        const locationData = await getCurrentPosition();
        
        // Inserir registro do alerta no banco de dados
        const { error } = await supabase
          .from('emergency_alerts')
          .insert({
            user_id: session.user.id,
            alert_type: 'button_press',
            location_data: locationData,
            contacts_notified: notifiedContacts,
            resolved: false
          });
          
        if (error) {
          console.error("Erro ao salvar alerta no banco de dados:", error);
        } else {
          console.log("Alerta salvo com sucesso no banco de dados");
        }
      } catch (dbError) {
        console.error("Erro ao salvar alerta no banco de dados:", dbError);
        // Continuar mesmo se houver erro no banco de dados
      }
    } else {
      console.log("Usuário não autenticado, alerta não foi salvo no banco de dados");
    }
    
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

// Função auxiliar para obter a localização atual
const getCurrentPosition = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        // Em caso de erro ou permissão negada
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
