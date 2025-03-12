
export interface SafeContact {
  id: string;
  name: string;
  phone: string;
  telegramId: string;
  relationship: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioWhatsappNumber?: string;
}

export interface UserPremiumStatus {
  isPremium: boolean;
  maxContacts: number;
}

export type ActiveTab = "police" | "hospitals" | "ngos" | "rights";

export interface SupportLocation {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours?: string;
  website?: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}
