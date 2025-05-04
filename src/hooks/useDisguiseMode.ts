
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useDisguiseMode() {
  const [isDisguised, setIsDisguised] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if disguise mode is active
    const disguiseActive = localStorage.getItem('disguiseMode') === 'active';
    if (disguiseActive) {
      setIsDisguised(true);
    }
  }, []);

  const handleDisguiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('disguiseMode', 'active');
    setIsDisguised(true);
    setShowPasswordPrompt(false);
    toast({
      title: "Modo disfarce ativado",
      description: "O aplicativo agora está em modo disfarce",
    });
    // Force page reload to apply disguise
    window.location.reload();
  };

  const toggleDisguise = () => {
    if (!isDisguised) {
      setShowPasswordPrompt(true);
    } else {
      exitDisguiseMode();
    }
  };

  const exitDisguiseMode = () => {
    setIsDisguised(false);
    localStorage.removeItem('disguiseMode');
    navigate('/home');
    toast({
      title: "Modo disfarce desativado",
      description: "Você saiu do modo disfarce com sucesso.",
    });
    // Force page reload to exit disguise
    window.location.reload();
  };

  // Function to reset all passwords
  const resetAllPasswords = () => {
    // Clear disguise mode flag
    localStorage.removeItem('disguiseMode');
    setIsDisguised(false);
    
    // Clear emergency contacts (if they exist)
    localStorage.removeItem('contactName');
    localStorage.removeItem('contactNumber');
    
    // Clear any other stored data
    localStorage.removeItem('contacts'); // Safe contacts
    
    toast({
      title: "Dados resetados",
      description: "Todos os dados foram removidos com sucesso.",
    });
  };

  return {
    isDisguised,
    showPasswordPrompt,
    setShowPasswordPrompt,
    handleDisguiseSubmit,
    toggleDisguise,
    exitDisguiseMode,
    resetAllPasswords
  };
}
