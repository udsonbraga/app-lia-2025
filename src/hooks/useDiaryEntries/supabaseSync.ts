
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
      
      console.log("Carregando entradas do Supabase para usuário:", session.user.id);
      
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
        console.log("Entradas carregadas do Supabase:", data.length);
        
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
          ...currentEntries.filter(e => !data.some(se => se.id === e.id)), // Manter entradas locais não sincronizadas
          ...supabaseEntries
        ];
        
        toast({
          title: "Diário sincronizado",
          description: `${data.length} entradas carregadas da nuvem.`
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
      
      // Verificar se a entrada já existe
      const { data: existingEntry } = await supabase
        .from('diary_entries')
        .select('id')
        .eq('id', entry.id)
        .single();
      
      if (existingEntry) {
        // Atualizar entrada existente
        const { error } = await supabase
          .from('diary_entries')
          .update({
            title: entry.title || entry.text.substring(0, 50),
            content: entry.text,
            date: entry.date.toISOString().split('T')[0],
            mood: entry.mood || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', entry.id)
          .eq('user_id', userId);
          
        if (error) {
          console.error("Erro ao atualizar entrada do diário no Supabase:", error);
          throw new Error(`Erro na sincronização: ${error.message}`);
        }
        
        console.log("Entrada atualizada com sucesso no Supabase");
      } else {
        // Criar nova entrada
        const { error } = await supabase
          .from('diary_entries')
          .insert({
            id: entry.id,
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
      }
      
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
      
      console.log("Removendo entrada do Supabase:", id);
      
      // Se houver anexos, remova-os do Storage
      if (entryToDelete?.attachments && entryToDelete.attachments.length > 0) {
        const filesToDelete = entryToDelete.attachments
          .filter(a => a.url && a.url.includes('diary_attachments'))
          .map(a => {
            const url = new URL(a.url);
            const pathParts = url.pathname.split('/');
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
      
      console.log("Entrada removida com sucesso do Supabase");
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
