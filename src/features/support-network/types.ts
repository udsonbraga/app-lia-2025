
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
