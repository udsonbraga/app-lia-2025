
import { useState, useEffect } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { EmergencyButton } from "@/components/EmergencyButton";
import { MainNavigation } from "@/components/MainNavigation";
import { FinancialForm } from "@/components/FinancialForm";
import { FinancialNotesList } from "@/components/FinancialNotesList";
import { DisguisePasswordPrompt } from "@/components/DisguisePasswordPrompt";
import { FinancialNote } from "@/types/financial";

const Index = () => {
  const [isDisguised, setIsDisguised] = useState(false);
  const [disguisePassword, setDisguisePassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [notes, setNotes] = useState<FinancialNote[]>(() => {
    const saved = localStorage.getItem('financialNotes');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteToEdit, setNoteToEdit] = useState<FinancialNote | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDisguiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disguisePassword) {
      localStorage.setItem('disguisePassword', disguisePassword);
      setIsDisguised(true);
      setShowPasswordPrompt(false);
    }
  };

  const toggleDisguise = () => {
    if (!isDisguised) {
      setShowPasswordPrompt(true);
    } else {
      const savedPassword = prompt("Digite a senha para sair do modo disfarce:");
      if (savedPassword === localStorage.getItem('disguisePassword')) {
        setIsDisguised(false);
        localStorage.removeItem('disguisePassword');
      } else {
        toast({
          title: "Senha incorreta",
          description: "A senha fornecida não está correta.",
          variant: "destructive",
        });
      }
    }
  };

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

  useEffect(() => {
    // Check for saved disguise mode
    const savedPassword = localStorage.getItem('disguisePassword');
    if (savedPassword) {
      setIsDisguised(true);
    }
    
    // Motion detection code
    let lastY = 0;
    let lastX = 0;
    let lastZ = 0;
    let lastTime = new Date().getTime();

    const handleMotion = (event: DeviceMotionEvent) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTime;
      
      if (timeDiff < 100) return;
      
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;
      
      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;
      
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);
      
      if (deltaX + deltaY + deltaZ > 30) {
        // Trigger emergency contact
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
      lastTime = currentTime;
    };

    window.addEventListener('devicemotion', handleMotion);
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDisguised ? 'bg-white' : 'bg-gradient-to-b from-rose-50 to-white'}`}>
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            {isDisguised ? (
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-700" />
              </button>
            ) : null}
            <h1 className="text-xl font-semibold">
              {isDisguised ? 'Notas Pessoais' : 'Safe Lady'}
            </h1>
            <button
              onClick={toggleDisguise}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={isDisguised ? "Modo Normal" : "Modo Disfarce"}
            >
              {isDisguised ? 
                <EyeOff className="h-6 w-6 text-red-500" /> : 
                <Eye className="h-6 w-6 text-red-500" />
              }
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pt-20 pb-20">
        {isDisguised ? (
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
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            {showPasswordPrompt && (
              <DisguisePasswordPrompt
                onPasswordChange={setDisguisePassword}
                onSubmit={handleDisguiseSubmit}
                onCancel={() => setShowPasswordPrompt(false)}
              />
            )}

            {!showPasswordPrompt && (
              <div className="w-full max-w-md space-y-6">
                <EmergencyButton />
                <MainNavigation />
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNavigation 
        isDisguised={isDisguised}
        onDisguiseToggle={toggleDisguise}
      />
    </div>
  );
};

export default Index;
