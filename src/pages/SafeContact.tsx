
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { useSafeContacts } from "@/hooks/useSafeContacts";
import Header from "@/components/safe-contact/Header";
import ContactList from "@/components/safe-contact/ContactList";
import AddContactForm from "@/components/safe-contact/AddContactForm";
import PremiumDialog from "@/components/safe-contact/PremiumDialog";
import PasswordDialog from "@/components/safe-contact/PasswordDialog";

const SafeContactPage = () => {
  const navigate = useNavigate();
  const { isDisguised } = useDisguiseMode();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState("");
  
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
  } = useSafeContacts();

  const handleNavigateBack = () => {
    if (isDisguised) {
      setShowPasswordDialog(true);
    } else {
      navigate('/home');
    }
  };

  const handlePasswordSubmit = () => {
    const savedPassword = localStorage.getItem('disguisePassword');
    if (password === savedPassword) {
      navigate('/home');
    } else {
      useToast().toast({
        title: "Senha incorreta",
        description: "A senha fornecida não está correta.",
        variant: "destructive",
      });
    }
    setPassword("");
    setShowPasswordDialog(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-safelady-light to-white">
      <Header onBackClick={handleNavigateBack} />

      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-safelady" />
            <h2 className="text-xl font-bold text-gray-900">Contatos de Emergência</h2>
          </div>

          <p className="text-gray-600 mb-8">
            {premiumStatus.isPremium 
              ? `Adicione até ${premiumStatus.maxContacts} contatos de confiança que receberão alertas em situações de emergência.`
              : "Adicione 1 contato de confiança que receberá alertas em situações de emergência."}
          </p>

          <ContactList 
            contacts={contacts} 
            onRemoveContact={handleRemoveContact} 
          />

          {isAdding ? (
            <AddContactForm
              newContact={newContact}
              onNewContactChange={setNewContact}
              onAddContact={handleAddContact}
              onCancel={() => setIsAdding(false)}
            />
          ) : (
            <Button
              variant="outline"
              onClick={handleNewContactClick}
              className="w-full flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Adicionar Contato de Segurança
            </Button>
          )}
        </div>
      </div>

      <PremiumDialog 
        open={showPremiumDialog} 
        onOpenChange={setShowPremiumDialog} 
        onUpgradeToPremium={upgradeToPremium}
      />

      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        password={password}
        onPasswordChange={setPassword}
        onSubmit={handlePasswordSubmit}
      />
    </div>
  );
};

export default SafeContactPage;
