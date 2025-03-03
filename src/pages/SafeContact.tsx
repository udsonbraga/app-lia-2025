
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, List, UserPlus, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

interface SafeContact {
  name: string;
  number: string;
}

const MAX_CONTACTS = 3;

const SafeContact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContactsList, setShowContactsList] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [contacts, setContacts] = useState<SafeContact[]>([]);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Carregar dados salvos
  useEffect(() => {
    const savedContactName = localStorage.getItem("contactName");
    const savedContactNumber = localStorage.getItem("contactNumber");
    
    if (savedContactName) setContactName(savedContactName);
    if (savedContactNumber) setContactNumber(savedContactNumber);
    
    // Carregar lista de contatos
    const savedContacts = localStorage.getItem("safeContacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const formatPhoneNumber = (value: string) => {
    // Remove everything that's not a digit
    const cleaned = value.replace(/\D/g, "");
    
    // Format with Brazilian pattern
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const clearFormData = () => {
    setContactName("");
    setContactNumber("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar número de contatos
    if (contacts.length >= MAX_CONTACTS) {
      toast({
        title: "Limite de contatos atingido",
        description: `Você já cadastrou o máximo de ${MAX_CONTACTS} contatos seguros.`,
        variant: "destructive",
      });
      return;
    }
    
    // Criar novo contato
    const newContact: SafeContact = {
      name: contactName,
      number: contactNumber
    };
    
    // Adicionar à lista de contatos
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    
    // Salvar no localStorage
    localStorage.setItem("contactName", contactName);
    localStorage.setItem("contactNumber", contactNumber);
    localStorage.setItem("safeContacts", JSON.stringify(updatedContacts));
    
    toast({
      title: "Contato salvo",
      description: "O contato de emergência foi salvo com sucesso.",
    });

    // Mostrar tela de feedback
    setShowFeedback(true);
    setShowForm(false);
    
    // Limpar formulário imediatamente
    clearFormData();
  };

  const closeFeedback = () => {
    setShowFeedback(false);
  };

  const handleDone = () => {
    setShowFeedback(false);
    navigate('/');
  };

  const toggleContactsList = () => {
    setShowContactsList(!showContactsList);
    setShowForm(false);
  };

  const toggleContactForm = () => {
    setShowForm(!showForm);
    setShowContactsList(false);
  };

  const confirmDeleteContact = (index: number) => {
    setContactToDelete(index);
    setShowDeleteConfirmation(true);
  };

  const deleteContact = () => {
    if (contactToDelete !== null) {
      const updatedContacts = [...contacts];
      updatedContacts.splice(contactToDelete, 1);
      setContacts(updatedContacts);
      localStorage.setItem("safeContacts", JSON.stringify(updatedContacts));
      
      toast({
        title: "Contato excluído",
        description: "O contato foi excluído com sucesso.",
      });
      
      setShowDeleteConfirmation(false);
      setContactToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setContactToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm flex items-center px-4 z-50">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-center flex-1">Contato Seguro</h1>
        <div className="w-8" />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-16">
        {showFeedback ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 space-y-6 text-center animate-fade-in relative">
            <button 
              onClick={closeFeedback}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Contato Cadastrado!</h2>
            <p className="text-gray-600">
              Seu contato de emergência foi cadastrado com sucesso. Em caso de emergência, 
              este contato receberá sua localização e solicitação de ajuda via WhatsApp, Telegram e SMS.
            </p>
            <div className="flex flex-col space-y-3 mt-4">
              <Button onClick={handleDone}>
                Concluído
              </Button>
              <Button 
                variant="outline" 
                onClick={closeFeedback}
                className="border-safelady text-safelady hover:bg-safelady/10"
              >
                Continuar cadastrando
              </Button>
            </div>
          </div>
        ) : showDeleteConfirmation ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-bold text-gray-800 text-center">Confirmar exclusão</h2>
            <p className="text-gray-600 text-center">
              Tem certeza que deseja excluir este contato?
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Button variant="outline" onClick={cancelDelete}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={deleteContact}>
                Excluir
              </Button>
            </div>
          </div>
        ) : showContactsList ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Lista de Contatos Seguros</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleContactsList}
                className="text-safelady border-safelady hover:bg-safelady/10"
              >
                Voltar
              </Button>
            </div>
            
            {contacts.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Nenhum contato cadastrado</p>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">{contact.name}</h3>
                      <p className="text-gray-600">{contact.number}</p>
                    </div>
                    <button 
                      onClick={() => confirmDeleteContact(index)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex justify-center">
              <p className="text-sm text-gray-500">
                {contacts.length}/{MAX_CONTACTS} contatos cadastrados
              </p>
            </div>
          </div>
        ) : showForm ? (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Cadastrar Contato</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleContactForm}
                className="text-safelady border-safelady hover:bg-safelady/10"
              >
                Voltar
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome do Contato
                </label>
                <Input
                  type="text"
                  id="name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 w-full"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Número de Telefone
                </label>
                <div className="flex items-center mt-1">
                  <span className="bg-gray-100 border border-gray-300 px-3 py-2 rounded-l-md text-gray-700">
                    +55
                  </span>
                  <Input
                    type="tel"
                    id="phone"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(formatPhoneNumber(e.target.value))}
                    placeholder="(00) 00000-0000"
                    className="rounded-l-none"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Salvar Contato
              </Button>
            </form>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <Button 
                onClick={toggleContactForm}
                className="w-full flex items-center justify-center gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Cadastrar Contato Seguro
              </Button>
              
              <Button 
                variant="outline" 
                onClick={toggleContactsList}
                className="w-full flex items-center justify-center gap-2 text-safelady border-safelady hover:bg-safelady/10"
              >
                <List className="h-5 w-5" />
                Lista de Contatos
              </Button>
            </div>
            
            <div className="text-center text-gray-600 mt-6">
              <p className="text-sm">
                Cadastre até 3 contatos de confiança para receber sua localização e pedido de ajuda em caso de emergência via WhatsApp, Telegram e SMS.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafeContact;
