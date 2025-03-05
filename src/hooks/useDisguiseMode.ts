
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
    // Verifica se há uma senha de disfarce salva
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
    } else {
      toast({
        title: "Senha incorreta",
        description: "A senha fornecida não está correta.",
        variant: "destructive",
      });
    }
    setShowExitPasswordPrompt(false);
  };

  // Nova função para resetar todas as senhas
  const resetAllPasswords = () => {
    // Limpar senha do modo disfarce
    localStorage.removeItem('disguisePassword');
    setIsDisguised(false);
    setDisguisePassword("");
    
    // Limpar contatos de emergência (se existirem)
    localStorage.removeItem('contactName');
    localStorage.removeItem('contactNumber');
    
    // Limpar qualquer outra senha armazenada
    localStorage.removeItem('contacts'); // Contatos seguros
    
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
