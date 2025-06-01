
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import Header from '@/components/safe-contact/Header';
import ContactList from '@/components/safe-contact/ContactList';
import AddContactForm from '@/components/safe-contact/AddContactForm';
import PremiumDialog from '@/components/safe-contact/PremiumDialog';
import { useSafeContacts } from '@/hooks/useSafeContacts';

const SafeContact = () => {
  const {
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
    isEditing,
  } = useSafeContacts();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Contatos de Segurança</h2>
          </div>
          
          <ContactList
            contacts={contacts}
            onEdit={handleEditContact}
            onRemove={handleRemoveContact}
            onAddNew={handleNewContactClick}
            premiumStatus={premiumStatus}
          />
        </Card>

        <Card className="p-6">
          <AddContactForm
            newContact={newContact}
            setNewContact={(contact) => {
              if (typeof contact === 'function') {
                setNewContact(prev => ({ ...prev, ...contact(prev) }));
              } else {
                setNewContact({ ...newContact, ...contact });
              }
            }}
            isAdding={isAdding}
            isEditing={isEditing}
            onAdd={handleAddContact}
            onCancel={() => {
              setIsAdding(false);
              setNewContact({
                id: "",
                name: "",
                telegramId: "",
                relationship: "Familiar"
              });
            }}
          />
        </Card>
      </div>

      <PremiumDialog
        isOpen={showPremiumDialog}
        onClose={() => setShowPremiumDialog(false)}
        onUpgrade={upgradeToPremium}
      />
    </div>
  );
};

export default SafeContact;
