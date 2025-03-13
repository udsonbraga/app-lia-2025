
import { useState, useEffect } from "react";
import { SafeContact, UserPremiumStatus } from "@/features/support-network/types";
import { useToast } from "@/hooks/use-toast";

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
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioWhatsappNumber: "",
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  useEffect(() => {
    localStorage.setItem("safeContacts", JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem("premiumStatus", JSON.stringify(premiumStatus));
  }, [premiumStatus]);

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
    }

    // Reset form
    setNewContact({ 
      name: "", 
      phone: "", 
      telegramId: "", 
      relationship: "",
      twilioAccountSid: "",
      twilioAuthToken: "",
      twilioWhatsappNumber: "", 
    });
    setIsAdding(false);
  };

  const handleEditContact = (contact: SafeContact) => {
    setNewContact({
      name: contact.name,
      phone: contact.phone,
      telegramId: contact.telegramId,
      relationship: contact.relationship,
      twilioAccountSid: contact.twilioAccountSid || "",
      twilioAuthToken: contact.twilioAuthToken || "",
      twilioWhatsappNumber: contact.twilioWhatsappNumber || "",
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
