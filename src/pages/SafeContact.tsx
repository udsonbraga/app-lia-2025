
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, User, Phone, MessageSquare, Trash2, UserPlus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Contact {
  id: string;
  name: string;
  phone: string;
  telegramId: string;
  relationship: string;
}

const SafeContact = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const savedContacts = localStorage.getItem("safeContacts");
    return savedContacts ? JSON.parse(savedContacts) : [];
  });

  const [newContact, setNewContact] = useState<Omit<Contact, "id">>({
    name: "",
    phone: "",
    telegramId: "",
    relationship: "",
  });

  const [isAdding, setIsAdding] = useState(false);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  useEffect(() => {
    localStorage.setItem("safeContacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone || !newContact.telegramId || !newContact.relationship) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos para adicionar um contato.",
        variant: "destructive",
      });
      return;
    }

    if (contacts.length >= 1) {
      setShowPremiumDialog(true);
      return;
    }

    const newContactWithId = {
      ...newContact,
      id: Date.now().toString(),
    };

    setContacts([...contacts, newContactWithId]);
    setNewContact({ name: "", phone: "", telegramId: "", relationship: "" });
    setIsAdding(false);

    toast({
      title: "Contato adicionado",
      description: "Contato de segurança adicionado com sucesso.",
    });
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast({
      title: "Contato removido",
      description: "Contato de segurança removido com sucesso.",
    });
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-safelady-light to-white">
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold">Contatos de Segurança</h1>
            <div className="w-8" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-safelady" />
            <h2 className="text-xl font-bold text-gray-900">Contatos de Emergência</h2>
          </div>

          <p className="text-gray-600 mb-8">
            Adicione 1 contato de confiança que receberá alertas em
            situações de emergência.
          </p>

          {contacts.length > 0 ? (
            <div className="space-y-4 mb-8">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-safelady" />
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Phone className="h-3 w-3 mr-2 text-gray-400" />
                      {contact.phone}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MessageSquare className="h-3 w-3 mr-2 text-gray-400" />
                      Telegram: @{contact.telegramId}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="text-gray-500">Parentesco:</span> {contact.relationship}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="p-1 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 mb-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">
                Você ainda não adicionou contatos de segurança.
              </p>
            </div>
          )}

          {isAdding ? (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">Adicionar Novo Contato</h3>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Nome</label>
                <Input
                  placeholder="Nome do contato"
                  value={newContact.name}
                  onChange={(e) =>
                    setNewContact({ ...newContact, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Telefone
                </label>
                <Input
                  placeholder="(00) 00000-0000"
                  value={newContact.phone}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      phone: formatPhone(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  ID do Telegram
                </label>
                <Input
                  placeholder="username (sem @)"
                  value={newContact.telegramId}
                  onChange={(e) =>
                    setNewContact({
                      ...newContact,
                      telegramId: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Parentesco
                </label>
                <Select
                  value={newContact.relationship}
                  onValueChange={(value) =>
                    setNewContact({
                      ...newContact,
                      relationship: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pai">Pai</SelectItem>
                    <SelectItem value="Mãe">Mãe</SelectItem>
                    <SelectItem value="Irmão/Irmã">Irmão/Irmã</SelectItem>
                    <SelectItem value="Tio/Tia">Tio/Tia</SelectItem>
                    <SelectItem value="Amigo/Amiga">Amigo/Amiga</SelectItem>
                    <SelectItem value="Outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddContact}>Adicionar Contato</Button>
              </div>
            </div>
          ) : (
            contacts.length < 1 && (
              <Button
                variant="outline"
                onClick={() => setIsAdding(true)}
                className="w-full flex items-center justify-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Adicionar Contato de Segurança
              </Button>
            )
          )}
        </div>
      </div>

      {/* Premium Dialog */}
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Plano Premium Necessário</DialogTitle>
            <DialogDescription className="text-center">
              Para adicionar mais contatos de segurança, é necessário adquirir o plano premium do Safe Lady.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 space-y-4">
            <Shield className="h-16 w-16 text-amber-500" />
            <p className="text-center">
              Com o plano premium você poderá adicionar até 5 contatos de segurança, 
              além de ter acesso a recursos exclusivos.
            </p>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center">
            <Button onClick={() => setShowPremiumDialog(false)}>
              Entendi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SafeContact;
