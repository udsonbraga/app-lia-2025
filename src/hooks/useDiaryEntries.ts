
import { useState, useEffect } from 'react';
import { DiaryEntry } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { createDiaryEntryOperations } from './diary/diaryEntryOperations';
import { createDiaryUploadOperations } from './diary/diaryUploadOperations';

export const useDiaryEntries = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLocalEntries, setHasLocalEntries] = useState(false);
  
  const { toast } = useToast();
  const entryOperations = createDiaryEntryOperations();
  const uploadOperations = createDiaryUploadOperations();

  // Função para buscar entradas do diário
  const fetchEntries = async () => {
    setIsLoading(true);
    
    try {
      const result = await entryOperations.fetchEntries();
      setEntries(result.entries);
      setHasLocalEntries(result.source === 'localStorage');
    } finally {
      setIsLoading(false);
    }
  };

  // Função para adicionar uma nova entrada
  const addEntry = async (entry: Omit<DiaryEntry, 'id' | 'created_at' | 'user_id'>) => {
    try {
      const result = await entryOperations.addEntry(entry);
      
      if (result.success) {
        if (result.entries) {
          setEntries(prev => [...result.entries, ...prev]);
        } else if (result.entry) {
          const updatedEntries = [result.entry, ...entries];
          setEntries(updatedEntries);
          localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
        }
      }
      
      return { success: result.success };
    } catch (error) {
      console.error('Erro ao adicionar entrada do diário:', error);
      return { success: false, error };
    }
  };

  // Função para remover uma entrada
  const removeEntry = async (id: string) => {
    try {
      const result = await entryOperations.removeEntry(id);
      
      if (result.success) {
        // Atualizar estado local
        const updatedEntries = entries.filter(entry => entry.id !== id);
        setEntries(updatedEntries);
        
        // Atualizar localStorage se necessário
        if (hasLocalEntries) {
          localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
        }
      }
      
      return result;
    } catch (error) {
      console.error('Erro ao remover entrada do diário:', error);
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
    uploadImage: uploadOperations.uploadImage,
    hasLocalEntries,
    refreshEntries: fetchEntries
  };
};
