
import { DiaryEntry, DiaryAttachment } from "@/types/diary";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Custom hook para gerenciar sincronização com Supabase
export const useSupabaseSync = () => {
  const { toast } = useToast();
  
  const loadEntriesFromSupabase = async (currentEntries: DiaryEntry[]): Promise<DiaryEntry[]> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log("Usuário não autenticado, carregando apenas do localStorage");
        return currentEntries;
      }
      
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erro ao carregar entradas do diário:", error);
        toast({
          title: "Erro ao carregar diário",
          description: "Não foi possível sincronizar com a nuvem. Verifique sua conexão.",
          variant: "destructive"
        });
        return currentEntries;
      }
      
      if (data && data.length > 0) {
        console.log("Entradas carregadas do Supabase:", data);
        
        // Converter dados do Supabase para o formato DiaryEntry
        const supabaseEntries = await Promise.all(data.map(async entry => {
          // Buscar anexos do Storage se houver
          let attachments = await getAttachmentsFromStorage(session.user.id, entry.id);
          
          return {
            id: entry.id,
            text: entry.content,
            title: entry.title || entry.content.substring(0, 50),
            date: new Date(entry.date),
            mood: entry.mood || undefined,
            attachments: attachments,
            createdAt: new Date(entry.created_at),
            location: null,
            tags: [],
          };
        }));
        
        // Mesclar com entradas locais para garantir que não perdemos nada
        const localEntryIds = currentEntries.map(e => e.id);
        const newEntries = [
          ...currentEntries,
          ...supabaseEntries.filter(e => !localEntryIds.includes(e.id))
        ];
        
        toast({
          title: "Diário sincronizado",
          description: "Suas entradas foram carregadas com sucesso da nuvem."
        });
        
        return newEntries;
      }
      
      return currentEntries;
    } catch (error) {
      console.error("Erro ao carregar entradas do diário:", error);
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um problema ao tentar sincronizar com a nuvem.",
        variant: "destructive"
      });
      return currentEntries;
    }
  };
  
  const getAttachmentsFromStorage = async (userId: string, entryId: string): Promise<DiaryAttachment[]> => {
    try {
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('diary_attachments')
        .list(`${userId}`, {
          search: entryId
        });
        
      if (storageError) {
        console.error("Erro ao buscar anexos do Storage:", storageError);
        return [];
      }
      
      if (storageFiles && storageFiles.length > 0) {
        return storageFiles.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('diary_attachments')
            .getPublicUrl(`${userId}/${file.name}`);
            
          return {
            name: file.name,
            url: publicUrl
          };
        });
      }
      
      return [];
    } catch (fileError) {
      console.error("Erro ao processar anexos:", fileError);
      return [];
    }
  };
  
  const saveEntryToSupabase = async (entry: DiaryEntry): Promise<boolean> => {
    try {
      // Verificar se o usuário está autenticado
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        console.log("Usuário não autenticado, salvando apenas no localStorage");
        return false; // Indica que não foi salvo no Supabase
      }
      
      console.log("Salvando entrada no Supabase para usuário:", userId);
      
      // Se houver anexos com URLs permanentes do Storage
      const supabaseAttachments = entry.attachments.map(attachment => ({
        url: attachment.url,
        name: attachment.name
      }));
      
      const { error } = await supabase
        .from('diary_entries')
        .insert({
          user_id: userId,
          title: entry.title || entry.text.substring(0, 50),
          content: entry.text,
          date: entry.date.toISOString().split('T')[0],
          mood: entry.mood || null
        });
        
      if (error) {
        console.error("Erro ao salvar entrada do diário no Supabase:", error);
        throw new Error(`Erro na sincronização: ${error.message}`);
      }
      
      console.log("Entrada salva com sucesso no Supabase");
      return true;
    } catch (error) {
      console.error("Erro ao salvar entrada do diário:", error);
      throw error;
    }
  };
  
  const deleteEntryFromSupabase = async (id: string, entryToDelete?: DiaryEntry): Promise<boolean> => {
    try {
      // Remover do Supabase se o usuário estiver autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        return false;
      }
      
      // Se houver anexos, remova-os do Storage
      if (entryToDelete?.attachments && entryToDelete.attachments.length > 0) {
        // Extrair apenas os caminhos dos arquivos das URLs
        const filesToDelete = entryToDelete.attachments
          .filter(a => a.url && a.url.includes('diary_attachments'))
          .map(a => {
            // Extrair o caminho do arquivo da URL
            const url = new URL(a.url);
            const pathParts = url.pathname.split('/');
            // Remova 'storage/v1/object/public/diary_attachments/' do caminho
            return pathParts.slice(pathParts.length - 2).join('/');
          });

        if (filesToDelete.length > 0) {
          const { error: deleteStorageError } = await supabase.storage
            .from('diary_attachments')
            .remove(filesToDelete);
            
          if (deleteStorageError) {
            console.error("Erro ao remover anexos do Storage:", deleteStorageError);
          }
        }
      }
      
      // Remover a entrada do banco de dados
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', session.user.id);
        
      if (error) {
        console.error("Erro ao remover entrada do diário do Supabase:", error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao remover entrada do diário:", error);
      return false;
    }
  };
  
  return {
    loadEntriesFromSupabase,
    saveEntryToSupabase,
    deleteEntryFromSupabase
  };
};
