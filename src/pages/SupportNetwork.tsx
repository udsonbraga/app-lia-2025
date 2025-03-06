
import { useState } from "react";
import { openMap } from "@/features/support-network/data";
import { ActiveTab, SupportLocation } from "@/features/support-network/types";
import Header from "@/components/support-network/Header";
import TabNavigation from "@/components/support-network/TabNavigation";
import LocationCard from "@/components/support-network/LocationCard";
import RightsInformation from "@/components/support-network/RightsInformation";

// Mock data for the support locations since getSupportLocationsWithMapUrl is missing
const mockSupportLocations: Record<Exclude<ActiveTab, "rights">, SupportLocation[]> = {
  police: [
    {
      id: "1",
      name: "Delegacia da Mulher - Centro",
      type: "police",
      address: "Rua das Flores, 123 - Centro",
      phone: "(11) 3333-1111",
      latitude: -23.5505,
      longitude: -46.6333,
      mapUrl: "https://maps.google.com/?q=-23.5505,-46.6333"
    },
    {
      id: "2",
      name: "1ª Delegacia de Polícia",
      type: "police",
      address: "Av. Paulista, 1000 - Bela Vista",
      phone: "(11) 3333-2222",
      latitude: -23.5653,
      longitude: -46.6488,
      mapUrl: "https://maps.google.com/?q=-23.5653,-46.6488"
    }
  ],
  hospitals: [
    {
      id: "3",
      name: "Hospital das Clínicas",
      type: "hospital",
      address: "Av. Dr. Enéas de Carvalho Aguiar, 255",
      phone: "(11) 2661-0000",
      latitude: -23.5574,
      longitude: -46.6686,
      mapUrl: "https://maps.google.com/?q=-23.5574,-46.6686"
    },
    {
      id: "4",
      name: "Hospital Sírio-Libanês",
      type: "hospital",
      address: "Rua Dona Adma Jafet, 91",
      phone: "(11) 3394-5000",
      latitude: -23.5575,
      longitude: -46.6539,
      mapUrl: "https://maps.google.com/?q=-23.5575,-46.6539"
    }
  ],
  ngos: [
    {
      id: "5",
      name: "Casa da Mulher Brasileira",
      type: "ngo",
      address: "Rua dos Direitos, 99",
      phone: "(11) 3311-9999",
      latitude: -23.5400,
      longitude: -46.6400,
      mapUrl: "https://maps.google.com/?q=-23.5400,-46.6400"
    },
    {
      id: "6",
      name: "ONG Mulheres Unidas",
      type: "ngo",
      address: "Av. da Liberdade, 1500",
      phone: "(11) 3399-8888",
      latitude: -23.5500,
      longitude: -46.6350,
      mapUrl: "https://maps.google.com/?q=-23.5500,-46.6350"
    }
  ]
};

// Function to replace the missing imported function
const getSupportLocationsWithMapUrl = (tab: ActiveTab): SupportLocation[] => {
  if (tab === "rights") return [];
  return mockSupportLocations[tab];
};

const SupportNetwork = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("police");
  const locationsData = getSupportLocationsWithMapUrl(activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-b from-safelady-light to-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-20 pb-20">
        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {activeTab === "rights" ? (
          <RightsInformation />
        ) : (
          <div className="space-y-4">
            {locationsData.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportNetwork;
