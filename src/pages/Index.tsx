
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { DisguisedMode } from "@/components/DisguisedMode";
import { NormalMode } from "@/components/NormalMode";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { useFinancialNotes } from "@/hooks/useFinancialNotes";
import { useMotionDetector } from "@/hooks/useMotionDetector";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

const Index = () => {
  const {
    isDisguised,
    disguisePassword,
    showPasswordPrompt,
    showExitPasswordPrompt,
    setDisguisePassword,
    setShowPasswordPrompt,
    setShowExitPasswordPrompt,
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

  const [exitPassword, setExitPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Use motion detector
  useMotionDetector();

  // Apply disguise class to document body
  useEffect(() => {
    if (isDisguised) {
      document.body.classList.add('disguised-mode');
    } else {
      document.body.classList.remove('disguised-mode');
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

      {/* Exit Disguise Mode Password Dialog - Improved styling */}
      <Dialog open={showExitPasswordPrompt} onOpenChange={setShowExitPasswordPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="space-y-3">
            <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-[#FF84C6]" />
            </div>
            <DialogTitle className="text-center text-xl">Verificação de Senha</DialogTitle>
            <DialogDescription className="text-center">
              Para sair do modo disfarce, digite sua senha.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <Input
              type="password"
              value={exitPassword}
              onChange={(e) => setExitPassword(e.target.value)}
              placeholder="Digite sua senha"
              className="mb-4 border-[#FF84C6] focus:ring-[#FF84C6]"
              autoFocus
            />
          </div>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowExitPasswordPrompt(false)}
              className="border-[#FF84C6] text-[#FF84C6] hover:bg-pink-50 transition-colors duration-200"
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                exitDisguiseMode(exitPassword);
                setExitPassword("");
              }}
              className="bg-[#FF84C6] hover:bg-[#FF6CB7] transition-colors duration-200"
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
