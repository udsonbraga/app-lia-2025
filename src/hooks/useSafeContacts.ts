import { useState } from "react";
import { SafeContact } from "@/features/support-network/types";
import { useToast } from "@/hooks/use-toast";
import { useSafeContactsSync } from "./useSafeContactsSync";

interface PremiumStatus {
  isPremium: boolean;
  maxContacts: number;
}

interface EditState {
  isEditing: boolean;
  editingId: string | null;
}

export const useSafeContacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<SafeContact[]>([]);
  const [newContact, setNewContact] = useState<SafeContact>({
    id: "",
    name: "",
    telegramId: "",
    relationship: "Familiar"
  });
  const [isAdding, setIsAdding] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    maxContacts: 1
  });
  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    editingId: null
  });

  // Use the sync hook
  useSafeContactsSync(contacts, setContacts);

  const handleNewContactClick = () => {
    if (contacts.length >= premiumStatus.maxContacts && !premiumStatus.isPremium) {
      setShowPremiumDialog(true);
      return;
    }
    
    setNewContact({
      id: "",
      name: "",
      telegramId: "",
      relationship: "Familiar"
    });
    setIsAdding(true);
    setEditState({ isEditing: false, editingId: null });
  };

  const handleAddContact = () => {
    if (!newContact.name.trim() || !newContact.telegramId.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e ID do Telegram.",
        variant: "destructive",
      });
      return;
    }

    if (editState.isEditing && editState.editingId) {
      // Update existing contact
      setContacts(prev => prev.map(contact => 
        contact.id === editState.editingId 
          ? { ...newContact, id: contact.id }
          : contact
      ));
      
      toast({
        title: "Contato atualizado",
        description: `${newContact.name} foi atualizado com sucesso.`,
      });
    } else {
      // Add new contact
      const contactToAdd = {
        ...newContact,
        id: Date.now().toString()
      };
      
      setContacts(prev => [...prev, contactToAdd]);
      
      toast({
        title: "Contato adicionado",
        description: `${newContact.name} foi adicionado como contato de segurança.`,
      });
    }

    // Reset form
    setNewContact({
      id: "",
      name: "",
      telegramId: "",
      relationship: "Familiar"
    });
    setIsAdding(false);
    setEditState({ isEditing: false, editingId: null });
  };

  const handleRemoveContact = (id: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
    
    toast({
      title: "Contato removido",
      description: "O contato foi removido da sua lista de segurança.",
    });
  };

  const handleEditContact = (contact: SafeContact) => {
    setNewContact(contact);
    setIsAdding(true);
    setEditState({
      isEditing: true,
      editingId: contact.id
    });
  };

  const upgradeToPremium = () => {
    setPremiumStatus({
      isPremium: true,
      maxContacts: 5
    });
    
    toast({
      title: "Premium ativado! 🎉",
      description: "Agora você pode adicionar até 5 contatos de segurança.",
    });
    
    setShowPremiumDialog(false);
  };

  return {
    contacts,
    premiumStatus,
    newContact,
    isAdding,
    showPremiumDialog,
    setNewContact,
    setIsAdding,
    setShowPremiumDialog,
    handleAddContact,
    handleRemoveContact,
    handleNewContactClick,
    upgradeToPremium,
    handleEditContact,
    isEditing: editState.isEditing,
  };
};
