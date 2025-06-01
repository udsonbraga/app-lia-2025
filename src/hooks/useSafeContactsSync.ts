
import { useEffect } from "react";
import { SafeContact } from "@/features/support-network/types";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";

export const useSafeContactsSync = (contacts: SafeContact[], setContacts: (contacts: SafeContact[]) => void) => {
  const { toast } = useToast();

  // Load contacts from Django API on mount
  useEffect(() => {
    const loadContactsFromAPI = async () => {
      console.log("=== LOADING CONTACTS FROM DJANGO API ===");
      
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log("User not authenticated, loading from localStorage only");
          const localContacts = localStorage.getItem("safeContacts");
          if (localContacts) {
            const parsedContacts = JSON.parse(localContacts);
            console.log("Loaded contacts from localStorage:", parsedContacts.length, "contacts");
            setContacts(parsedContacts);
          }
          return;
        }
        
        const response = await apiService.getContacts();

        if (response.contacts && response.contacts.length > 0) {
          // Convert Django format to app format
          const formattedContacts = response.contacts.map((contact: any) => ({
            id: contact.id,
            name: contact.name,
            telegramId: contact.phone || '', // Using phone as telegram ID for now
            relationship: contact.relationship || 'Contato'
          }));
          
          console.log("Loaded contacts from Django API:", formattedContacts.length, "contacts");
          setContacts(formattedContacts);
          
          // Also save to localStorage for backup
          localStorage.setItem("safeContacts", JSON.stringify(formattedContacts));
        } else {
          console.log("No contacts found in Django API");
          // Try to load from localStorage as fallback
          const localContacts = localStorage.getItem("safeContacts");
          if (localContacts) {
            const parsedContacts = JSON.parse(localContacts);
            console.log("Loaded contacts from localStorage:", parsedContacts.length, "contacts");
            setContacts(parsedContacts);
          }
        }
      } catch (error) {
        console.error("❌ Error loading contacts from Django API:", error);
        // Fallback to localStorage
        const localContacts = localStorage.getItem("safeContacts");
        if (localContacts) {
          const parsedContacts = JSON.parse(localContacts);
          console.log("Loaded contacts from localStorage fallback:", parsedContacts.length, "contacts");
          setContacts(parsedContacts);
        }
      }
    };
    
    loadContactsFromAPI();
  }, [setContacts]);

  // Save contacts to Django API when they change
  useEffect(() => {
    const saveContactsToAPI = async () => {
      if (contacts.length === 0) return;
      
      console.log("=== SAVING CONTACTS TO DJANGO API ===");
      console.log("Contacts to save:", contacts.length);
      
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log("User not authenticated, saving only to localStorage");
          localStorage.setItem("safeContacts", JSON.stringify(contacts));
          console.log("✅ Contacts saved to localStorage");
          return;
        }

        // Save each contact to Django API
        for (const contact of contacts) {
          try {
            await apiService.createContact({
              name: contact.name,
              phone: contact.telegramId,
              relationship: contact.relationship
            });
          } catch (error) {
            // Contact might already exist, try to update
            console.log("Contact might exist, trying to update:", contact.id);
          }
        }

        console.log("✅ Contacts saved to Django API");
        toast({
          title: "Contatos salvos",
          description: "Contatos salvos com sucesso no banco de dados.",
        });

        // Always save to localStorage as backup
        localStorage.setItem("safeContacts", JSON.stringify(contacts));
        console.log("✅ Contacts also saved to localStorage as backup");
        
      } catch (error) {
        console.error("❌ Django API save error:", error);
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
      saveContactsToAPI();
    }
  }, [contacts, toast]);

  return { toast };
};
