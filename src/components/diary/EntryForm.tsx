
import { useState } from "react";
import { Camera, MapPin, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LoadingOverlay } from "@/components/disguise/LoadingOverlay";

interface EntryFormProps {
  onSave: (entry: { text: string; location: string; attachments: File[] }) => Promise<void>;
  isLoading: boolean;
}

export const EntryForm = ({ onSave, isLoading }: EntryFormProps) => {
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Array<{file: File, url: string}>>([]);
  const [totalProgress, setTotalProgress] = useState(0);
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      
      // Initialize progress for new files
      const newFileProgress = {...fileProgress};
      newFiles.forEach(file => {
        newFileProgress[file.name] = 0;
      });
      setFileProgress(newFileProgress);
      
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

  const handleSave = async () => {
    if (!text.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O texto não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    setUploadInProgress(true);
    setUploadErrors([]);
    
    try {
      await onSave({
        text,
        location: location || "Não informado",
        attachments
      });

      // Reset form
      setText("");
      setLocation("");
      setAttachments([]);
      setAttachmentPreviews([]);
      setTotalProgress(0);
      setFileProgress({});
      
      toast({
        title: "Registro salvo",
        description: "Seu relato foi salvo com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao salvar:", error);
      setUploadErrors([`Erro ao salvar: ${error instanceof Error ? error.message : 'Erro desconhecido'}`]);
      
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar seu relato.",
        variant: "destructive",
      });
    } finally {
      setUploadInProgress(false);
    }
  };

  const handleRemoveAttachment = (index: number) => {
    const newAttachments = [...attachments];
    const newPreviews = [...attachmentPreviews];
    
    // Find and revoke the URL for this file
    const previewIndex = newPreviews.findIndex(p => p.file === newAttachments[index]);
    if (previewIndex >= 0) {
      URL.revokeObjectURL(newPreviews[previewIndex].url);
      newPreviews.splice(previewIndex, 1);
    }
    
    // Remove file from attachments
    newAttachments.splice(index, 1);
    
    setAttachments(newAttachments);
    setAttachmentPreviews(newPreviews);
  };

  return (
    <div className="space-y-6">
      {uploadInProgress && (
        <LoadingOverlay isLoading={true} message="Enviando relato..." />
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
              disabled={uploadInProgress}
            />
          </div>
        </div>

        <div>
          <label htmlFor="diary-text" className="block text-sm font-medium text-gray-700">
            Descreva o Ocorrido
          </label>
          <textarea
            id="diary-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva seus pensamentos aqui..."
            className="w-full h-48 p-4 mt-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={uploadInProgress}
          />
        </div>
      </div>

      {uploadErrors.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Erro ao enviar</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5">
              {uploadErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('file-input')?.click()}
            className="flex items-center gap-2"
            disabled={uploadInProgress}
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
            disabled={uploadInProgress}
          />
        </div>

        {attachmentPreviews.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-sm font-medium text-gray-700">Pré-visualização:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {attachmentPreviews.map((preview, index) => (
                <div key={index} className="border rounded-md p-2 relative">
                  <img 
                    src={preview.url} 
                    alt={preview.file.name}
                    className="h-40 w-full object-cover rounded mb-2" 
                  />
                  <p className="text-xs text-gray-600 truncate">{preview.file.name}</p>
                  
                  {/* Progress bar */}
                  {fileProgress[preview.file.name] > 0 && fileProgress[preview.file.name] < 100 && (
                    <div className="mt-1">
                      <Progress value={fileProgress[preview.file.name]} className="h-1" />
                      <p className="text-xs text-right mt-1">{fileProgress[preview.file.name]}%</p>
                    </div>
                  )}
                  
                  {/* Remove button */}
                  <button 
                    className="absolute top-1 right-1 bg-red-50 hover:bg-red-100 text-red-500 rounded-full p-1"
                    onClick={() => handleRemoveAttachment(attachments.findIndex(f => f.name === preview.file.name))}
                    disabled={uploadInProgress}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {attachments.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-gray-700">Anexos: {attachments.length}</p>
              
              {totalProgress > 0 && totalProgress < 100 && (
                <p className="text-sm text-gray-600">{totalProgress}% concluído</p>
              )}
            </div>
            
            {totalProgress > 0 && (
              <Progress value={totalProgress} className="h-2 mb-4" />
            )}
          </div>
        )}
      </div>

      <Button
        onClick={handleSave}
        disabled={isLoading || uploadInProgress || text.trim() === ""}
        className="w-full flex items-center justify-center gap-2 bg-[#FF84C6] hover:bg-[#ff6cb7] text-white"
      >
        <Save className="h-5 w-5" />
        {isLoading || uploadInProgress ? "Salvando..." : "Salvar"}
      </Button>
    </div>
  );
};
