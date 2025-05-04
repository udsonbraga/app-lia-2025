
import { DiaryEntry } from "@/lib/supabase";
import { Json } from '@/integrations/supabase/types';

// Função para mapear dados do Supabase para o formato DiaryEntry
export const mapSupabaseDataToDiaryEntry = (data: any[]): DiaryEntry[] => {
  return data.map(item => {
    // Converter Json para o formato esperado por DiaryEntry
    const attachments = item.attachments 
      ? (typeof item.attachments === 'string' 
          ? JSON.parse(item.attachments) 
          : item.attachments)
      : [];
      
    return {
      id: item.id,
      text: item.text,
      location: item.location || "Não informado",
      attachments: Array.isArray(attachments) ? attachments : [],
      created_at: item.created_at,
      user_id: item.user_id
    };
  });
};
