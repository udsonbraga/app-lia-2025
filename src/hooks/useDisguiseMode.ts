
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useDisguiseMode() {
  const [isDisguised, setIsDisguised] = useState(false);
  const [disguisePassword, setDisguisePassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [showExitPasswordPrompt, setShowExitPasswordPrompt] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a saved disguise password
    const savedPassword = localStorage.getItem('disguisePassword');
    if (savedPassword) {
      setIsDisguised(true);
    }
  }, []);

  const handleDisguiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disguisePassword) {
      localStorage.setItem('disguisePassword', disguisePassword);
      setIsDisguised(true);
      setShowPasswordPrompt(false);
      toast({
        title: "Modo disfarce ativado",
        description: "O aplicativo agora está em modo disfarce",
      });
      // Force page reload to apply disguise
      window.location.reload();
    }
  };

  const toggleDisguise = () => {
    if (!isDisguised) {
      setShowPasswordPrompt(true);
    } else {
      setShowExitPasswordPrompt(true);
    }
  };

  const exitDisguiseMode = (password: string) => {
    const savedPassword = localStorage.getItem('disguisePassword');
    
    if (password === savedPassword) {
      setIsDisguised(false);
      localStorage.removeItem('disguisePassword');
      navigate('/home');
      toast({
        title: "Modo disfarce desativado",
        description: "Você saiu do modo disfarce com sucesso.",
      });
      // Force page reload to exit disguise
      window.location.reload();
    } else {
      toast({
        title: "Senha incorreta",
        description: "A senha fornecida não está correta.",
        variant: "destructive",
      });
    }
    setShowExitPasswordPrompt(false);
  };

  // Function to reset all passwords
  const resetAllPasswords = () => {
    // Clear disguise mode password
    localStorage.removeItem('disguisePassword');
    setIsDisguised(false);
    setDisguisePassword("");
    
    // Clear emergency contacts (if they exist)
    localStorage.removeItem('contactName');
    localStorage.removeItem('contactNumber');
    
    // Clear any other stored password
    localStorage.removeItem('contacts'); // Safe contacts
    
    toast({
      title: "Senhas resetadas",
      description: "Todas as senhas e dados de contato foram removidos com sucesso.",
    });
  };

  return {
    isDisguised,
    disguisePassword,
    showPasswordPrompt,
    showExitPasswordPrompt,
    setDisguisePassword,
    setShowPasswordPrompt,
    setShowExitPasswordPrompt,
    handleDisguiseSubmit,
    toggleDisguise,
    exitDisguiseMode,
    resetAllPasswords
  };
}
