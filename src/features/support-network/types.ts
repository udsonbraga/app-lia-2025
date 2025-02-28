
export type SupportLocationType = "police" | "hospital" | "ngo";

export type SupportLocation = {
  id: string;
  name: string;
  type: SupportLocationType;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
}

export type ActiveTab = "police" | "hospitals" | "ngos" | "rights";
