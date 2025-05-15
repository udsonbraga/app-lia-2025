
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DiaryHeader from "@/components/diary/DiaryHeader";
import DiaryForm from "@/components/diary/DiaryForm";
import DiaryEntryList from "@/components/diary/DiaryEntryList";
import { generateDiaryEntryPDF } from "@/utils/pdfGenerator";
import { useDiaryEntries } from "@/hooks/useDiaryEntries";
import { DiaryEntry } from "@/types/diary";

const Diary = () => {
  const { toast } = useToast();
  const { entries, addEntry, deleteEntry } = useDiaryEntries();
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleExportPDF = (entry: DiaryEntry) => {
    generateDiaryEntryPDF(entry);
    toast({
      title: "PDF gerado",
      description: "O relatório foi exportado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <DiaryHeader />

      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <DiaryForm onSave={addEntry} />
          <DiaryEntryList 
            entries={entries} 
            onDelete={deleteEntry} 
            onExportPDF={handleExportPDF} 
          />
        </div>
      </div>
    </div>
  );
};

export default Diary;
