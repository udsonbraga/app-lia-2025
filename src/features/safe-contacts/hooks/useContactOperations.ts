
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

      // Usar UUID para o ID do contato
      const newContactWithId = {
        ...newContact,
        id: generateUUID(),
      };

      setContacts([...contacts, newContactWithId]);
      
      // Feedback mais detalhado ao adicionar contato
      toast({
        title: "Contato adicionado com sucesso!",
        description: `${newContact.name} foi adicionado(a) como seu contato de confiança. ${newContact.telegramId ? 'Alertas serão enviados via Telegram.' : 'Adicione um ID do Telegram para enviar alertas.'}`,
      });
      
      console.log("Novo contato adicionado:", newContactWithId);
      
      // Salvar automaticamente na nuvem se estiver logado
      const saveToSupabase = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          try {
            const { error } = await supabase
              .from('emergency_contacts')
              .insert({
                id: newContactWithId.id,
                user_id: session.user.id,
                name: newContactWithId.name,
                phone: newContactWithId.phone,
                telegram_id: newContactWithId.telegramId,
                is_primary: newContactWithId.relationship === 'Primário'
              });
            
            if (error) {
              console.error("Error saving contact to Supabase:", error);
              toast({
                title: "Erro ao sincronizar",
                description: "Não foi possível salvar o contato na nuvem. Verifique sua conexão.",
                variant: "destructive"
              });
            } else {
              toast({
                title: "Sincronizado com a nuvem",
                description: "Seu contato também foi salvo na sua conta para acesso em outros dispositivos.",
              });
            }
          } catch (error) {
            console.error("Error in Supabase operation:", error);
          }
        }
      };
      
      saveToSupabase();
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
    handleAddContact,
    handleEditContact,
    handleRemoveContact,
    handleNewContactClick,
    upgradeToPremium
  };
};

