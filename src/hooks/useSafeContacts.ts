
import { useContactState } from "@/features/safe-contacts/hooks/useContactState";
import { useSupabaseSync } from "@/features/safe-contacts/hooks/useSupabaseSync";
import { useContactOperations } from "@/features/safe-contacts/hooks/useContactOperations";

export const useSafeContacts = () => {
  const {
    contacts,
    setContacts,
    premiumStatus,
    setPremiumStatus,
    newContact,
    setNewContact,
    isAdding,
    setIsAdding,
    isEditing,
    setIsEditing,
    editingContactId,
    setEditingContactId,
    showPremiumDialog,
    setShowPremiumDialog
  } = useContactState();

  const { toast } = useSupabaseSync(contacts, setContacts);

  const {
    handleAddContact,
    handleEditContact,
    handleRemoveContact,
    handleNewContactClick,
    upgradeToPremium
  } = useContactOperations({
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
  });

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
