
import { supabase } from '@/lib/supabase';

export const createDiaryUploadOperations = () => {
  // Função para fazer upload de uma imagem
  const uploadImage = async (
    file: File, 
    userId?: string,
    onProgress?: (progress: number) => void
  ): Promise<{ success: boolean; url?: string; name: string; error?: any }> => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user || { id: userId || 'anonymous' };
      
      // Criar caminho para o arquivo
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      
      // Fazer upload para o Storage
      const { data, error } = await supabase
        .storage
        .from('diary_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      // Separately handle progress if provided
      if (onProgress) {
        // Simulate upload progress since direct progress tracking isn't available
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress <= 100) {
            onProgress(progress);
          } else {
            clearInterval(interval);
          }
        }, 100);
        
        // Clear interval after 1 second (artificial but provides feedback)
        setTimeout(() => {
          clearInterval(interval);
          onProgress(100);
        }, 1000);
      }
        
      if (error) throw error;
      
      // Gerar URL pública
      const { data: { publicUrl } } = supabase
        .storage
        .from('diary_images')
        .getPublicUrl(filePath);
        
      return { success: true, url: publicUrl, name: file.name };
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      return { success: false, name: file.name, error };
    }
  };

  return {
    uploadImage
  };
};
