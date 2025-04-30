
import React from "react";
import { FinancialForm } from "@/components/FinancialForm";
import { FinancialNotesList } from "@/components/FinancialNotesList";
import { FinancialCalendar } from "@/components/FinancialCalendar";
import { FinancialExplanation } from "@/components/FinancialExplanation";
import { useFinancialNotes } from "@/hooks/useFinancialNotes";
import { testSupabaseConnection } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

export default function FinancialManagement() {
  const { 
    notes, 
    noteToEdit, 
    handleSaveNote, 
    handleEditNote, 
    handleDeleteNote, 
    toggleNotePaid, 
    setNoteToEdit,
    fetchNotesFromSupabase 
  } = useFinancialNotes();

  React.useEffect(() => {
    // Testa a conexão ao iniciar a página
    const testConnection = async () => {
      const result = await testSupabaseConnection();
      console.log('Teste de conexão Supabase:', result);
    };
    
    testConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Shield className="h-8 w-8 text-[#8B5CF6] mr-3" />
        <h1 className="text-2xl font-bold">Gestão Financeira</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-8">
            <FinancialForm 
              onSave={handleSaveNote} 
              noteToEdit={noteToEdit} 
              onCancelEdit={() => setNoteToEdit(null)}
              onCheckDatabase={fetchNotesFromSupabase}
            />
            
            <FinancialNotesList
              notes={notes}
              onTogglePaid={toggleNotePaid}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
            />
          </div>
        </div>
        
        <div>
          <div className="space-y-8">
            <FinancialCalendar notes={notes} />
            <FinancialExplanation />
          </div>
        </div>
      </div>
    </div>
  );
}
