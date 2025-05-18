
import { useState, useEffect } from "react";
import { SafeContact, UserPremiumStatus } from "@/features/support-network/types";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useSafeContacts = () => {
  const { toast } = useToast();
  
  const [contacts, setContacts] = useState<SafeContact[]>(() => {
    const savedContacts = localStorage.getItem("safeContacts");
    return savedContacts ? JSON.parse(savedContacts) : [];
  });

  const [premiumStatus, setPremiumStatus] = useState<UserPremiumStatus>(() => {
    const savedStatus = localStorage.getItem("premiumStatus");
    return savedStatus ? JSON.parse(savedStatus) : { isPremium: false, maxContacts: 1 };
  });

  const [newContact, setNewContact] = useState<Omit<SafeContact, "id">>({
    name: "",
    phone: "",
    telegramId: "",
    relationship: "",
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  // Log the contacts whenever they change
  useEffect(() => {
    console.log("Safe contacts updated:", contacts);
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

  useEffect(() => {
    localStorage.setItem("premiumStatus", JSON.stringify(premiumStatus));
  }, [premiumStatus]);
  
  // Try to load contacts from Supabase on mount
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
  }, []);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o nome, telefone e parentesco para adicionar um contato.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && editingContactId) {
      // Update existing contact
      setContacts(contacts.map((contact) => 
        contact.id === editingContactId 
          ? { ...newContact, id: editingContactId } 
          : contact
      ));
      
      setIsEditing(false);
      setEditingContactId(null);
      
      toast({
        title: "Contato atualizado",
        description: "Contato de segurança atualizado com sucesso.",
      });
    } else {
      // Add new contact
      if (contacts.length >= premiumStatus.maxContacts) {
        setShowPremiumDialog(true);
        return;
      }

      const newContactWithId = {
        ...newContact,
        id: Date.now().toString(),
      };

      setContacts([...contacts, newContactWithId]);
      
      toast({
        title: "Contato adicionado",
        description: "Contato de segurança adicionado com sucesso.",
      });
      
      console.log("Novo contato adicionado:", newContactWithId);
    }

    // Reset form
    setNewContact({ 
      name: "", 
      phone: "", 
      telegramId: "", 
      relationship: "",
    });
    setIsAdding(false);
  };

  const handleEditContact = (contact: SafeContact) => {
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      telegramId: contact.telegramId,
      relationship: contact.relationship,
    });
    setEditingContactId(contact.id);
    setIsEditing(true);
    setIsAdding(true);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast({
      title: "Contato removido",
      description: "Contato de segurança removido com sucesso.",
    });
  };

  const handleNewContactClick = () => {
    if (contacts.length >= premiumStatus.maxContacts) {
      setShowPremiumDialog(true);
    } else {
      setIsAdding(true);
    }
  };

  const upgradeToPremium = () => {
    // Redirect to Google when premium subscription is clicked
    window.open("https://www.google.com", "_blank");
    setShowPremiumDialog(false);
    
    toast({
      title: "Redirecionando para assinatura Premium",
      description: "Você será redirecionado para concluir sua assinatura Premium.",
    });
  };

  return {
    contacts,
    premiumStatus,
    newContact,
    isAdding,
    isEditing,
    showPremiumDialog,
    setNewContact,
    setIsAdding,
    setShowPremiumDialog,
    handleAddContact,
    handleRemoveContact,
    handleNewContactClick,
    handleEditContact,
    upgradeToPremium,
  };
};
