
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowLeft, CheckCircle2, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SafeContact {
  name: string;
  number: string;
  ssid: string;
  token: string;
}

const SafeContact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [ssid, setSsid] = useState("");
  const [token, setToken] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [showContactsList, setShowContactsList] = useState(false);
  const [contacts, setContacts] = useState<SafeContact[]>([]);

  // Carregar dados salvos
  useEffect(() => {
    const savedContactName = localStorage.getItem("contactName");
    const savedContactNumber = localStorage.getItem("contactNumber");
    const savedSsid = localStorage.getItem("contactSsid");
    const savedToken = localStorage.getItem("contactToken");
    
    if (savedContactName) setContactName(savedContactName);
    if (savedContactNumber) setContactNumber(savedContactNumber);
    if (savedSsid) setSsid(savedSsid);
    if (savedToken) setToken(savedToken);
    
    // Carregar lista de contatos
    const savedContacts = localStorage.getItem("safeContacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const clearFormData = () => {
    setContactName("");
    setContactNumber("");
    setSsid("");
    setToken("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar novo contato
    const newContact: SafeContact = {
      name: contactName,
      number: contactNumber,
      ssid,
      token
    };
    
    // Adicionar à lista de contatos
    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    
    // Salvar no localStorage
    localStorage.setItem("contactName", contactName);
    localStorage.setItem("contactNumber", contactNumber);
    localStorage.setItem("contactSsid", ssid);
    localStorage.setItem("contactToken", token);
    localStorage.setItem("safeContacts", JSON.stringify(updatedContacts));
    
    toast({
      title: "Contato salvo",
      description: "O contato de emergência foi salvo com sucesso.",
    });

    // Mostrar tela de feedback
    setShowFeedback(true);
    
    // Limpar formulário imediatamente
    clearFormData();
  };

  const handleDone = () => {
    setShowFeedback(false);
    navigate('/');
  };

  const toggleContactsList = () => {
    setShowContactsList(!showContactsList);
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
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8 space-y-6 text-center animate-fade-in">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Contato Cadastrado!</h2>
            <p className="text-gray-600">
              Seu contato de emergência foi cadastrado com sucesso. Em caso de emergência, 
              este contato receberá sua localização e solicitação de ajuda.
            </p>
            <Button onClick={handleDone} className="mt-6 w-full">
              Concluído
            </Button>
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
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800">{contact.name}</h3>
                    <p className="text-gray-600">{contact.number}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>SSID: {contact.ssid}</p>
                      <p>Token: {contact.token}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-6">
            <div className="flex justify-center">
              <Phone className="h-12 w-12 text-safelady" />
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleContactsList}
                className="text-safelady border-safelady hover:bg-safelady/10 mb-2"
              >
                <List className="mr-1 h-4 w-4" />
                Lista de Contatos
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nome do Contato
                </label>
                <input
                  type="text"
                  id="name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-safelady focus:ring-safelady"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Número de Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(formatPhoneNumber(e.target.value))}
                  placeholder="(00) 00000-0000"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-safelady focus:ring-safelady"
                  required
                />
              </div>

              <div>
                <label htmlFor="ssid" className="block text-sm font-medium text-gray-700">
                  SSID
                </label>
                <input
                  type="text"
                  id="ssid"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-safelady focus:ring-safelady"
                  required
                />
              </div>

              <div>
                <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                  Token
                </label>
                <input
                  type="text"
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-safelady focus:ring-safelady"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Salvar Contato
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafeContact;
