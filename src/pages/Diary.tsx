
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DrawerMenu } from "@/components/DrawerMenu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Paperclip, Save } from "lucide-react";

const Diary = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const handleSave = () => {
    // Aqui você implementaria a lógica para salvar o diário
    toast({
      title: "Diário salvo",
      description: "Suas anotações foram salvas com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm flex items-center px-4 z-50">
        <DrawerMenu />
        <h1 className="text-xl font-semibold text-center flex-1">Diário Seguro</h1>
        <div className="w-8" />
      </div>

      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Escreva seus pensamentos aqui..."
            className="w-full h-64 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
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
        </div>
      </div>
    </div>
  );
};

export default Diary;
