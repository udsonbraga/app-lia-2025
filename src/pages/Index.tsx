
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { DisguisedMode } from "@/components/DisguisedMode";
import { NormalMode } from "@/components/NormalMode";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { useFinancialNotes } from "@/hooks/useFinancialNotes";
import { useMotionDetector } from "@/hooks/useMotionDetector";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const {
    isDisguised,
    disguisePassword,
    showPasswordPrompt,
    setDisguisePassword,
    setShowPasswordPrompt,
    handleDisguiseSubmit,
    toggleDisguise,
    resetAllPasswords
  } = useDisguiseMode();

  const {
    notes,
    noteToEdit,
    handleSaveNote,
    handleEditNote,
    handleDeleteNote,
    toggleNotePaid,
    setNoteToEdit
  } = useFinancialNotes();

  // Usar o detector de movimento
  useMotionDetector();

  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${isDisguised ? 'bg-white' : 'bg-gradient-to-b from-rose-100 to-white'}`}>
      <Header 
        isDisguised={isDisguised} 
        toggleDisguise={toggleDisguise} 
      />
      
      <div className="container mx-auto px-4 pt-20 pb-20">
        {!isDisguised && (
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vinda ao Safe Lady</h1>
            <p className="text-gray-600">Seu aplicativo pessoal de segurança e proteção</p>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 mx-auto border-safelady text-safelady hover:bg-safelady/10"
                onClick={resetAllPasswords}
              >
                <RefreshCw size={16} />
                Resetar todas as senhas
              </Button>
            </div>
          </div>
        )}
        
        {isDisguised ? (
          <DisguisedMode 
            notes={notes}
            noteToEdit={noteToEdit}
            handleSaveNote={handleSaveNote}
            toggleNotePaid={toggleNotePaid}
            handleEditNote={handleEditNote}
            handleDeleteNote={handleDeleteNote}
            setNoteToEdit={setNoteToEdit}
          />
        ) : (
          <NormalMode 
            showPasswordPrompt={showPasswordPrompt}
            disguisePassword={disguisePassword}
            onPasswordChange={setDisguisePassword}
            onDisguiseSubmit={handleDisguiseSubmit}
            onCancel={() => setShowPasswordPrompt(false)}
          />
        )}
      </div>
      
      {!isDisguised && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-1 text-xs text-center">
          © 2025 SafeLady. Todos os direitos reservados.
        </div>
      )}
    </div>
  );
};

export default Index;
