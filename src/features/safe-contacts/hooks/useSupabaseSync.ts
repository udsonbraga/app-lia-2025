
import { useEffect } from "react";
import { SafeContact } from "@/features/support-network/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSupabaseSync = (contacts: SafeContact[], setContacts: (contacts: SafeContact[]) => void) => {
  const { toast } = useToast();

  // Sync contacts to Supabase when they change
  useEffect(() => {
    localStorage.setItem("safeContacts", JSON.stringify(contacts));
    
    // Try to save to Supabase if user is logged in
    const saveToSupabase = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        try {
          // For each contact, try to upsert to emergency_contacts table
          contacts.forEach(async (contact) => {
            const { error } = await supabase
              .from('emergency_contacts')
              .upsert({
                id: contact.id,
                user_id: session.user.id,
                name: contact.name,
                phone: contact.phone,
                telegram_id: contact.telegramId,
                is_primary: contact.relationship === 'Primário'
              });
            
            if (error) {
              console.error("Error saving contact to Supabase:", error);
            } else {
              console.log("Contact saved to Supabase successfully");
            }
          });
        } catch (error) {
          console.error("Error in Supabase operation:", error);
        }
      } else {
        console.log("User not logged in, contacts saved only to localStorage");
      }
    };
    
    saveToSupabase();
  }, [contacts]);

  // Load contacts from Supabase on mount
  useEffect(() => {
    const loadContactsFromSupabase = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        try {
          const { data, error } = await supabase
            .from('emergency_contacts')
            .select('*')
            .eq('user_id', session.user.id);
          
          if (error) {
            console.error("Error loading contacts from Supabase:", error);
          } else if (data && data.length > 0) {
            console.log("Contacts loaded from Supabase:", data);
            // Convert Supabase format to app format
            const formattedContacts = data.map(contact => ({
              id: contact.id,
              name: contact.name,
              phone: contact.phone,
              telegramId: contact.telegram_id || "",
              relationship: contact.is_primary ? "Primário" : "Secundário"
            }));
            setContacts(formattedContacts);
          }
        } catch (error) {
          console.error("Error in Supabase load operation:", error);
        }
      }
    };
    
    loadContactsFromSupabase();
  }, [setContacts]);

  return { toast };
};
