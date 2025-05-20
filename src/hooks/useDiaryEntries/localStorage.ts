
import { DiaryEntry } from "@/types/diary";

// Funções relacionadas ao armazenamento local
export const loadEntriesFromLocalStorage = (): DiaryEntry[] => {
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
};

export const saveEntriesToLocalStorage = (entries: DiaryEntry[]): void => {
  localStorage.setItem('diaryEntries', JSON.stringify(entries));
};
