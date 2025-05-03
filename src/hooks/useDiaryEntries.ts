
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { DiaryEntry } from '@/lib/supabase';

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [hasLocalEntries, setHasLocalEntries] = useState(false);

  // Função para buscar entradas do diário do usuário logado
  const fetchEntries = async () => {
    setIsLoading(true);
    
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
          setEntries(data);
        }
      } else {
        // Se não estiver autenticado, buscar do localStorage
        const saved = localStorage.getItem('diaryEntries');
        if (saved) {
          setEntries(JSON.parse(saved));
          setHasLocalEntries(true);
        }
      }
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
        setEntries(JSON.parse(saved));
        setHasLocalEntries(true);
      }
    } finally {
      setIsLoading(false);
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
          setEntries([data[0], ...entries]);
        }
        
        return { success: true };
      } else {
        // Salvar no localStorage se não estiver autenticado
        const newEntry = {
          ...entry,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
        };
        
        const updatedEntries = [newEntry, ...entries];
        setEntries(updatedEntries);
        localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
        
        return { success: true };
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
      
      // Atualizar estado local
      const updatedEntries = entries.filter(entry => entry.id !== id);
      setEntries(updatedEntries);
      
      // Atualizar localStorage se necessário
      if (hasLocalEntries) {
        localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
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

  // Função para fazer upload de uma imagem
  const uploadImage = async (file: File, userId?: string) => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || { id: userId || 'anonymous' };
      
      // Criar caminho para o arquivo
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      
      // Fazer upload para o Storage
      const { data, error } = await supabase
        .storage
        .from('diary_images')
        .upload(filePath, file);
        
      if (error) throw error;
      
      // Gerar URL pública
      const { data: { publicUrl } } = supabase
        .storage
        .from('diary_images')
        .getPublicUrl(filePath);
        
      return { success: true, url: publicUrl, name: file.name };
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    isLoading,
    addEntry,
    removeEntry,
    uploadImage,
    hasLocalEntries,
    refreshEntries: fetchEntries
  };
};
