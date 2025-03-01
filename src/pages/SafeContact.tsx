
import { useState, useEffect } from "react";
import { DrawerMenu } from "@/components/DrawerMenu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SafeContact = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [contactNumber, setContactNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [ssid, setSsid] = useState("");
  const [token, setToken] = useState("");

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
  }, []);

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salvar no localStorage
    localStorage.setItem("contactName", contactName);
    localStorage.setItem("contactNumber", contactNumber);
    localStorage.setItem("contactSsid", ssid);
    localStorage.setItem("contactToken", token);
    
    toast({
      title: "Contato salvo",
      description: "O contato de emergência foi salvo com sucesso.",
    });
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
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          <div className="flex justify-center">
            <Phone className="h-12 w-12 text-red-500" />
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-500 focus:ring-red-500"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Salvar Contato
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SafeContact;
