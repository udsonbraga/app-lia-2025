
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DiaryHeader from "@/components/diary/DiaryHeader";
import DiaryForm from "@/components/diary/DiaryForm";
import DiaryEntryList from "@/components/diary/DiaryEntryList";
import { generateDiaryEntryPDF } from "@/utils/pdfGenerator";
import { useDiaryEntries } from "@/hooks/useDiaryEntries";
import { DiaryEntry } from "@/types/diary";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";

const Diary = () => {
  const { toast } = useToast();
  const { entries, addEntry, deleteEntry, isLoading } = useDiaryEntries();
  const [userName, setUserName] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    
    // Verificar se o usuário está autenticado
    const checkAuth = async () => {
      setAuthLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session?.user);
      setAuthLoading(false);
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

  const handleSaveDiary = async (entry: DiaryEntry) => {
    try {
      await addEntry(entry);
      toast({
        title: "Diário salvo com sucesso",
        description: "Seu relato foi registrado e está guardado com segurança.",
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar diário:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o diário. Por favor, tente novamente.",
        variant: "destructive"
      });
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <DiaryHeader />

      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          {!authLoading && !isAuthenticated && (
            <Alert className="bg-amber-50 border border-amber-200 rounded-lg">
              <AlertDescription className="text-amber-700 text-sm">
                Você não está logado. Para sincronizar seus relatos com a nuvem e acessá-los em qualquer dispositivo, faça login.
                <br />
                <span className="font-bold">Importante:</span> Imagens anexadas só serão armazenadas permanentemente quando você estiver logado.
              </AlertDescription>
            </Alert>
          )}
          
          {!authLoading && isAuthenticated && (
            <Alert className="bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <AlertDescription className="text-green-700 text-sm">
                  Você está conectado. As imagens anexadas serão armazenadas na nuvem e sincronizadas entre seus dispositivos.
                </AlertDescription>
              </div>
            </Alert>
          )}
          
          {isLoading && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-700 text-sm flex items-center">
                <span className="mr-2 h-4 w-4 rounded-full bg-blue-600 opacity-75 animate-ping inline-block"></span>
                Sincronizando seu diário...
              </p>
            </div>
          )}
          
          <DiaryForm onSave={handleSaveDiary} />
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
