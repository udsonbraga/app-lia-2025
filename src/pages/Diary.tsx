
import { useState, useEffect } from "react";
import { DiaryHeader } from "@/components/diary/DiaryHeader";
import { EntryForm } from "@/components/diary/EntryForm";
import { EntryList } from "@/components/diary/EntryList";
import { useToast } from "@/hooks/use-toast";
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { useAuth } from '@/hooks/useAuth';
import { processAttachments } from "@/components/diary/utils/attachmentUtils";

const Diary = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  const {
    entries,
    isLoading,
    addEntry,
    removeEntry,
    uploadImage
  } = useDiaryEntries();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    
    // Se o usuário estiver autenticado, usar o nome do perfil
    if (user) {
      const name = user.user_metadata?.name || '';
      setUserName(name);
      if (name) {
        localStorage.setItem("userName", name);
      }
    }
  }, [user]);

  const handleSave = async (entry: { text: string; location: string; attachments: File[] }) => {
    setFormSubmitting(true);
    try {
      // Fazer upload das imagens primeiro
      const uploadedAttachments = await processAttachments(
        entry.attachments, 
        uploadImage,
        user?.id,
        (totalProgress) => {
          console.log(`Upload total: ${totalProgress}%`);
        },
        (fileName, progress) => {
          console.log(`${fileName}: ${progress}%`);
        }
      );

      // Criar a entrada do diário
      const result = await addEntry({
        text: entry.text,
        location: entry.location || "Não informado",
        attachments: uploadedAttachments
      });

      if (result.success) {
        toast({
          title: "Diário salvo",
          description: "Suas anotações foram salvas com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar diário:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas anotações.",
        variant: "destructive",
      });
      throw error; // Re-throw for the form to catch and handle
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    const result = await removeEntry(id);
    if (result.success) {
      toast({
        title: "Relato removido",
        description: "O relato foi removido com sucesso.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <DiaryHeader />

      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <EntryForm 
            onSave={handleSave} 
            isLoading={isLoading || formSubmitting} 
          />

          <EntryList 
            entries={entries}
            onDelete={handleDeleteEntry}
            userName={userName}
          />
        </div>
      </div>
    </div>
  );
};

export default Diary;
