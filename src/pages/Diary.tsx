
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DiaryHeader from "@/components/diary/DiaryHeader";
import DiaryForm from "@/components/diary/DiaryForm";
import DiaryEntryList from "@/components/diary/DiaryEntryList";
import { generateDiaryEntryPDF } from "@/utils/pdfGenerator";
import { useDiaryEntries } from "@/hooks/useDiaryEntries";
import { DiaryEntry } from "@/types/diary";
import { supabase } from "@/integrations/supabase/client";

const Diary = () => {
  const { toast } = useToast();
  const { entries, addEntry, deleteEntry } = useDiaryEntries();
  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    };
    
    checkAuth();
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
          {!isAuthenticated && !isLoading && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-700 text-sm">
                Você não está logado. Para sincronizar seus relatos com a nuvem e acessá-los em qualquer dispositivo, faça login.
              </p>
            </div>
          )}
          
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
