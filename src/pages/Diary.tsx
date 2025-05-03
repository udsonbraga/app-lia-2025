import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, Save, MapPin, Trash2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import html2pdf from 'html2pdf.js';
import { useDiaryEntries } from '@/hooks/useDiaryEntries';
import { useAuth } from '@/hooks/useAuth';

interface DiaryEntry {
  id: string;
  text: string;
  attachments: Array<{
    name: string;
    url?: string;
  }>;
  location: string;
  createdAt: Date;
}

const Diary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Array<{file: File, url: string}>>([]);
  const [userName, setUserName] = useState<string>("");
  
  const {
    entries,
    isLoading,
    addEntry,
    removeEntry,
    uploadImage
  } = useDiaryEntries();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    
    // Se o usuário estiver autenticado, usar o nome do perfil
    if (user) {
      const name = user.user_metadata?.name || '';
      setUserName(name);
      if (name) {
        localStorage.setItem("userName", name);
      }
    }
  }, [user]);

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

  const handleSave = async () => {
    if (!text.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O texto não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Fazer upload das imagens primeiro
      const uploadedAttachments = [];
      
      for (const file of attachments) {
        if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
          const result = await uploadImage(file, user?.id);
          if (result.success) {
            uploadedAttachments.push({
              name: result.name,
              url: result.url
            });
          }
        } else {
          // Para arquivos não-imagem, apenas armazenar o nome
          uploadedAttachments.push({
            name: file.name
          });
        }
      }

      // Criar a entrada do diário
      const result = await addEntry({
        text,
        location: location || "Não informado",
        attachments: uploadedAttachments
      });

      if (result.success) {
        setText("");
        setLocation("");
        setAttachments([]);
        setAttachmentPreviews([]);

        toast({
          title: "Diário salvo",
          description: "Suas anotações foram salvas com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro ao salvar diário:", error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas anotações.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    const result = await removeEntry(id);
    if (result.success) {
      toast({
        title: "Relato removido",
        description: "O relato foi removido com sucesso.",
      });
    }
  };

  const generatePDF = (entry: any) => {
    const content = document.createElement('div');
    const currentUserName = userName || 'Usuário';
    
    let imagesHtml = '';
    if (entry.attachments && entry.attachments.some((att: any) => att.url)) {
      imagesHtml = `
        <h2>Imagens</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; margin-bottom: 20px;">
          ${entry.attachments
            .filter((att: any) => att.url)
            .map((att: any) => `
              <div style="margin-bottom: 10px;">
                <img src="${att.url}" style="max-width: 300px; max-height: 200px; border: 1px solid #ccc; border-radius: 4px;" />
                <p style="margin-top: 5px; font-size: 12px; color: #666;">${att.name}</p>
              </div>
            `).join('')}
        </div>
      `;
    }
    
    content.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; position: relative;">
        <h1 style="text-align: center; color: #000000; font-size: 28px; font-weight: bold;">Relatório Seguro</h1>
        <p><strong>Data:</strong> ${format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm")}</p>
        <p><strong>Local:</strong> ${entry.location}</p>
        <h2>Descrição da Ocorrência</h2>
        <p style="white-space: pre-wrap;">${entry.text}</p>
        
        ${imagesHtml}
        
        ${entry.attachments && entry.attachments.length > 0 ? `
          <h2>Anexos</h2>
          <ul>
            ${entry.attachments.map((attachment: any) => `<li>${attachment.name}</li>`).join('')}
          </ul>
        ` : ''}
        
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; pointer-events: none; opacity: 0.1; transform: rotate(-30deg); font-size: 80px; color: #FF84C6; font-weight: bold;">
          SAFE LADY
        </div>
        
        <footer style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px; text-align: right; font-size: 12px; color: #666;">
          <p>Documento gerado por: ${currentUserName}</p>
          <p>Data de geração: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
        </footer>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `relato-${format(new Date(entry.created_at), "dd-MM-yyyy")}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(content).set(opt).save();

    toast({
      title: "PDF gerado",
      description: "O relatório foi exportado com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold">Diário Seguro</h1>
            <div className="w-8" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
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
              <label htmlFor="diary-text" className="block text-sm font-medium text-gray-700">
                Descreva o Ocorrido
              </label>
              <textarea
                id="diary-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escreva seus pensamentos aqui..."
                className="w-full h-48 p-4 mt-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
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
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-[#FF84C6] hover:bg-[#ff6cb7] text-white"
          >
            <Save className="h-5 w-5" />
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>

          {entries.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Entradas anteriores</h2>
              <div className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <div key={entry.id} className="py-4">
                    <div className="flex justify-between items-start mb-2">
                      <time className="text-sm text-gray-500">
                        {format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm")}
                      </time>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => generatePDF(entry)}
                          className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title="Exportar como PDF"
                        >
                          <FileDown className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Remover relato"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{entry.location}</p>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.text}</p>
                    
                    {entry.attachments && entry.attachments.some((att: any) => att.url) && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Imagens:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {entry.attachments
                            .filter((att: any) => att.url)
                            .map((att: any, idx: number) => (
                              <div key={idx} className="border rounded-md overflow-hidden">
                                <img 
                                  src={att.url} 
                                  alt={att.name}
                                  className="h-32 w-full object-cover" 
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    
                    {entry.attachments && entry.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-600">Anexos:</p>
                        <ul className="mt-1 space-y-1">
                          {entry.attachments.map((attachment: any, index: number) => (
                            <li key={index} className="text-sm text-gray-500">
                              {attachment.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Diary;
