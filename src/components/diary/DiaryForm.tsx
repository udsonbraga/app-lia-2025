
import { useState } from "react";
import { DiaryEntry } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/useFileUpload";

import LocationInput from "./form/LocationInput";
import DiaryTextField from "./form/DiaryTextField";
import AttachmentsUpload from "./form/AttachmentsUpload";
import SaveButton from "./form/SaveButton";
import FormAlerts from "./form/FormAlerts";

interface DiaryFormProps {
  onSave: (entry: DiaryEntry) => Promise<boolean>;
}

const DiaryForm = ({ onSave }: DiaryFormProps) => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<{text?: string, location?: string}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const {
    attachments,
    attachmentPreviews,
    uploadProgress,
    handleAttachment,
    uploadFiles,
    clearAttachments
  } = useFileUpload();

  const validateForm = () => {
    const newErrors: {text?: string, location?: string} = {};
    let isValid = true;
    
    if (!text.trim()) {
      newErrors.text = "Por favor, descreva o ocorrido";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Campos pendentes",
        description: "Preencha todos os campos obrigatórios marcados.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // Fazer upload dos anexos e obter as URLs permanentes
      const uploadedAttachments = await uploadFiles(userId);
      
      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        text,
        title: text.substring(0, 50), // Use first 50 chars of text as title
        date: new Date(), // Set current date as the diary entry date
        attachments: uploadedAttachments,
        location: location || null,
        createdAt: new Date(),
        tags: [], // Initialize with empty tags array
        mood: undefined,
      };

      // Salvar na base de dados
      const success = await onSave(newEntry);
      
      if (success) {
        // Limpar formulário após salvar com sucesso
        setText("");
        setLocation("");
        clearAttachments();
        setErrors({});
        setSaveSuccess(true);
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSaveSuccess(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Erro ao salvar diário:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas anotações. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormAlerts errors={errors} saveSuccess={saveSuccess} />
      
      <div className="space-y-4">
        <LocationInput location={location} onChange={setLocation} />
        <DiaryTextField 
          value={text} 
          onChange={setText} 
          error={errors.text}
        />
      </div>

      <AttachmentsUpload 
        attachments={attachments}
        attachmentPreviews={attachmentPreviews}
        uploadProgress={uploadProgress}
        onAttachmentChange={handleAttachment}
      />

      <SaveButton onClick={handleSave} isSaving={isSaving} />
    </div>
  );
};

export default DiaryForm;
