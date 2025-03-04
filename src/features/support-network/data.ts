
import { SupportLocation } from "./types";

// Localizações em Manaus-AM com coordenadas e links atualizados
export const supportLocations: SupportLocation[] = [
  {
    id: "1",
    name: "Delegacia Especializada em Crimes Contra a Mulher - DECCM",
    type: "police",
    address: "Av. Mário Ypiranga, 3395 - Parque 10 de Novembro, Manaus - AM",
    phone: "(92) 3236-7012",
    latitude: -3.0953,
    longitude: -60.0274,
    mapUrl: "https://maps.app.goo.gl/1LLNKpPLKjm8udE76"
  },
  {
    id: "2",
    name: "Delegacia Especializada em Crimes Contra a Mulher - Zona Norte",
    type: "police",
    address: "Av. Arquiteto José Henriques, Conj. Manôa, Manaus - AM",
    phone: "(92) 3654-4226",
    latitude: -3.0312,
    longitude: -59.9857,
    mapUrl: "https://maps.app.goo.gl/4RcAGqYhma1uKdpS6"
  },
  {
    id: "4",
    name: "DEHS - Delegacia Especializada em Homicídios e Sequestros",
    type: "police",
    address: "Av. Duque de Caxias, s/n - Praça 14 de Janeiro, Manaus - AM",
    phone: "(92) 3634-6178",
    latitude: -3.1295,
    longitude: -60.0158,
    mapUrl: "https://maps.app.goo.gl/cj6mwP62teyGKyKH6"
  },
  {
    id: "5",
    name: "1º DIP - Distrito Integrado de Polícia",
    type: "police",
    address: "Rua Wilkens de Matos, s/n - Centro, Manaus - AM",
    phone: "(92) 3633-2037",
    latitude: -3.1389,
    longitude: -60.0234,
    mapUrl: "https://maps.app.goo.gl/ebvWtndze8emZjAv7"
  },
  {
    id: "6",
    name: "Delegacia da Mulher - Zona Sul",
    type: "police",
    address: "Av. Brasil, s/n - Compensa, Manaus - AM",
    phone: "(92) 3672-1109",
    latitude: -3.1178,
    longitude: -60.0486,
    mapUrl: "https://maps.app.goo.gl/7y9MMaB1ARTt58PaA"
  },
  {
    id: "7",
    name: "Hospital 28 de Agosto",
    type: "hospital",
    address: "Av. Mário Ypiranga, 1581 - Adrianópolis, Manaus - AM",
    phone: "(92) 3643-7100",
    latitude: -3.0957,
    longitude: -60.0238,
    mapUrl: "https://maps.app.goo.gl/G3vDcvMHTk583Q3x6"
  },
  {
    id: "8",
    name: "Hospital e Pronto Socorro João Lúcio",
    type: "hospital",
    address: "Av. Cosme Ferreira, 3937 - Coroado, Manaus - AM",
    phone: "(92) 3249-9100",
    latitude: -3.0754,
    longitude: -59.9425,
    mapUrl: "https://maps.app.goo.gl/NYBV1YCi9Hog8Zym7"
  },
  {
    id: "9",
    name: "UPA 24h Campos Sales",
    type: "hospital",
    address: "Rua Dona Otília, s/n - Tarumã, Manaus - AM",
    phone: "(92) 3215-2500",
    latitude: -3.0171,
    longitude: -60.0472,
    mapUrl: "https://maps.app.goo.gl/mgjP6ReHZS5GinTq6"
  },
  {
    id: "10",
    name: "UPA 24h José Rodrigues",
    type: "hospital",
    address: "Av. Camapuã, 1424 - Cidade Nova, Manaus - AM",
    phone: "(92) 3641-8011",
    latitude: -3.0238,
    longitude: -59.9642,
    mapUrl: "https://maps.app.goo.gl/BeJyTCGTca93KhwU9"
  },
  {
    id: "11",
    name: "ONG Marias da Amazônia",
    type: "ngo",
    address: "Rua Ferreira Pena, 287 - Centro, Manaus - AM",
    phone: "(92) 3233-8249",
    latitude: -3.1297,
    longitude: -60.0234
  },
  {
    id: "12",
    name: "Centro de Referência Especializado de Assistência Social (CREAS)",
    type: "ngo",
    address: "Av. Presidente Kennedy, 1318 - Educandos, Manaus - AM",
    phone: "(92) 3214-2222",
    latitude: -3.1389,
    longitude: -60.0112
  },
  {
    id: "13",
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
  // Use the mapUrl if available, otherwise fall back to coordinates
  const mapUrl = location.mapUrl || 
    `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`;
  window.open(mapUrl, '_blank');
};
