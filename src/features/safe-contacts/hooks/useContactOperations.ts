
import { SafeContact } from "@/features/support-network/types";
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
    
    if (!newContact.name || !newContact.relationship) {
      console.log("❌ Validation failed - missing fields");
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos o nome e parentesco para adicionar um contato.",
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
        title: "Contato atualizado com sucesso!",
        description: "As informações do contato foram atualizadas.",
      });
    } else {
      console.log("✅ Adding new contact");
      // Add new contact
      if (contacts.length >= premiumStatus.maxContacts) {
        console.log("❌ Premium limit reached");
        setShowPremiumDialog(true);
        return;
      }

      const newContactWithId = {
        ...newContact,
        id: crypto.randomUUID(),
      };

      console.log("New contact with ID:", newContactWithId);

      // Update local state and save to localStorage
      const updatedContacts = [...contacts, newContactWithId];
      setContacts(updatedContacts);
      localStorage.setItem("safeContacts", JSON.stringify(updatedContacts));
      
      console.log("✅ Contact added to local state and localStorage");
      
      toast({
        title: "Contato adicionado com sucesso!",
        description: "O contato de segurança foi cadastrado e está pronto para receber alertas de emergência.",
      });
    }

    // Reset form
    setNewContact({ 
      name: "", 
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
    
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    setContacts(updatedContacts);
    
    // Update localStorage
    localStorage.setItem("safeContacts", JSON.stringify(updatedContacts));
    
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
