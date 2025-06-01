
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DiaryEntry } from '@/types/diary';

interface DiaryFormProps {
  onSubmit: (entry: DiaryEntry) => Promise<boolean>;
  onCancel: () => void;
  initialData?: {
    title: string;
    content: string;
    location?: string;
  };
}

const DiaryForm: React.FC<DiaryFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const { toast } = useToast();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [location, setLocation] = useState(initialData?.location || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha o título e o conteúdo.",
        variant: "destructive",
      });
      return;
    }

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      title: title.trim(),
      text: content.trim(),
      location: location.trim() || null,
      date: new Date(),
      createdAt: new Date(),
      attachments: [],
      tags: [],
    };

    const success = await onSubmit(entry);
    
    if (success) {
      setTitle('');
      setContent('');
      setLocation('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da entrada..."
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva sobre o seu dia..."
          className="min-h-[200px]"
          required
        />
      </div>

      <div>
        <Label htmlFor="location">Local (opcional)</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Onde você estava..."
        />
      </div>

      <div className="flex space-x-2">
        <Button type="submit">Salvar</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default DiaryForm;
