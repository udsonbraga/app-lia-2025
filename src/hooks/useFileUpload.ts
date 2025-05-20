
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileAttachment {
  file: File;
  url: string;
}

interface UploadedAttachment {
  name: string;
  url: string;
}

export const useFileUpload = () => {
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<FileAttachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachments(prev => [...prev, ...newFiles]);
      
      // Create previews for images and videos
      newFiles.forEach(file => {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const url = URL.createObjectURL(file);
          setAttachmentPreviews(prev => [...prev, {file, url}]);
          setUploadProgress(prev => ({...prev, [file.name]: 0}));
        }
      });
    }
  };

  const clearAttachments = () => {
    // Liberar URLs de objetos para prevenir vazamentos de memória
    attachmentPreviews.forEach(preview => {
      URL.revokeObjectURL(preview.url);
    });
    
    setAttachments([]);
    setAttachmentPreviews([]);
    setUploadProgress({});
  };

  const uploadFiles = async (userId: string | undefined): Promise<UploadedAttachment[]> => {
    if (!attachments.length) return [];
    
    if (!userId) {
      // Se o usuário não estiver autenticado, retorne apenas as URLs locais
      return attachments.map(file => {
        const preview = attachmentPreviews.find(p => p.file === file);
        return {
          name: file.name,
          url: preview?.url || ""
        };
      });
    }
    
    try {
      // Upload dos arquivos para o bucket do Supabase
      const uploadPromises = attachments.map(async (file) => {
        // Criar um caminho para o arquivo baseado no ID do usuário
        const filePath = `${userId}/${new Date().getTime()}_${file.name}`;
        
        // Obter a extensão do arquivo
        const fileType = file.type;
        
        // Upload do arquivo com rastreamento de progresso
        const { data, error } = await supabase.storage
          .from('diary_attachments')
          .upload(filePath, file, { 
            contentType: fileType || 'application/octet-stream',
            upsert: true,
          });
          
        if (error) {
          console.error('Erro ao fazer upload do arquivo:', error);
          toast({
            title: "Erro no upload",
            description: `Não foi possível enviar o arquivo ${file.name}`,
            variant: "destructive"
          });
          throw error;
        }
        
        // Atualizar o progresso para 100% quando o upload for concluído
        setUploadProgress(prev => ({...prev, [file.name]: 100}));
        
        // Obter a URL pública do arquivo
        const { data: { publicUrl } } = supabase.storage
          .from('diary_attachments')
          .getPublicUrl(data.path);
        
        return {
          name: file.name,
          url: publicUrl
        };
      });
      
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Erro ao fazer upload dos arquivos:', error);
      throw error;
    }
  };

  return {
    attachments,
    attachmentPreviews,
    uploadProgress,
    handleAttachment,
    uploadFiles,
    clearAttachments
  };
};
