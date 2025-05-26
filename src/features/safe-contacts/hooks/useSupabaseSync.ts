
import { useEffect } from "react";
import { SafeContact } from "@/features/support-network/types";
import { useToast } from "@/hooks/use-toast";

export const useSupabaseSync = (contacts: SafeContact[], setContacts: (contacts: SafeContact[]) => void) => {
  const { toast } = useToast();

  // Load contacts from localStorage on mount
  useEffect(() => {
    const loadContactsFromLocalStorage = () => {
      console.log("=== LOADING CONTACTS FROM LOCALSTORAGE ===");
      
      try {
        const localContacts = localStorage.getItem("safeContacts");
        if (localContacts) {
          const parsedContacts = JSON.parse(localContacts);
          console.log("Loaded contacts from localStorage:", parsedContacts.length, "contacts");
          setContacts(parsedContacts);
        } else {
          console.log("No contacts found in localStorage");
        }
      } catch (error) {
        console.error("❌ Error loading contacts from localStorage:", error);
      }
    };
    
    loadContactsFromLocalStorage();
  }, [setContacts]);

  // Save contacts to localStorage when they change
  useEffect(() => {
    console.log("=== SAVING CONTACTS TO LOCALSTORAGE ===");
    console.log("Contacts to save:", contacts.length);
    console.log("Contacts data:", contacts);
    
    // Save to localStorage
    localStorage.setItem("safeContacts", JSON.stringify(contacts));
    console.log("✅ Contacts saved to localStorage");
  }, [contacts]);

  return { toast };
};
