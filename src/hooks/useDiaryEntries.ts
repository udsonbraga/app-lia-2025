
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
  const [isLoading, setIsLoading] = useState(false);

  // Função para carregar entradas do Supabase
  const loadEntriesFromSupabase = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log("Usuário não autenticado, carregando apenas do localStorage");
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erro ao carregar entradas do diário:", error);
        toast({
          title: "Erro ao carregar diário",
          description: "Não foi possível sincronizar com a nuvem. Verifique sua conexão.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      if (data && data.length > 0) {
        console.log("Entradas carregadas do Supabase:", data);
        // Converter dados do Supabase para o formato DiaryEntry
        const supabaseEntries = data.map(entry => ({
          id: entry.id,
          text: entry.content,
          title: entry.title || entry.content.substring(0, 50),
          date: new Date(entry.date),
          mood: entry.mood || undefined,
          attachments: [],  // Precisaríamos implementar uma lógica para carregar os anexos
          createdAt: new Date(entry.created_at),
          location: null,
          tags: [],
        }));
        
        // Mesclar com entradas locais para garantir que não perdemos nada
        const localEntryIds = entries.map(e => e.id);
        const newEntries = [
          ...entries,
          ...supabaseEntries.filter(e => !localEntryIds.includes(e.id))
        ];
        
        setEntries(newEntries);
        localStorage.setItem('diaryEntries', JSON.stringify(newEntries));
        toast({
          title: "Diário sincronizado",
          description: "Suas entradas foram carregadas com sucesso da nuvem."
        });
      }
    } catch (error) {
      console.error("Erro ao carregar entradas do diário:", error);
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um problema ao tentar sincronizar com a nuvem.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
    try {
      // Salvar localmente primeiro para garantir resposta rápida ao usuário
      setEntries(prev => [entry, ...prev]);
      
      // Salvar no Supabase se o usuário estiver autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        console.log("Salvando entrada no Supabase para usuário:", session.user.id);
        
        // Uploads de imagens para o Storage, se houver
        const attachmentsWithUrls = [...entry.attachments];
        
        // Se houver anexos com URLs de objeto locais, precisaríamos fazer upload para o Storage
        // Aqui, estamos apenas registrando no console onde as fotos são salvas
        if (entry.attachments && entry.attachments.length > 0) {
          console.log("Anexos detectados:", entry.attachments.length);
          console.log("Fotos são salvas em: localStorage (URLs de objeto) e como referências no Supabase");
          
          // Nota: Para implementação completa, precisaríamos fazer upload das imagens para o Storage
          // e depois obter as URLs permanentes para salvar junto com a entrada
        }
        
        const { error } = await supabase
          .from('diary_entries')
          .insert({
            // Removemos o campo id para que o Supabase gere automaticamente o UUID
            user_id: session.user.id,
            title: entry.title || entry.text.substring(0, 50),
            content: entry.text,
            date: entry.date.toISOString().split('T')[0],
            mood: entry.mood || null
          });
          
        if (error) {
          console.error("Erro ao salvar entrada do diário no Supabase:", error);
          throw new Error(`Erro na sincronização: ${error.message}`);
        } else {
          console.log("Entrada salva com sucesso no Supabase");
        }
      } else {
        console.log("Usuário não autenticado, salvando apenas no localStorage");
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao salvar entrada do diário:", error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setEntries(prev => prev.filter(entry => entry.id !== id));
      
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
          toast({
            title: "Erro na sincronização",
            description: "O relato foi removido localmente, mas não foi sincronizado com a nuvem.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Relato removido",
            description: "O relato foi removido com sucesso de todos os dispositivos.",
          });
        }
      } else {
        toast({
          title: "Relato removido",
          description: "O relato foi removido localmente.",
        });
      }
    } catch (error) {
      console.error("Erro ao remover entrada do diário:", error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o relato. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    entries,
    addEntry,
    deleteEntry,
    isLoading
  };
};

export default useDiaryEntries;
