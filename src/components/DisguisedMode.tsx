
import { FinancialForm } from "@/components/FinancialForm";
import { FinancialNotesList } from "@/components/FinancialNotesList";
import { FinancialNote } from "@/types/financial";

interface DisguisedModeProps {
  notes: FinancialNote[];
  noteToEdit: FinancialNote | null;
  handleSaveNote: (note: FinancialNote) => void;
  toggleNotePaid: (noteId: string) => void;
  handleEditNote: (note: FinancialNote) => void;
  handleDeleteNote: (noteId: string) => void;
  setNoteToEdit: (note: FinancialNote | null) => void;
}

export function DisguisedMode({
  notes,
  noteToEdit,
  handleSaveNote,
  toggleNotePaid,
  handleEditNote,
  handleDeleteNote,
  setNoteToEdit
}: DisguisedModeProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <FinancialForm 
        onSave={handleSaveNote}
        noteToEdit={noteToEdit}
        onCancelEdit={() => setNoteToEdit(null)}
      />
      <FinancialNotesList 
        notes={notes}
        onTogglePaid={toggleNotePaid}
        onEdit={handleEditNote}
        onDelete={handleDeleteNote}
      />
    </div>
  );
}
