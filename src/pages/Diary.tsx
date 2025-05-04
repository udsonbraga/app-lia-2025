
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LoadingScreen } from '@/components/LoadingScreen';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { MapPin, Paperclip, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const Diary = () => {
  const { entries, isLoading, addEntry, removeEntry, uploadImage } = useDiaryEntries();
  const [newEntry, setNewEntry] = useState('');
  const [location, setLocation] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Tentar obter localização atual se permitido
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude.toFixed(6);
          const longitude = position.coords.longitude.toFixed(6);
          setLocation(`${latitude}, ${longitude}`);
        },
        (error) => {
          console.log('Erro ao obter localização:', error);
          setLocation('Localização não disponível');
        }
      );
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim() === '') {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, escreva algo no seu relato.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Array para armazenar informações dos arquivos anexados
      const attachments = [];
      
      // Upload de cada arquivo selecionado
      for (const file of selectedFiles) {
        const userId = user?.id || 'anonymous'; 
        const result = await uploadImage(file, userId);
        
        if (result.success) {
          attachments.push({
            name: result.name,
            url: result.url
          });
        }
      }
      
      // Adicionar entrada com os anexos
      await addEntry({
        text: newEntry,
        location: location,
        attachments: attachments
      });
      
      setNewEntry('');
      setSelectedFiles([]);
      
      toast({
        title: 'Relato salvo',
        description: 'Seu relato foi adicionado com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error);
      toast({
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar seu relato.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async (id: string) => {
    const result = await removeEntry(id);
    if (!result.success) {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o relato.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-white">
      <Header />
      
      <div className="container mx-auto px-4 pt-16 pb-20">
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Diário de Segurança</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Novo Relato</CardTitle>
              <CardDescription>
                Registre situações de risco, assédio ou violência que você tenha vivenciado.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Descreva o ocorrido..."
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-500" />
                  <Input 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Localização" 
                    className="flex-1"
                    disabled
                  />
                </div>
                
                <div>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
                      <Paperclip size={16} />
                      <span>Anexar fotos ou vídeos</span>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  
                  {selectedFiles.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-1">Arquivos selecionados:</p>
                      <div className="space-y-1">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-gray-100 rounded px-2 py-1">
                            <span>{file.name}</span>
                            <button 
                              type="button" 
                              onClick={() => removeFile(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button disabled={isSubmitting || newEntry.trim() === ''}>
                    {isSubmitting ? 'Salvando...' : 'Salvar Relato'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Histórico de Relatos</h2>
          
          {entries.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center p-8 text-gray-500">
                <p>Nenhum relato registrado ainda.</p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[400px] rounded-lg border">
              <div className="space-y-4 p-4">
                {entries.map((entry, index) => (
                  <Card key={entry.id} className="bg-white">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-md font-semibold">
                          {formatDistanceToNow(new Date(entry.created_at), { 
                            addSuffix: true,
                            locale: ptBR 
                          })}
                        </CardTitle>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir este relato? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(entry.id)} className="bg-red-500 hover:bg-red-600">
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin size={12} className="mr-1" />
                        <span>{entry.location}</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="whitespace-pre-line text-gray-700">{entry.text}</p>
                      
                      {entry.attachments && entry.attachments.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-2">Anexos:</p>
                          <div className="grid grid-cols-3 gap-2">
                            {entry.attachments.map((attachment: any, idx: number) => (
                              <a 
                                key={idx} 
                                href={attachment.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img 
                                  src={attachment.url} 
                                  alt={attachment.name || 'Anexo'} 
                                  className="rounded object-cover h-20 w-full"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    
                    {index < entries.length - 1 && <Separator />}
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diary;
