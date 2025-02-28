
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, PhoneCall, Info, Building, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";

type SupportLocation = {
  id: string;
  name: string;
  type: "police" | "hospital" | "ngo";
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

const SupportNetwork = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"police" | "hospitals" | "ngos" | "rights">("police");
  const [selectedLocation, setSelectedLocation] = useState<SupportLocation | null>(null);

  // Localizações em Manaus-AM
  const supportLocations: SupportLocation[] = [
    {
      id: "1",
      name: "Delegacia Especializada em Crimes Contra a Mulher - DECCM",
      type: "police",
      address: "Av. Mário Ypiranga, 3395 - Parque 10 de Novembro, Manaus - AM",
      phone: "(92) 3236-7012",
      latitude: -3.0953,
      longitude: -60.0274
    },
    {
      id: "2",
      name: "Delegacia Especializada em Crimes Contra a Mulher - Zona Norte",
      type: "police",
      address: "Av. Arquiteto José Henriques, Conj. Manôa, Manaus - AM",
      phone: "(92) 3654-4226",
      latitude: -3.0312,
      longitude: -59.9857
    },
    {
      id: "3",
      name: "Hospital 28 de Agosto",
      type: "hospital",
      address: "Av. Mário Ypiranga, 1581 - Adrianópolis, Manaus - AM",
      phone: "(92) 3643-7100",
      latitude: -3.0908,
      longitude: -60.0212
    },
    {
      id: "4",
      name: "Hospital e Pronto Socorro João Lúcio",
      type: "hospital",
      address: "Av. Cosme Ferreira, 3937 - Coroado, Manaus - AM",
      phone: "(92) 3249-9100",
      latitude: -3.0734,
      longitude: -59.9484
    },
    {
      id: "5",
      name: "ONG Marias da Amazônia",
      type: "ngo",
      address: "Rua Ferreira Pena, 287 - Centro, Manaus - AM",
      phone: "(92) 3233-8249",
      latitude: -3.1297,
      longitude: -60.0234
    },
    {
      id: "6",
      name: "Centro de Referência Especializado de Assistência Social (CREAS)",
      type: "ngo",
      address: "Av. Presidente Kennedy, 1318 - Educandos, Manaus - AM",
      phone: "(92) 3214-2222",
      latitude: -3.1389,
      longitude: -60.0112
    },
  ];

  const filteredLocations = supportLocations.filter(location => {
    if (activeTab === "police") return location.type === "police";
    if (activeTab === "hospitals") return location.type === "hospital";
    if (activeTab === "ngos") return location.type === "ngo";
    return true;
  });

  const openMap = (location: SupportLocation) => {
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pb-16">
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm flex items-center px-4 z-50">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-semibold text-center flex-1">Rede de Apoio</h1>
        <div className="w-8" />
      </div>

      <div className="container mx-auto px-4 pt-20">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab("police")}
              className={`px-4 py-3 flex-1 text-sm font-medium flex flex-col items-center ${
                activeTab === "police" ? "bg-red-50 text-red-600" : "bg-white text-gray-600"
              }`}
            >
              <Building className="h-5 w-5 mb-1" />
              Delegacias
            </button>
            <button
              onClick={() => setActiveTab("hospitals")}
              className={`px-4 py-3 flex-1 text-sm font-medium flex flex-col items-center ${
                activeTab === "hospitals" ? "bg-red-50 text-red-600" : "bg-white text-gray-600"
              }`}
            >
              <Hospital className="h-5 w-5 mb-1" />
              Hospitais
            </button>
            <button
              onClick={() => setActiveTab("ngos")}
              className={`px-4 py-3 flex-1 text-sm font-medium flex flex-col items-center ${
                activeTab === "ngos" ? "bg-red-50 text-red-600" : "bg-white text-gray-600"
              }`}
            >
              <PhoneCall className="h-5 w-5 mb-1" />
              ONGs
            </button>
            <button
              onClick={() => setActiveTab("rights")}
              className={`px-4 py-3 flex-1 text-sm font-medium flex flex-col items-center ${
                activeTab === "rights" ? "bg-red-50 text-red-600" : "bg-white text-gray-600"
              }`}
            >
              <Info className="h-5 w-5 mb-1" />
              Seus Direitos
            </button>
          </div>
        </div>

        {activeTab !== "rights" ? (
          <div className="space-y-4">
            {filteredLocations.map((location) => (
              <div
                key={location.id}
                className="bg-white rounded-lg shadow-md p-4 animate-fade-in"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800">{location.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                    <p className="text-sm text-gray-600 mt-1">{location.phone}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-1 text-red-500 border-red-200"
                    onClick={() => openMap(location)}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Navegar</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Seus Direitos</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800">Lei Maria da Penha</h3>
                <p className="text-sm text-gray-600 mt-1">
                  A Lei Maria da Penha (Lei nº 11.340/2006) cria mecanismos para prevenir e coibir a violência doméstica e familiar contra a mulher.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Tipos de Violência</h3>
                <ul className="text-sm text-gray-600 mt-1 list-disc pl-5 space-y-1">
                  <li>Violência física</li>
                  <li>Violência psicológica</li>
                  <li>Violência sexual</li>
                  <li>Violência patrimonial</li>
                  <li>Violência moral</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Como Buscar Ajuda</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Ligue para o 180 - Central de Atendimento à Mulher, um serviço gratuito e confidencial.
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Procure uma delegacia da mulher mais próxima ou, em caso de emergência, ligue para o 190.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800">Medidas Protetivas</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Você tem direito a solicitar medidas protetivas de urgência, como o afastamento do agressor do lar e proibição de aproximação.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportNetwork;
