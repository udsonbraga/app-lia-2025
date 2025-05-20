
import { useState } from "react";
import { Camera, Save, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DiaryEntry } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DiaryFormProps {
  onSave: (entry: DiaryEntry) => void;
}

const DiaryForm = ({ onSave }: DiaryFormProps) => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Array<{file: File, url: string}>>([]);
  const [errors, setErrors] = useState<{text?: string, location?: string}>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      
      // Create previews for images
      newFiles.forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file);
          setAttachmentPreviews(prev => [...prev, {file, url}]);
        }
      });
    }
  };

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

    try {
      // Create structured attachment data with URLs for images
      const attachmentData = attachments.map(file => {
        const preview = attachmentPreviews.find(p => p.file === file);
        return {
          name: file.name,
          url: preview?.url || undefined
        };
      });

      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        text,
        title: text.substring(0, 50), // Use first 50 chars of text as title
        date: new Date(), // Set current date as the diary entry date
        attachments: attachmentData,
        location: location || null,
        createdAt: new Date(),
        tags: [], // Initialize with empty tags array
      };

      // Salvar na base de dados
      await onSave(newEntry);
      
      // Limpar formulário após salvar com sucesso
      setText("");
      setLocation("");
      setAttachments([]);
      setAttachmentPreviews([]);
      setErrors({});

      toast({
        title: "Diário salvo com sucesso",
        description: "Suas anotações foram registradas no diário seguro.",
      });
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
      {Object.values(errors).some(error => error) && (
        <Alert variant="destructive">
          <AlertTitle>Campos pendentes</AlertTitle>
          <AlertDescription>
            Por favor, preencha os campos obrigatórios para prosseguir.
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Local da Ocorrência
          </label>
          <div className="mt-1 flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Onde ocorreu o incidente?"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <label htmlFor="diary-text" className="block text-sm font-medium text-gray-700 flex items-center">
            Descreva o Ocorrido
            <span className="text-red-500 ml-1">*</span>
          </label>
          <Textarea
            id="diary-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva seus pensamentos aqui..."
            className={`w-full h-48 p-4 mt-1 rounded-lg border ${errors.text ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-red-500'}`}
          />
          {errors.text && (
            <p className="text-red-500 text-xs mt-1">{errors.text}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-input')?.click()}
            className="flex items-center gap-2"
          >
            <Camera className="h-6 w-6" />
            Capturar
          </Button>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            className="hidden"
            onChange={handleAttachment}
          />
        </div>

        {attachmentPreviews.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-sm font-medium text-gray-700">Pré-visualização:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {attachmentPreviews.map((preview, index) => (
                <div key={index} className="border rounded-md p-2">
                  <img 
                    src={preview.url} 
                    alt={preview.file.name}
                    className="h-40 w-full object-cover rounded mb-2" 
                  />
                  <p className="text-xs text-gray-600 truncate">{preview.file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Anexos:</p>
            <ul className="space-y-2">
              {attachments.map((file, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 bg-[#FF84C6] hover:bg-[#ff6cb7] text-white"
      >
        {isSaving ? (
          <>
            <span className="animate-pulse">Salvando...</span>
          </>
        ) : (
          <>
            <Save className="h-5 w-5" />
            Salvar
          </>
        )}
      </Button>
    </div>
  );
};

export default DiaryForm;
