
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { DisguisedMode } from "@/components/DisguisedMode";
import { NormalMode } from "@/components/NormalMode";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { useFinancialNotes } from "@/hooks/useFinancialNotes";
import { useMotionDetector } from "@/hooks/useMotionDetector";
import { useState, useEffect } from "react";

const Index = () => {
  const {
    isDisguised,
    showPasswordPrompt,
    setShowPasswordPrompt,
    handleDisguiseSubmit,
    toggleDisguise,
    exitDisguiseMode
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

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Use motion detector
  useMotionDetector();

  // Apply disguise class to document body
  useEffect(() => {
    if (isDisguised) {
      document.body.classList.add('disguised-mode');
      document.title = "Moda Elegante"; // Altera o título da página quando disfarçada
    } else {
      document.body.classList.remove('disguised-mode');
      document.title = "Safe Lady"; // Restaura o título original
    }
  }, [isDisguised]);

  // Check if dark mode is enabled
  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModeEnabled);
  }, []);

  const navigate = useNavigate();

  return (
    <div className={`min-h-screen ${isDisguised ? 'bg-white' : 'bg-gradient-to-b from-rose-100 to-white'} ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        isDisguised={isDisguised} 
        toggleDisguise={toggleDisguise} 
      />
      
      <div className="container mx-auto px-4 pt-20 pb-20">
        {!isDisguised && (
          <div className="mb-8 text-center animate-fade-in">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vinda ao Safe Lady</h1>
            <p className="text-gray-600">Seu aplicativo pessoal de segurança e proteção</p>
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
            exitDisguiseMode={exitDisguiseMode}
          />
        ) : (
          <NormalMode 
            showPasswordPrompt={showPasswordPrompt}
            disguisePassword={""}
            onPasswordChange={() => {}}
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
