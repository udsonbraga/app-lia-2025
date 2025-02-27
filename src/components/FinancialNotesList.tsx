
import { Check, Pencil, Trash2, Bell } from "lucide-react";
import { FinancialNote } from "@/types/financial";
import { useToast } from "@/hooks/use-toast";

interface FinancialNotesListProps {
  notes: FinancialNote[];
  onTogglePaid: (noteId: string) => void;
  onEdit: (note: FinancialNote) => void;
  onDelete: (noteId: string) => void;
}

export function FinancialNotesList({ notes, onTogglePaid, onEdit, onDelete }: FinancialNotesListProps) {
  const { toast } = useToast();

  const checkDueDate = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3 && diffDays > 0) {
      toast({
        title: "Lembrete de Vencimento",
        description: `A despesa vence em ${diffDays} dia${diffDays > 1 ? 's' : ''}!`,
        duration: 5000,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Despesas</h2>
      {notes.map((note) => {
        checkDueDate(note.dueDate);
        return (
          <div
            key={note.id}
            className="bg-white p-4 rounded-lg shadow-sm space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{note.title}</h3>
                <p className="text-sm text-gray-600">
                  R$ {note.amount.toFixed(2)} - {note.category}
                </p>
                <p className="text-sm text-gray-500">
                  Vencimento: {new Date(note.dueDate).toLocaleDateString()}
                </p>
                {note.description && (
                  <p className="text-sm text-gray-600 mt-2">{note.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onTogglePaid(note.id)}
                  className={`p-2 rounded-full ${
                    note.isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}
                  title={note.isPaid ? "Marcar como não pago" : "Marcar como pago"}
                >
                  <Check className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onEdit(note)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600"
                  title="Editar"
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(note.id)}
                  className="p-2 rounded-full bg-red-100 text-red-600"
                  title="Remover"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
