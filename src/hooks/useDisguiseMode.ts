
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useDisguiseMode() {
  const [isDisguised, setIsDisguised] = useState(false);
  const [disguisePassword, setDisguisePassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const { toast } = useToast();

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
    setDisguisePassword,
    setShowPasswordPrompt,
    handleDisguiseSubmit,
    toggleDisguise,
    resetAllPasswords
  };
}
