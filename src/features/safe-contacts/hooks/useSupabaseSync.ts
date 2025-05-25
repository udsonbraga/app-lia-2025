
import { useEffect } from "react";
import { SafeContact } from "@/features/support-network/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export const useSupabaseSync = (contacts: SafeContact[], setContacts: (contacts: SafeContact[]) => void) => {
  const { toast } = useToast();
  const { user, session } = useAuth();

  // Load contacts from Supabase on mount
  useEffect(() => {
    const loadContactsFromSupabase = async () => {
      console.log("=== LOADING CONTACTS FROM SUPABASE ===");
      console.log("Auth state:", { hasUser: !!user, hasSession: !!session, userId: user?.id });
      
      try {
        if (session?.user?.id) {
          console.log("User authenticated, loading contacts from Supabase...");
          
          const { data, error } = await supabase
            .from('emergency_contacts')
            .select('*')
            .eq('user_id', session.user.id);
          
          if (error) {
            console.error("Error loading contacts from Supabase:", error);
            toast({
              title: "Erro ao carregar contatos",
              description: "Não foi possível carregar seus contatos da nuvem.",
              variant: "destructive"
            });
          } else if (data && data.length > 0) {
            console.log("Contacts loaded from Supabase:", data.length, "contacts");
            // Convert Supabase format to app format
            const formattedContacts = data.map(contact => ({
              id: contact.id,
              name: contact.name,
              phone: contact.phone,
              telegramId: contact.telegram_id || "",
              relationship: contact.is_primary ? "Primário" : "Secundário"
            }));
            setContacts(formattedContacts);
            
            toast({
              title: "Contatos sincronizados",
              description: `${data.length} contato(s) carregado(s) da nuvem.`,
            });
          } else {
            console.log("No contacts found in Supabase, checking localStorage...");
            // Se não há contatos no Supabase, carregar do localStorage
            const localContacts = localStorage.getItem("safeContacts");
            if (localContacts) {
              const parsedContacts = JSON.parse(localContacts);
              console.log("Loaded contacts from localStorage:", parsedContacts.length, "contacts");
              setContacts(parsedContacts);
            }
          }
        } else {
          console.log("User not authenticated, loading from localStorage only");
          // User not logged in, load from localStorage
          const localContacts = localStorage.getItem("safeContacts");
          if (localContacts) {
            const parsedContacts = JSON.parse(localContacts);
            console.log("Loaded contacts from localStorage (not authenticated):", parsedContacts.length, "contacts");
            setContacts(parsedContacts);
          }
          
          toast({
            title: "Modo offline",
            description: "Você não está logado. Para sincronizar seus contatos com a nuvem, faça login.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error in loadContactsFromSupabase:", error);
        // Fallback to localStorage on error
        const localContacts = localStorage.getItem("safeContacts");
        if (localContacts) {
          const parsedContacts = JSON.parse(localContacts);
          setContacts(parsedContacts);
        }
      }
    };
    
    loadContactsFromSupabase();
  }, [user, session, setContacts, toast]);

  // Sync contacts to Supabase when they change
  useEffect(() => {
    console.log("=== SYNCING CONTACTS ===");
    console.log("Contacts to sync:", contacts.length);
    console.log("Auth state for sync:", { hasUser: !!user, hasSession: !!session, userId: user?.id });
    
    // Always save to localStorage first
    localStorage.setItem("safeContacts", JSON.stringify(contacts));
    
    // Try to save to Supabase if user is logged in
    const saveToSupabase = async () => {
      try {
        if (session?.user?.id) {
          console.log("User authenticated, syncing to Supabase...");
          
          // Para cada contato, tente atualizar na tabela emergency_contacts
          for (const contact of contacts) {
            // Verificar se o ID do contato é um UUID válido
            if (contact.id && contact.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)) {
              console.log("Syncing contact to Supabase:", contact.id, contact.name);
              
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
                console.log("Contact saved to Supabase successfully:", contact.id);
              }
            } else {
              console.warn("Skipping contact with invalid UUID:", contact.id);
            }
          }
          
          if (contacts.length > 0) {
            toast({
              title: "Contatos sincronizados",
              description: "Seus contatos foram salvos na nuvem com sucesso.",
            });
          }
        } else {
          console.log("User not logged in, contacts saved only to localStorage");
        }
      } catch (error) {
        console.error("Error in Supabase sync operation:", error);
      }
    };
    
    // Only sync if there are contacts to sync
    if (contacts.length > 0) {
      saveToSupabase();
    }
  }, [contacts, user, session, toast]);

  return { toast };
};
