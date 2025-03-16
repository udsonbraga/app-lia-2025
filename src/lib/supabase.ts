
import { createClient } from '@supabase/supabase-js';

// Essas URLs e chaves devem ser substituídas por suas credenciais reais do Supabase
// Você pode obtê-las no painel de controle do seu projeto Supabase
const supabaseUrl = 'https://sua-url-do-projeto.supabase.co';
const supabaseAnonKey = 'sua-chave-anon-key';

// Crie e exporte o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas do banco de dados
export type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  created_at: string;
};

export type FinancialNoteDB = {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
  category: string;
  description?: string;
  created_at: string;
};

export type SafeContactDB = {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  relationship: string;
  emergency_contact: boolean;
  created_at: string;
};
