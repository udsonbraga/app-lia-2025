
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { DisguisedMode } from "@/components/DisguisedMode";
import { NormalMode } from "@/components/NormalMode";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { useFinancialNotes } from "@/hooks/useFinancialNotes";
import { useMotionDetector } from "@/hooks/useMotionDetector";

const Index = () => {
  const {
    isDisguised,
    disguisePassword,
    showPasswordPrompt,
    setDisguisePassword,
    setShowPasswordPrompt,
    handleDisguiseSubmit,
    toggleDisguise
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
    <div className={`min-h-screen ${isDisguised ? 'bg-white' : 'bg-gradient-to-b from-rose-50 to-white'}`}>
      <Header 
        isDisguised={isDisguised} 
        toggleDisguise={toggleDisguise} 
      />
      
      <div className="container mx-auto px-4 pt-20 pb-20">
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

      <BottomNavigation 
        isDisguised={isDisguised}
        onDisguiseToggle={toggleDisguise}
      />
    </div>
  );
};

export default Index;
