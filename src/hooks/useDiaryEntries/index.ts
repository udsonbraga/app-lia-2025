
import { useState, useEffect } from "react";
import { DiaryEntry } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";
import { loadEntriesFromLocalStorage, saveEntriesToLocalStorage } from "./localStorage";
import { useSupabaseSync } from "./supabaseSync";
import { UseDiaryEntriesReturn } from "./types";

export const useDiaryEntries = (): UseDiaryEntriesReturn => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>(loadEntriesFromLocalStorage());
  const [isLoading, setIsLoading] = useState(false);
  const { loadEntriesFromSupabase, saveEntryToSupabase, deleteEntryFromSupabase } = useSupabaseSync();

  // Save entries to localStorage whenever they change
  useEffect(() => {
    saveEntriesToLocalStorage(entries);
  }, [entries]);
  
  // Carregar entradas do Supabase na inicialização
  useEffect(() => {
    const syncEntries = async () => {
      setIsLoading(true);
      const syncedEntries = await loadEntriesFromSupabase(entries);
      setEntries(syncedEntries);
      setIsLoading(false);
    };
    
    syncEntries();
  }, []);

  const addEntry = async (entry: DiaryEntry): Promise<boolean> => {
    try {
      // Salvar localmente primeiro para garantir resposta rápida ao usuário
      setEntries(prev => [entry, ...prev]);
      
      // Tenta salvar no Supabase
      await saveEntryToSupabase(entry);
      
      return true;
    } catch (error) {
      console.error("Erro ao salvar entrada do diário:", error);
      throw error;
    }
  };

  const deleteEntry = async (id: string): Promise<void> => {
    try {
      // Encontrar a entrada para potencialmente excluir anexos
      const entryToDelete = entries.find(e => e.id === id);
      
      // Remover localmente primeiro
      setEntries(prev => prev.filter(entry => entry.id !== id));
      
      // Tenta remover do Supabase
      const supabaseSuccess = await deleteEntryFromSupabase(id, entryToDelete);
      
      // Notificar o usuário baseado no resultado
      if (supabaseSuccess) {
        toast({
          title: "Relato removido",
          description: "O relato foi removido com sucesso de todos os dispositivos.",
        });
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
