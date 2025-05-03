
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseInstance } from '@/integrations/supabase/client';

// Usar o cliente importado do integrations/supabase/client para garantir que estamos usando as credenciais corretas
export const supabase = supabaseInstance;

// Tipagem para produtos
export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// Tipagem para entradas do diário
export interface DiaryEntry {
  id: string;
  text: string;
  location?: string;
  attachments?: Array<{
    name: string;
    url?: string;
  }>;
  created_at: string;
  user_id?: string;
}

// Tipagem para feedback
export interface FeedbackItem {
  id: string;
  type: string;
  content: string;
  created_at: string;
  user_id?: string;
}

// Tipagem para contatos seguros com campos adicionais para Twilio
export interface SafeContactDatabase {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  user_id?: string;
  created_at: string;
  telegramId?: string;
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioWhatsappNumber?: string;
}

// Flag para verificar se o Supabase está configurado
export const supabaseConfigured = true;
