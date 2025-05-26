
import { DiaryEntry } from "@/types/diary";

export interface UseDiaryEntriesReturn {
  entries: DiaryEntry[];
  addEntry: (entry: DiaryEntry) => Promise<boolean>;
  deleteEntry: (id: string) => Promise<void>;
  isLoading: boolean;
}
