
import { useState, useEffect } from "react";
import { DiaryEntry } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";
import { loadEntriesFromLocalStorage, saveEntriesToLocalStorage } from "./localStorage";
import { UseDiaryEntriesReturn } from "./types";
import { apiService } from "@/services/api";

export const useDiaryEntries = (): UseDiaryEntriesReturn => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>(loadEntriesFromLocalStorage());
  const [isLoading, setIsLoading] = useState(false);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    saveEntriesToLocalStorage(entries);
  }, [entries]);
  
  // Load entries from Django API on initialization
  useEffect(() => {
    const loadEntries = async () => {
      setIsLoading(true);
      try {
        const authToken = localStorage.getItem('authToken');
        if (authToken) {
          console.log("Loading entries from Django API");
          const response = await apiService.getDiaryEntries();
          
          if (response.entries && response.entries.length > 0) {
            // Convert Django format to app format
            const formattedEntries = response.entries.map((entry: any) => ({
              id: entry.id,
              text: entry.content,
              title: entry.title || entry.content.substring(0, 50),
              date: new Date(entry.date),
              mood: entry.mood || undefined,
              attachments: entry.attachments || [],
              createdAt: new Date(entry.created_at),
              location: entry.location || null,
              tags: [],
            }));
            
            setEntries(formattedEntries);
            console.log("Loaded entries from Django:", formattedEntries.length);
          }
        } else {
          console.log("No auth token, using localStorage entries only");
        }
      } catch (error) {
        console.error("Error loading entries from Django:", error);
        toast({
          title: "Erro ao carregar diário",
          description: "Usando dados locais. Faça login para sincronizar.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEntries();
  }, []);

  const addEntry = async (entry: DiaryEntry): Promise<boolean> => {
    try {
      // Save locally first for quick response
      setEntries(prev => [entry, ...prev]);
      
      // Try to save to Django API if authenticated
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          await apiService.createDiaryEntry({
            title: entry.title || entry.text.substring(0, 50),
            content: entry.text,
            location: entry.location || undefined,
            attachments: entry.attachments || []
          });
          console.log("Entry saved to Django successfully");
        } catch (error) {
          console.error("Error saving to Django:", error);
          toast({
            title: "Salvo localmente",
            description: "Entrada salva no dispositivo. Faça login para sincronizar na nuvem.",
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error adding diary entry:", error);
      throw error;
    }
  };

  const deleteEntry = async (id: string): Promise<void> => {
    try {
      // Remove locally first
      setEntries(prev => prev.filter(entry => entry.id !== id));
      
      // Try to remove from Django API if authenticated
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          await apiService.deleteDiaryEntry(id);
          toast({
            title: "Relato removido",
            description: "O relato foi removido com sucesso.",
          });
        } catch (error) {
          console.error("Error deleting from Django:", error);
          toast({
            title: "Removido localmente",
            description: "Relato removido do dispositivo.",
          });
        }
      } else {
        toast({
          title: "Relato removido",
          description: "O relato foi removido localmente.",
        });
      }
    } catch (error) {
      console.error("Error deleting diary entry:", error);
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
