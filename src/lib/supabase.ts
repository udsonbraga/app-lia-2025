
import { createClient } from '@supabase/supabase-js';

// Essas URLs e chaves devem ser substituídas por suas credenciais reais do Supabase
// Você pode obtê-las no painel de controlo do seu projeto Supabase
const supabaseUrl = 'https://xegkqqtphhhhhelhxbgl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlZ2txcXRwaGhoaGhlbGh4YmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNDg4MTIsImV4cCI6MjA1NzcyNDgxMn0.nZuijowIj85GLYmQIWMc-hjJbfd-q-bxeXzkkzk5hH0\n';

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
