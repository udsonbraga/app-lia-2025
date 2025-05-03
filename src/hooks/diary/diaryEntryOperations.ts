
import { supabase } from '@/lib/supabase';
import { DiaryEntry } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { mapSupabaseDataToDiaryEntry } from './diaryMappers';

export const createDiaryEntryOperations = () => {
  const { toast } = useToast();

  // Função para buscar entradas do diário do usuário logado
  const fetchEntries = async () => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Buscar entradas do banco de dados
        const { data, error } = await supabase
          .from('diary_entries')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          return {
            entries: mapSupabaseDataToDiaryEntry(data),
            source: 'database',
          };
        }
      } else {
        // Se não estiver autenticado, buscar do localStorage
        const saved = localStorage.getItem('diaryEntries');
        if (saved) {
          return {
            entries: JSON.parse(saved),
            source: 'localStorage',
          };
        }
      }

      return { entries: [], source: 'empty' };
    } catch (error) {
      console.error('Erro ao buscar entradas do diário:', error);
      toast({
        title: "Erro ao carregar diário",
        description: "Não foi possível carregar as entradas do diário.",
        variant: "destructive"
      });
      
      // Fallback para localStorage em caso de erro
      const saved = localStorage.getItem('diaryEntries');
      if (saved) {
        return {
          entries: JSON.parse(saved),
          source: 'localStorage',
        };
      }

      return { entries: [], source: 'error' };
    }
  };

  // Função para adicionar uma nova entrada
  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'created_at' | 'user_id'>) => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Salvar no Supabase
        const { data, error } = await supabase
          .from('diary_entries')
          .insert([{ ...entry, user_id: session.user.id }])
          .select();
          
        if (error) throw error;
        
        if (data) {
          const mappedData = mapSupabaseDataToDiaryEntry(data);
          return { success: true, entries: mappedData };
        }
        
        return { success: true, entries: [] };
      } else {
        // Salvar no localStorage se não estiver autenticado
        const newEntry = {
          ...entry,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        
        return { success: true, entry: newEntry };
      }
    } catch (error) {
      console.error('Erro ao adicionar entrada do diário:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a entrada do diário.",
        variant: "destructive"
      });
      
      return { success: false, error };
    }
  };

  // Função para remover uma entrada
  const removeEntry = async (id: string) => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Remover do Supabase
        const { error } = await supabase
          .from('diary_entries')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      }
      
      toast({
        title: "Relato removido",
        description: "O relato foi removido com sucesso.",
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erro ao remover entrada do diário:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o relato.",
        variant: "destructive"
      });
      
      return { success: false, error };
    }
  };

  return {
    fetchEntries,
    addEntry,
    removeEntry
  };
};
