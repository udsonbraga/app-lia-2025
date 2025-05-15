
import { useState, useEffect } from "react";
import { DiaryEntry } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";

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

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: DiaryEntry) => {
    setEntries(prev => [entry, ...prev]);
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
    toast({
      title: "Relato removido",
      description: "O relato foi removido com sucesso.",
    });
  };

  return {
    entries,
    addEntry,
    deleteEntry
  };
};

export default useDiaryEntries;
