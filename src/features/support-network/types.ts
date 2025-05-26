
export interface SafeContact {
  id: string;
  name: string;
  telegramId: string;
  relationship: string;
}

export interface SupportLocation {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  mapUrl?: string;
}

export type ActiveTab = "police" | "hospitals" | "ngos" | "rights";
