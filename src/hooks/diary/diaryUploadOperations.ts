
import { supabase } from '@/lib/supabase';

export const createDiaryUploadOperations = () => {
  // Função para fazer upload de uma imagem
  const uploadImage = async (file: File, userId?: string): Promise<{ success: boolean; url?: string; name: string; error?: any }> => {
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
        .upload(filePath, file);
        
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
