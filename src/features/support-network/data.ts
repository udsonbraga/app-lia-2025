
import { SupportLocation } from "./types";

export const openMap = (location: SupportLocation) => {
  if (location.mapUrl) {
    window.open(location.mapUrl, "_blank");
  } else {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;
    window.open(googleMapsUrl, "_blank");
  }
};

export const getFilteredLocations = (
  locations: SupportLocation[],
  searchTerm: string
) => {
  if (!searchTerm) return locations;
  
  return locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const policeLocations: SupportLocation[] = [
  {
    id: "police1",
    name: "Delegacia Especializada em Crimes Contra a Mulher (DECCM)",
    type: "police",
    address: "Av. Mário Ypiranga, 3395 - Parque Dez de Novembro, Manaus - AM, 69050-030",
    phone: "(92) 3236-7012",
    latitude: -3.0979,
    longitude: -60.0164,
    mapUrl: "https://maps.app.goo.gl/Bn7Jx7aGE9PQgP1o8"
  },
  {
    id: "police2",
    name: "Delegacia Especializada em Proteção à Criança e ao Adolescente (DEPCA)",
    type: "police",
    address: "Av. Via Láctea, s/n - Morada do Sol, Aleixo, Manaus - AM, 69060-085",
    phone: "(92) 3656-2065",
    latitude: -3.0786,
    longitude: -60.0134,
    mapUrl: "https://maps.app.goo.gl/GcENJzQeihwQwJKN9"
  },
  {
    id: "police3",
    name: "1ª Delegacia Especializada em Homicídios e Sequestros (DEHS)",
    type: "police",
    address: "Av. Autaz Mirim, s/n - Jorge Teixeira, Manaus - AM, 69088-175",
    phone: "(92) 3667-7777",
    latitude: -3.0184,
    longitude: -59.9364,
    mapUrl: "https://maps.app.goo.gl/ioumtH5jwQNn2E4K9"
  }
];

export const hospitalLocations: SupportLocation[] = [
  {
    id: "hospital1",
    name: "UPA 24h Campos Sales",
    type: "hospital",
    address: "Av. Campos Sales, 1578 - Tarumã, Manaus - AM, 69021-230",
    phone: "(92) 3214-2264",
    latitude: -3.0895,
    longitude: -60.0536,
    mapUrl: "https://maps.app.goo.gl/PZHfGVn4V7w8jAEE7"
  },
  {
    id: "hospital2",
    name: "UPA 24h José Rodrigues",
    type: "hospital",
    address: "Av. Leonardo Malcher, 1500 - Centro, Manaus - AM, 69010-170",
    phone: "(92) 3182-9000",
    latitude: -3.1323,
    longitude: -60.0166,
    mapUrl: "https://maps.app.goo.gl/nCCWsjTZ9iCPdkYZ9"
  },
  {
    id: "hospital3",
    name: "UPA 24h Danilo Corrêa",
    type: "hospital",
    address: "Av. Noel Nutels, s/n - Cidade Nova, Manaus - AM, 69093-770",
    phone: "(92) 3182-9050",
    latitude: -3.0373,
    longitude: -59.9784,
    mapUrl: "https://maps.app.goo.gl/mD9qCo4u7Wuw6Tzt8"
  },
  {
    id: "hospital4",
    name: "Hospital e Pronto Socorro 28 de Agosto",
    type: "hospital",
    address: "Av. Mário Ypiranga, 1581 - Adrianópolis, Manaus - AM, 69057-002",
    phone: "(92) 3643-7100",
    latitude: -3.1057,
    longitude: -60.0110,
    mapUrl: "https://maps.app.goo.gl/q1ZnZdnUJrPX3VDx8"
  },
  {
    id: "hospital5",
    name: "Hospital e Pronto Socorro Dr. João Lúcio Pereira Machado",
    type: "hospital",
    address: "Av. Cosme Ferreira, 3937 - Coroado, Manaus - AM, 69082-230",
    phone: "(92) 3249-9060",
    latitude: -3.0809,
    longitude: -59.9433,
    mapUrl: "https://maps.app.goo.gl/Yk6i5iNhN7SzRDXK6"
  }
];

export const ngoLocations: SupportLocation[] = [
  {
    id: "ngo1",
    name: "Casa da Mulher Brasileira",
    type: "ngo",
    address: "Av. Desembargador Felismino Soares, 149 - Colônia Oliveira Machado, Manaus - AM, 69070-620",
    phone: "(92) 98452-1739",
    latitude: -3.1323,
    longitude: -60.009,
    mapUrl: "https://maps.app.goo.gl/XjTzr9AqvXdpHkMr7"
  },
  {
    id: "ngo2",
    name: "Centro Estadual de Referência e Apoio à Mulher (CREAM)",
    type: "ngo",
    address: "Av. Perimetral, 4149 - Parque Dez de Novembro, Manaus - AM, 69055-001",
    phone: "(92) 3624-4983",
    latitude: -3.0778,
    longitude: -60.0132,
    mapUrl: "https://maps.app.goo.gl/hmVL2yEmnRfAVzCV6"
  },
  {
    id: "ngo3",
    name: "Centro de Referência de Assistência Social (CRAS)",
    type: "ngo",
    address: "R. Tupinambás, 119 - Cidade Nova, Manaus - AM, 69095-160",
    phone: "(92) 3215-2646",
    latitude: -3.0352,
    longitude: -59.9586,
    mapUrl: "https://maps.app.goo.gl/3VLfMURMhDu6iKwR9"
  },
  {
    id: "ngo4",
    name: "Instituto Maria e João Aleixo (IMJA)",
    type: "ngo",
    address: "R. Igarapé de Manaus, 399 - Parque 10 de Novembro, Manaus - AM, 69054-000",
    phone: "(92) 99267-2078",
    latitude: -3.0864,
    longitude: -60.0097,
    mapUrl: "https://maps.app.goo.gl/3jkH2T5z1Td6JHx48"
  },
  {
    id: "ngo5",
    name: "Abrigo Feminino Antônia Nascimento Priante",
    type: "ngo",
    address: "R. Vale do Jari, s/n - Grande Vitória, Manaus - AM",
    phone: "(92) 3214-5820",
    latitude: -3.0457,
    longitude: -59.9375,
    mapUrl: "https://maps.app.goo.gl/WCjGmRvALpFE9kFi7"
  }
];

export const rightsLocations: SupportLocation[] = [
  {
    id: "rights1",
    name: "Defensoria Pública do Estado do Amazonas - DPEAM",
    type: "ngo",
    address: "R. 24 de Maio, 321 - Centro, Manaus - AM, 69010-080",
    phone: "(92) 3233-2087",
    latitude: -3.1336,
    longitude: -60.0219,
    mapUrl: "https://maps.app.goo.gl/5yKYxCMtPUSJZkui6"
  },
  {
    id: "rights2",
    name: "Ministério Público do Estado do Amazonas - MPAM",
    type: "ngo",
    address: "Av. Coronel Teixeira, 7995 - Nova Esperança, Manaus - AM, 69037-473",
    phone: "(92) 3655-0500",
    latitude: -3.0825,
    longitude: -60.0453,
    mapUrl: "https://maps.app.goo.gl/jTDf9EaWjSj4wDj67"
  },
  {
    id: "rights3",
    name: "Núcleo de Promoção e Defesa dos Direitos da Mulher (NUDEM)",
    type: "ngo",
    address: "Av. André Araújo, 679 - Aleixo, Manaus - AM, 69060-000",
    phone: "(92) 3232-9076",
    latitude: -3.1045,
    longitude: -59.9877,
    mapUrl: "https://maps.app.goo.gl/nCCWsjTZ9iCPdkYZ9"
  },
];
