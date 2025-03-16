import { useState, useEffect } from "react";
import { FinancialNote } from "@/types/financial";
import { useToast } from "@/hooks/use-toast";
import { supabase, testSupabaseInsert } from "@/integrations/supabase/client";

export function useFinancialNotes() {
  const [notes, setNotes] = useState<FinancialNote[]>(() => {
    const saved = localStorage.getItem('financialNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteToEdit, setNoteToEdit] = useState<FinancialNote | null>(null);
  const { toast } = useToast();

  const handleSaveNote = async (newNote: FinancialNote) => {
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

    try {
      const userId = localStorage.getItem('userId') || 'test-user-id';
      
      const supabaseNote = {
        user_id: userId,
        title: newNote.title,
        amount: newNote.amount,
        category: newNote.category,
        duedate: newNote.dueDate,
        ispaid: newNote.isPaid,
        isrecurring: newNote.isRecurring,
        recurrenceinterval: newNote.recurrenceInterval,
        description: newNote.description,
        createdat: new Date().toISOString()
      };
      
      const result = await testSupabaseInsert('financial_notes', supabaseNote);
      
      if (result.success) {
        console.log('✅ Verificação Supabase: Nota financeira salva com sucesso no banco!', result.data);
      } else {
        console.error('❌ Verificação Supabase: Erro ao salvar nota no banco:', result.error);
      }
    } catch (error) {
      console.error('Erro ao tentar salvar no Supabase:', error);
    }

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

  const fetchNotesFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('financial_notes')
        .select('*')
        .order('createdat', { ascending: false });
        
      if (error) {
        console.error('Erro ao buscar notas do Supabase:', error);
        return;
      }
      
      console.log('Notas recuperadas do Supabase:', data);
      toast({
        title: "Consulta ao banco realizada",
        description: `Foram encontradas ${data.length} notas no banco. Veja o console para detalhes.`,
      });
    } catch (error) {
      console.error('Erro ao consultar o Supabase:', error);
    }
  };

  return {
    notes,
    noteToEdit,
    handleSaveNote,
    handleEditNote: (note: FinancialNote) => setNoteToEdit(note),
    handleDeleteNote: (noteId: string) => {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      localStorage.setItem('financialNotes', JSON.stringify(updatedNotes));
      
      toast({
        title: "Nota removida",
        description: "A anotação financeira foi removida com sucesso.",
      });
    },
    toggleNotePaid: (noteId: string) => {
      const updatedNotes = notes.map(note => 
        note.id === noteId ? { ...note, isPaid: !note.isPaid } : note
      );
      setNotes(updatedNotes);
      localStorage.setItem('financialNotes', JSON.stringify(updatedNotes));
    },
    setNoteToEdit,
    fetchNotesFromSupabase
  };
}
