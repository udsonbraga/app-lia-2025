
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Paperclip, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface DiaryEntry {
  id: string;
  text: string;
  attachments: string[];
  createdAt: Date;
}

const Diary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('diaryEntries');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleSave = () => {
    if (!text.trim()) {
      toast({
        title: "Erro ao salvar",
        description: "O texto não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      text,
      attachments: attachments.map(file => file.name),
      createdAt: new Date(),
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));

    setText("");
    setAttachments([]);

    toast({
      title: "Diário salvo",
      description: "Suas anotações foram salvas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold">Diário Seguro</h1>
            <div className="w-8" /> {/* Espaçador para manter o título centralizado */}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="max-w-2xl mx-auto space-y-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva seus pensamentos aqui..."
            className="w-full h-48 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-input')?.click()}
                className="flex items-center gap-2"
              >
                <Paperclip className="h-4 w-4" />
                Anexar arquivo
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                className="hidden"
                onChange={handleAttachment}
              />
            </div>

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
            className="w-full flex items-center justify-center gap-2"
          >
            <Save className="h-4 w-4" />
            Salvar
          </Button>

          {entries.length > 0 && (
            <div className="mt-8 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Entradas anteriores</h2>
              <div className="divide-y divide-gray-100">
                {entries.map((entry) => (
                  <div key={entry.id} className="py-4">
                    <div className="flex justify-between items-start mb-2">
                      <time className="text-sm text-gray-500">
                        {format(new Date(entry.createdAt), "dd/MM/yyyy 'às' HH:mm")}
                      </time>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.text}</p>
                    {entry.attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-600">Anexos:</p>
                        <ul className="mt-1 space-y-1">
                          {entry.attachments.map((attachment, index) => (
                            <li key={index} className="text-sm text-gray-500">
                              {attachment}
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
