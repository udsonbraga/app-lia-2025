
import { SupportLocation } from "./types";

// Localizações em Manaus-AM
export const supportLocations: SupportLocation[] = [
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

export const getFilteredLocations = (activeTab: string) => {
  return supportLocations.filter(location => {
    if (activeTab === "police") return location.type === "police";
    if (activeTab === "hospitals") return location.type === "hospital";
    if (activeTab === "ngos") return location.type === "ngo";
    return true;
  });
};

export const openMap = (location: SupportLocation) => {
  const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
  window.open(mapUrl, '_blank');
};
