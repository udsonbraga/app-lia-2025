
import { useState, useEffect } from "react";
import { SafeContact } from "@/features/support-network/types";

export const useContactState = () => {
  const [contacts, setContacts] = useState<SafeContact[]>([]);
  const [premiumStatus, setPremiumStatus] = useState({
    isPremium: false,
    maxContacts: 1,
  });
  const [newContact, setNewContact] = useState<Omit<SafeContact, "id">>({
    name: "",
    telegramId: "",
    relationship: "",
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  useEffect(() => {
    const savedContacts = localStorage.getItem("safeContacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }

    const savedPremiumStatus = localStorage.getItem("premiumStatus");
    if (savedPremiumStatus) {
      setPremiumStatus(JSON.parse(savedPremiumStatus));
    }
  }, []);

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
