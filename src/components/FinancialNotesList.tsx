
import { Check } from "lucide-react";
import { FinancialNote } from "@/types/financial";

interface FinancialNotesListProps {
  notes: FinancialNote[];
  onTogglePaid: (noteId: string) => void;
}

export function FinancialNotesList({ notes, onTogglePaid }: FinancialNotesListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Despesas</h2>
      {notes.map((note) => (
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
            <button
              onClick={() => onTogglePaid(note.id)}
              className={`p-2 rounded-full ${
                note.isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Check className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
