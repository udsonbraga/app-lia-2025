
import { useState } from "react";
import { SafeContact, UserPremiumStatus } from "@/features/support-network/types";

export const useContactState = () => {
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

  return {
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
  };
};
