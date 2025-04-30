
import { useState, useEffect } from "react";
import { FinancialNote } from "@/types/financial";
import { useToast } from "@/hooks/use-toast";

export function useFinancialNotes() {
  const [notes, setNotes] = useState<FinancialNote[]>(() => {
    const saved = localStorage.getItem('financialNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteToEdit, setNoteToEdit] = useState<FinancialNote | null>(null);
  const { toast } = useToast();

  const handleSaveNote = (newNote: FinancialNote) => {
    let updatedNotes;
    if (noteToEdit) {
      updatedNotes = notes.map(note => 
        note.id === newNote.id ? newNote : note
      );
      setNoteToEdit(null);
    } else {
      updatedNotes = [...notes, newNote];
    }
    
    setNotes(updatedNotes);
    localStorage.setItem('financialNotes', JSON.stringify(updatedNotes));

    toast({
      title: noteToEdit ? "Nota atualizada" : "Nota salva",
      description: noteToEdit 
        ? "Sua anotação financeira foi atualizada com sucesso."
        : "Sua anotação financeira foi salva com sucesso.",
    });
  };

  const handleEditNote = (note: FinancialNote) => {
    setNoteToEdit(note);
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
    localStorage.setItem('financialNotes', JSON.stringify(updatedNotes));
    
    toast({
      title: "Nota removida",
      description: "A anotação financeira foi removida com sucesso.",
    });
  };

  const toggleNotePaid = (noteId: string) => {
    const updatedNotes = notes.map(note => 
      note.id === noteId ? { ...note, isPaid: !note.isPaid } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem('financialNotes', JSON.stringify(updatedNotes));
  };

  return {
    notes,
    noteToEdit,
    handleSaveNote,
    handleEditNote,
    handleDeleteNote,
    toggleNotePaid,
    setNoteToEdit
  };
}
