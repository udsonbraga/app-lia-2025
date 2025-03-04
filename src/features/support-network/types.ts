
export type ActiveTab = "police" | "hospitals" | "ngos" | "rights";

export interface SupportLocation {
  id: string;
  name: string;
  type: "police" | "hospital" | "ngo";
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  mapUrl?: string;  // Optional URL for direct Google Maps link
}
