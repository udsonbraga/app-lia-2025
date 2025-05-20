
import { useState, useEffect } from "react";
import { DiaryEntry } from "@/types/diary";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDiaryEntries = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('diaryEntries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing diary entries:", e);
        return [];
      }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Função para carregar entradas do Supabase
  const loadEntriesFromSupabase = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log("Usuário não autenticado, carregando apenas do localStorage");
        setIsLoading(false);
        return;
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
        setIsLoading(false);
        return;
      }
      
      if (data && data.length > 0) {
        console.log("Entradas carregadas do Supabase:", data);
        
        // Converter dados do Supabase para o formato DiaryEntry
        const supabaseEntries = await Promise.all(data.map(async entry => {
          // Buscar anexos do Storage se houver
          let attachments = [];
          
          try {
            // Buscar arquivos do Storage associados a esta entrada do diário
            const { data: storageFiles, error: storageError } = await supabase.storage
              .from('diary_attachments')
              .list(`${session.user.id}`, {
                search: entry.id
              });
              
            if (storageError) {
              console.error("Erro ao buscar anexos do Storage:", storageError);
            } else if (storageFiles) {
              attachments = storageFiles.map(file => {
                const { data: { publicUrl } } = supabase.storage
                  .from('diary_attachments')
                  .getPublicUrl(`${session.user.id}/${file.name}`);
                  
                return {
                  name: file.name,
                  url: publicUrl
                };
              });
            }
          } catch (fileError) {
            console.error("Erro ao processar anexos:", fileError);
          }
          
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
        const localEntryIds = entries.map(e => e.id);
        const newEntries = [
          ...entries,
          ...supabaseEntries.filter(e => !localEntryIds.includes(e.id))
        ];
        
        setEntries(newEntries);
        localStorage.setItem('diaryEntries', JSON.stringify(newEntries));
        toast({
          title: "Diário sincronizado",
          description: "Suas entradas foram carregadas com sucesso da nuvem."
        });
      }
    } catch (error) {
      console.error("Erro ao carregar entradas do diário:", error);
      toast({
        title: "Erro na sincronização",
        description: "Ocorreu um problema ao tentar sincronizar com a nuvem.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('diaryEntries', JSON.stringify(entries));
  }, [entries]);
  
  // Carregar entradas do Supabase na inicialização
  useEffect(() => {
    loadEntriesFromSupabase();
  }, []);

  const addEntry = async (entry: DiaryEntry) => {
    try {
      // Salvar localmente primeiro para garantir resposta rápida ao usuário
      setEntries(prev => [entry, ...prev]);
      
      // Salvar no Supabase se o usuário estiver autenticado
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user?.id) {
        console.log("Salvando entrada no Supabase para usuário:", session.user.id);
        
        // Se houver anexos com URLs permanentes do Storage
        let supabaseAttachments = [];
        if (entry.attachments && entry.attachments.length > 0) {
          console.log("Anexos detectados:", entry.attachments.length);
          
          // Os anexos já foram carregados no Storage pelo DiaryForm
          // Precisamos apenas armazenar a referência
          supabaseAttachments = entry.attachments.map(attachment => ({
            url: attachment.url,
            name: attachment.name
          }));
        }
        
        const { error } = await supabase
          .from('diary_entries')
          .insert({
            user_id: session.user.id,
            title: entry.title || entry.text.substring(0, 50),
            content: entry.text,
            date: entry.date.toISOString().split('T')[0],
            mood: entry.mood || null
          });
          
        if (error) {
          console.error("Erro ao salvar entrada do diário no Supabase:", error);
          throw new Error(`Erro na sincronização: ${error.message}`);
        } else {
          console.log("Entrada salva com sucesso no Supabase");
        }
      } else {
        console.log("Usuário não autenticado, salvando apenas no localStorage");
      }
      
      return true;
    } catch (error) {
      console.error("Erro ao salvar entrada do diário:", error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      setEntries(prev => prev.filter(entry => entry.id !== id));
      
      // Remover do Supabase se o usuário estiver autenticado
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.id) {
        // Primeiro, encontre a entrada para obter info dos anexos
        const entryToDelete = entries.find(e => e.id === id);
        
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
          toast({
            title: "Erro na sincronização",
            description: "O relato foi removido localmente, mas não foi sincronizado com a nuvem.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Relato removido",
            description: "O relato foi removido com sucesso de todos os dispositivos.",
          });
        }
      } else {
        toast({
          title: "Relato removido",
          description: "O relato foi removido localmente.",
        });
      }
    } catch (error) {
      console.error("Erro ao remover entrada do diário:", error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o relato. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  return {
    entries,
    addEntry,
    deleteEntry,
    isLoading
  };
};

export default useDiaryEntries;
