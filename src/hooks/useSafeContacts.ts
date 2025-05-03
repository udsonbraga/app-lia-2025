
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SafeContact } from '@/features/support-network/types';
import { getSafeContacts, addSafeContact, updateSafeContact, removeSafeContact } from '@/services/safeContactService';
import { useAuth } from '@/hooks/useAuth';

export const useSafeContacts = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [contacts, setContacts] = useState<SafeContact[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [premiumStatus, setPremiumStatus] = useState({
    isPremium: false,
    maxContacts: 1,
  });
  const [newContact, setNewContact] = useState<Omit<SafeContact, 'id'>>({
    name: '',
    phone: '',
    relationship: '',
    telegramId: '',
    twilioWhatsappNumber: undefined,
    twilioAccountSid: undefined,
    twilioAuthToken: undefined,
  });

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const fetchContacts = async () => {
    const result = await getSafeContacts();
    if (result.success) {
      setContacts(result.data || []);
    } else {
      toast({
        title: "Erro ao carregar contatos",
        description: "Não foi possível carregar seus contatos de segurança.",
        variant: "destructive"
      });
    }
  };

  const handleNewContactClick = () => {
    if (contacts.length >= premiumStatus.maxContacts) {
      setShowPremiumDialog(true);
      return;
    }
    setIsAdding(true);
    setIsEditing(false);
    setNewContact({
      name: '',
      phone: '',
      relationship: '',
      telegramId: '',
      twilioWhatsappNumber: undefined,
      twilioAccountSid: undefined,
      twilioAuthToken: undefined,
    });
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome e telefone são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && 'id' in newContact) {
        const result = await updateSafeContact(newContact as SafeContact);
        if (result.success) {
          setContacts(contacts.map(c => c.id === (newContact as SafeContact).id ? result.data : c));
          toast({
            title: "Contato atualizado",
            description: "As informações do contato foram atualizadas com sucesso.",
          });
        } else {
          throw new Error("Falha ao atualizar contato");
        }
      } else {
        const result = await addSafeContact(newContact);
        if (result.success) {
          setContacts([...contacts, result.data]);
          toast({
            title: "Contato adicionado",
            description: "Novo contato de segurança adicionado com sucesso.",
          });
        } else {
          throw new Error("Falha ao adicionar contato");
        }
      }
      
      setIsAdding(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao adicionar contato:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o contato. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleRemoveContact = async (id: string) => {
    try {
      const result = await removeSafeContact(id);
      if (result.success) {
        setContacts(contacts.filter(contact => contact.id !== id));
        toast({
          title: "Contato removido",
          description: "O contato foi removido com sucesso.",
        });
      } else {
        throw new Error("Falha ao remover contato");
      }
    } catch (error) {
      console.error('Erro ao remover contato:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o contato. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleEditContact = (contact: SafeContact) => {
    setNewContact(contact);
    setIsAdding(true);
    setIsEditing(true);
  };

  const upgradeToPremium = () => {
    // Implementar lógica de upgrade para premium (integração com pagamentos)
    setPremiumStatus({
      isPremium: true,
      maxContacts: 5,
    });
    setShowPremiumDialog(false);
    toast({
      title: "Conta atualizada para Premium",
      description: "Agora você pode adicionar até 5 contatos de segurança!",
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
    upgradeToPremium,
    handleEditContact,
  };
};
