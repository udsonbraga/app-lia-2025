
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { FinancialNote, FinancialCategory } from "@/types/financial";
import { useToast } from "@/hooks/use-toast";

interface FinancialFormProps {
  onSave: (note: FinancialNote) => void;
  noteToEdit?: FinancialNote | null;
  onCancelEdit?: () => void;
}

const CATEGORIES: FinancialCategory[] = [
  "Cartão de Crédito",
  "Aluguel",
  "Parcelas",
  "Contas",
  "Outros"
];

export function FinancialForm({ onSave, noteToEdit, onCancelEdit }: FinancialFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<FinancialCategory>("Outros");
  const [dueDate, setDueDate] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceInterval, setRecurrenceInterval] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setAmount(noteToEdit.amount.toString());
      setCategory(noteToEdit.category as FinancialCategory);
      setDueDate(noteToEdit.dueDate);
      setIsRecurring(noteToEdit.isRecurring);
      setRecurrenceInterval(noteToEdit.recurrenceInterval || 'monthly');
      setDescription(noteToEdit.description || "");
      setShowForm(true);
    }
  }, [noteToEdit]);

  const handleSave = () => {
    if (!title || !amount || !dueDate) {
      toast({
        title: "Erro ao salvar",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const noteData: FinancialNote = {
      id: noteToEdit?.id || Date.now().toString(),
      title,
      amount: Number(amount),
      category,
      dueDate,
      isRecurring,
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
      description,
      isPaid: noteToEdit?.isPaid || false,
      createdAt: noteToEdit?.createdAt || new Date().toISOString(),
    };

    onSave(noteData);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Outros");
    setDueDate("");
    setIsRecurring(false);
    setRecurrenceInterval('monthly');
    setDescription("");
    setShowForm(false);
    if (onCancelEdit) onCancelEdit();
  };

  if (!showForm && !noteToEdit) {
    return (
      <Button
        onClick={() => setShowForm(true)}
        className="w-full flex items-center justify-center gap-2 bg-safelady hover:bg-safelady-dark text-white"
      >
        <Plus className="h-4 w-4" />
        Adicionar Nova Despesa
      </Button>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <h3 className="text-lg font-semibold">
        {noteToEdit ? "Editar Despesa" : "Nova Despesa"}
      </h3>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      
      <input
        type="number"
        placeholder="Valor"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as FinancialCategory)}
        className="w-full p-2 border rounded"
      >
        {CATEGORIES.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-2 border rounded"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
        />
        <label htmlFor="isRecurring">Despesa Recorrente</label>
      </div>

      {isRecurring && (
        <select
          value={recurrenceInterval}
          onChange={(e) => setRecurrenceInterval(e.target.value as 'monthly' | 'weekly' | 'yearly')}
          className="w-full p-2 border rounded"
        >
          <option value="monthly">Mensal</option>
          <option value="weekly">Semanal</option>
          <option value="yearly">Anual</option>
        </select>
      )}

      <textarea
        placeholder="Descrição (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border rounded"
        rows={3}
      />

      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1 bg-safelady hover:bg-safelady-dark">
          <Save className="h-4 w-4 mr-2" />
          {noteToEdit ? "Atualizar" : "Salvar"}
        </Button>
        <Button variant="outline" onClick={resetForm} className="flex-1">
          Cancelar
        </Button>
      </div>
    </div>
  );
}
