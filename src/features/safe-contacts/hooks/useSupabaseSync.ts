
import { useEffect } from "react";
import { SafeContact } from "@/features/support-network/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSupabaseSync = (contacts: SafeContact[], setContacts: (contacts: SafeContact[]) => void) => {
  const { toast } = useToast();

  // Load contacts from database on mount
  useEffect(() => {
    const loadContactsFromDatabase = async () => {
      console.log("=== LOADING CONTACTS FROM DATABASE ===");
      
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log("User not authenticated, loading from localStorage only");
          // Load from localStorage as fallback
          const localContacts = localStorage.getItem("safeContacts");
          if (localContacts) {
            const parsedContacts = JSON.parse(localContacts);
            console.log("Loaded contacts from localStorage:", parsedContacts.length, "contacts");
            setContacts(parsedContacts);
          }
          return;
        }
        
        const { data, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error loading contacts from database:", error);
          // Fallback to localStorage if database fails
          const localContacts = localStorage.getItem("safeContacts");
          if (localContacts) {
            const parsedContacts = JSON.parse(localContacts);
            console.log("Loaded contacts from localStorage fallback:", parsedContacts.length, "contacts");
            setContacts(parsedContacts);
          }
          return;
        }

        if (data && data.length > 0) {
          // Convert database format to app format
          const formattedContacts = data.map(contact => ({
            id: contact.id,
            name: contact.name,
            phone: contact.phone,
            telegramId: contact.telegram_id || '',
            relationship: 'Contato' // Default relationship since it's not in the database schema
          }));
          
          console.log("Loaded contacts from database:", formattedContacts.length, "contacts");
          setContacts(formattedContacts);
          
          // Also save to localStorage for backup
          localStorage.setItem("safeContacts", JSON.stringify(formattedContacts));
        } else {
          console.log("No contacts found in database");
          // Try to load from localStorage as fallback
          const localContacts = localStorage.getItem("safeContacts");
          if (localContacts) {
            const parsedContacts = JSON.parse(localContacts);
            console.log("Loaded contacts from localStorage:", parsedContacts.length, "contacts");
            setContacts(parsedContacts);
          }
        }
      } catch (error) {
        console.error("❌ Error loading contacts from database:", error);
        // Fallback to localStorage
        const localContacts = localStorage.getItem("safeContacts");
        if (localContacts) {
          const parsedContacts = JSON.parse(localContacts);
          console.log("Loaded contacts from localStorage fallback:", parsedContacts.length, "contacts");
          setContacts(parsedContacts);
        }
      }
    };
    
    loadContactsFromDatabase();
  }, [setContacts]);

  // Save contacts to database when they change
  useEffect(() => {
    const saveContactsToDatabase = async () => {
      if (contacts.length === 0) return;
      
      console.log("=== SAVING CONTACTS TO DATABASE ===");
      console.log("Contacts to save:", contacts.length);
      
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log("User not authenticated, saving only to localStorage");
          localStorage.setItem("safeContacts", JSON.stringify(contacts));
          console.log("✅ Contacts saved to localStorage");
          return;
        }

        // First, delete all existing contacts for this user to avoid duplicates
        await supabase
          .from('emergency_contacts')
          .delete()
          .eq('user_id', session.user.id);

        // Then insert the new contacts
        const contactsToInsert = contacts.map(contact => ({
          id: contact.id,
          name: contact.name,
          phone: contact.phone,
          telegram_id: contact.telegramId,
          user_id: session.user.id // Use the actual authenticated user's ID
        }));

        const { error } = await supabase
          .from('emergency_contacts')
          .insert(contactsToInsert);

        if (error) {
          console.error("❌ Error saving contacts to database:", error);
          toast({
            title: "Erro ao salvar",
            description: "Não foi possível salvar os contatos no banco de dados. Salvando localmente.",
            variant: "destructive",
          });
        } else {
          console.log("✅ Contacts saved to database");
          toast({
            title: "Contatos salvos",
            description: "Contatos salvos com sucesso no banco de dados.",
          });
        }

        // Always save to localStorage as backup
        localStorage.setItem("safeContacts", JSON.stringify(contacts));
        console.log("✅ Contacts also saved to localStorage as backup");
        
      } catch (error) {
        console.error("❌ Database save error:", error);
        localStorage.setItem("safeContacts", JSON.stringify(contacts));
        console.log("✅ Contacts saved to localStorage as fallback");
        
        toast({
          title: "Salvando localmente",
          description: "Contatos salvos localmente devido a erro na conexão.",
          variant: "destructive",
        });
      }
    };

    // Only save if we have contacts (avoid saving empty array on initial load)
    if (contacts.length > 0) {
      saveContactsToDatabase();
    }
  }, [contacts, toast]);

  return { toast };
};
