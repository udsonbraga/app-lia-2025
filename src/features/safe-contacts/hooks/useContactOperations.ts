
import { SafeContact } from "@/features/support-network/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactOperationsProps {
  contacts: SafeContact[];
  setContacts: (contacts: SafeContact[]) => void;
  newContact: Omit<SafeContact, "id">;
  setNewContact: (contact: Omit<SafeContact, "id">) => void;
  isEditing: boolean;
  editingContactId: string | null;
  setIsEditing: (isEditing: boolean) => void;
  setEditingContactId: (id: string | null) => void;
  setIsAdding: (isAdding: boolean) => void;
  premiumStatus: { isPremium: boolean; maxContacts: number };
  setShowPremiumDialog: (show: boolean) => void;
}

// Função auxiliar para gerar UUIDs compatíveis com Supabase
const generateUUID = () => {
  return crypto.randomUUID();
};

export const useContactOperations = ({
  contacts,
  setContacts,
  newContact,
  setNewContact,
  isEditing,
  editingContactId,
  setIsEditing,
  setEditingContactId,
  setIsAdding,
  premiumStatus,
  setShowPremiumDialog
}: ContactOperationsProps) => {
  const { toast } = useToast();

  const handleAddContact = async () => {
    console.log("=== HANDLE ADD CONTACT ===");
    console.log("New contact data:", newContact);
    console.log("Is editing:", isEditing);
    console.log("Editing contact ID:", editingContactId);
    
    if (!newContact.name || !newContact.phone || !newContact.relationship) {
      console.log("❌ Validation failed - missing fields");
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o nome, telefone e parentesco para adicionar um contato.",
        variant: "destructive",
      });
      return;
    }

    if (isEditing && editingContactId) {
      console.log("✅ Updating existing contact");
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
      console.log("✅ Adding new contact");
      // Add new contact
      if (contacts.length >= premiumStatus.maxContacts) {
        console.log("❌ Premium limit reached");
        setShowPremiumDialog(true);
        return;
      }

      // Usar UUID para o ID do contato
      const newContactWithId = {
        ...newContact,
        id: generateUUID(),
      };

      console.log("New contact with ID:", newContactWithId);

      setContacts([...contacts, newContactWithId]);
      
      // Feedback mais detalhado ao adicionar contato
      toast({
        title: "Contato adicionado com sucesso!",
        description: `${newContact.name} foi adicionado(a) como seu contato de confiança. ${newContact.telegramId ? 'Alertas serão enviados via Telegram.' : 'Adicione um ID do Telegram para enviar alertas.'}`,
      });
      
      console.log("✅ Contact added to local state, now saving to Supabase...");
      
      // Salvar automaticamente na nuvem se estiver logado
      const saveToSupabase = async () => {
        console.log("=== SAVING TO SUPABASE ===");
        
        try {
          console.log("Checking authentication...");
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          console.log("Session check result:", { 
            hasSession: !!session, 
            userId: session?.user?.id, 
            sessionError 
          });
          
          if (session?.user?.id) {
            console.log("✅ User is authenticated, proceeding with Supabase save");
            console.log("User ID:", session.user.id);
            
            const contactData = {
              id: newContactWithId.id,
              user_id: session.user.id,
              name: newContactWithId.name,
              phone: newContactWithId.phone,
              telegram_id: newContactWithId.telegramId || null,
              is_primary: newContactWithId.relationship === 'Primário'
            };
            
            console.log("Contact data to insert:", contactData);
            
            const { data, error } = await supabase
              .from('emergency_contacts')
              .insert(contactData);
            
            console.log("Supabase insert result:", { data, error });
            
            if (error) {
              console.error("❌ Error saving contact to Supabase:", error);
              console.error("Error details:", error.message, error.code, error.details);
              toast({
                title: "Erro ao sincronizar",
                description: "Não foi possível salvar o contato na nuvem. Verifique sua conexão.",
                variant: "destructive"
              });
            } else {
              console.log("✅ Contact saved successfully to Supabase!");
              toast({
                title: "Sincronizado com a nuvem",
                description: "Seu contato também foi salvo na sua conta para acesso em outros dispositivos.",
              });
            }
          } else {
            console.log("❌ User not authenticated, contact only saved locally");
            console.log("Session details:", { session, hasUser: !!session?.user });
            toast({
              title: "Contato salvo localmente",
              description: "Para sincronizar com a nuvem, faça login na sua conta.",
              variant: "default"
            });
          }
        } catch (error) {
          console.error("❌ Error in Supabase save operation:", error);
          console.error("Full error details:", error);
          toast({
            title: "Erro na sincronização",
            description: "Houve um problema ao salvar na nuvem, mas o contato foi salvo localmente.",
            variant: "destructive"
          });
        }
      };
      
      // Execute save to Supabase
      await saveToSupabase();
    }

    // Reset form
    setNewContact({ 
      name: "", 
      phone: "", 
      telegramId: "", 
      relationship: "",
    });
    setIsAdding(false);
    
    console.log("=== ADD CONTACT COMPLETED ===");
  };

  const handleEditContact = (contact: SafeContact) => {
    console.log("=== EDIT CONTACT ===");
    console.log("Contact to edit:", contact);
    
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
    console.log("=== REMOVE CONTACT ===");
    console.log("Contact ID to remove:", id);
    
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast({
      title: "Contato removido",
      description: "Contato de segurança removido com sucesso.",
    });
  };

  const handleNewContactClick = () => {
    console.log("=== NEW CONTACT CLICK ===");
    console.log("Current contacts count:", contacts.length);
    console.log("Max contacts allowed:", premiumStatus.maxContacts);
    
    if (contacts.length >= premiumStatus.maxContacts) {
      console.log("❌ Premium limit reached, showing premium dialog");
      setShowPremiumDialog(true);
    } else {
      console.log("✅ Adding new contact allowed");
      setIsAdding(true);
    }
  };

  const upgradeToPremium = () => {
    console.log("=== UPGRADE TO PREMIUM ===");
    // Redirect to Google when premium subscription is clicked
    window.open("https://www.google.com", "_blank");
    setShowPremiumDialog(false);
    
    toast({
      title: "Redirecionando para assinatura Premium",
      description: "Você será redirecionado para concluir sua assinatura Premium.",
    });
  };

  return {
    handleAddContact,
    handleEditContact,
    handleRemoveContact,
    handleNewContactClick,
    upgradeToPremium
  };
};
