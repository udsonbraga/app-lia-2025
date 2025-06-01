
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadOptions {
  maxSize?: number;
  allowedTypes?: string[];
}

export const useFileUpload = (options: FileUploadOptions = {}) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Validate file size
      if (options.maxSize && file.size > options.maxSize) {
        throw new Error(`File size exceeds ${options.maxSize / (1024 * 1024)}MB limit`);
      }

      // Validate file type
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed`);
      }

      // Simulate file upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(progress);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create a local URL for the file (since we don't have real file storage yet)
      const fileUrl = URL.createObjectURL(file);
      
      toast({
        title: "Upload realizado",
        description: `${file.name} foi carregado com sucesso.`,
      });

      return {
        url: fileUrl,
        name: file.name,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload';
      
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadFile,
    isUploading,
    uploadProgress
  };
};
