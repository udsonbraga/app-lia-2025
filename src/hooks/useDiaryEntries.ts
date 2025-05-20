
import { useState, useEffect } from "react";
import { DiaryEntry } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDiaryEntries = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('diaryEntries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing diary entries:", e);
        return [];
      }
    }
    return [];
  });

  // Função para carregar entradas do Supabase
  const loadEntriesFromSupabase = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;
      
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erro ao carregar entradas do diário:", error);
        return;
      }
      
      if (data && data.length > 0) {
        // Converter dados do Supabase para o formato DiaryEntry
        const supabaseEntries: DiaryEntry[] = data.map(entry => ({
          id: entry.id,
          title: entry.title,
          content: entry.content,
          date: new Date(entry.date),
          mood: entry.mood || undefined,
          tags: [], // Não estamos armazenando tags no Supabase ainda
          location: null // Não estamos armazenando localização no Supabase ainda
        }));
        
        // Mesclar com entradas locais para garantir que não perdemos nada
        const localEntryIds = entries.map(e => e.id);
        const newEntries = [
          ...entries,
          ...supabaseEntries.filter(e => !localEntryIds.includes(e.id))
        ];
        
        setEntries(newEntries);
        localStorage.setItem('diaryEntries', JSON.stringify(newEntries));
      }
    } catch (error) {
      console.error("Erro ao carregar entradas do diário:", error);
    }
  };

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);
  
  // Carregar entradas do Supabase na inicialização
  useEffect(() => {
    loadEntriesFromSupabase();
  }, []);

  const addEntry = async (entry: DiaryEntry) => {
    setEntries(prev => [entry, ...prev]);
    
    try {
      // Salvar no Supabase se o usuário estiver autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { error } = await supabase
          .from('diary_entries')
          .insert({
            id: entry.id,
            user_id: session.user.id,
            title: entry.title,
            content: entry.content,
            date: entry.date.toISOString().split('T')[0],
            mood: entry.mood || null
          });
          
        if (error) {
          console.error("Erro ao salvar entrada do diário no Supabase:", error);
          toast({
            title: "Erro na sincronização",
            description: "Sua entrada foi salva localmente, mas não foi sincronizada com a nuvem.",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error("Erro ao salvar entrada do diário:", error);
    }
  };

  const deleteEntry = async (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Relato removido",
      description: "O relato foi removido com sucesso.",
    });
    
    try {
      // Remover do Supabase se o usuário estiver autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        const { error } = await supabase
          .from('diary_entries')
          .delete()
          .eq('id', id)
          .eq('user_id', session.user.id);
          
        if (error) {
          console.error("Erro ao remover entrada do diário do Supabase:", error);
        }
      }
    } catch (error) {
      console.error("Erro ao remover entrada do diário:", error);
    }
  };

  return {
    entries,
    addEntry,
    deleteEntry
  };
};

export default useDiaryEntries;
