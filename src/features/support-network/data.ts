
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
    name: "Delegacia Especializada em Crimes Contra a Mulher - Zona Leste",
    type: "police",
    address: "Av. Autaz Mirim, s/n - Tancredo Neves, Manaus - AM",
    phone: "(92) 3648-7592",
    latitude: -3.0587,
    longitude: -59.9407
  },
  {
    id: "4",
    name: "1ª Delegacia Especializada em Homicídios e Sequestros",
    type: "police",
    address: "Av. Duque de Caxias, s/n - Praça 14 de Janeiro, Manaus - AM",
    phone: "(92) 3634-6178",
    latitude: -3.1295,
    longitude: -60.0158
  },
  {
    id: "5",
    name: "Hospital 28 de Agosto",
    type: "hospital",
    address: "Av. Mário Ypiranga, 1581 - Adrianópolis, Manaus - AM",
    phone: "(92) 3643-7100",
    latitude: -3.1001,
    longitude: -60.0108
  },
  {
    id: "6",
    name: "Hospital e Pronto Socorro João Lúcio",
    type: "hospital",
    address: "Av. Cosme Ferreira, 3937 - Coroado, Manaus - AM",
    phone: "(92) 3249-9100",
    latitude: -3.0703,
    longitude: -59.9439
  },
  {
    id: "7",
    name: "Hospital e Pronto Socorro Dr. Aristóteles Platão Bezerra de Araújo",
    type: "hospital",
    address: "Av. Autaz Mirim, 7602 - São José Operário, Manaus - AM",
    phone: "(92) 3647-1081",
    latitude: -3.0375,
    longitude: -59.9336
  },
  {
    id: "8",
    name: "UPA 24h Campos Sales",
    type: "hospital",
    address: "Rua Dona Otília, s/n - Tarumã, Manaus - AM",
    phone: "(92) 3215-2500",
    latitude: -3.0155,
    longitude: -60.0453
  },
  {
    id: "9",
    name: "UPA 24h José Rodrigues",
    type: "hospital",
    address: "Av. Camapuã, 1424 - Cidade Nova, Manaus - AM",
    phone: "(92) 3641-8011",
    latitude: -3.0258,
    longitude: -59.9634
  },
  {
    id: "10",
    name: "ONG Marias da Amazônia",
    type: "ngo",
    address: "Rua Ferreira Pena, 287 - Centro, Manaus - AM",
    phone: "(92) 3233-8249",
    latitude: -3.1297,
    longitude: -60.0234
  },
  {
    id: "11",
    name: "Centro de Referência Especializado de Assistência Social (CREAS)",
    type: "ngo",
    address: "Av. Presidente Kennedy, 1318 - Educandos, Manaus - AM",
    phone: "(92) 3214-2222",
    latitude: -3.1389,
    longitude: -60.0112
  },
  {
    id: "12",
    name: "Casa da Mulher Brasileira",
    type: "ngo",
    address: "Av. Desembargador Felismino Soares, s/n - Colônia Terra Nova, Manaus - AM",
    phone: "(92) 3082-2121",
    latitude: -3.0076,
    longitude: -60.0215
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
