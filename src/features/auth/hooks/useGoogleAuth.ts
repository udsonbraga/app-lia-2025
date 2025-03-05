
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showGoogleSelector, setShowGoogleSelector] = useState(false);

  const handleGoogleLogin = () => {
    setShowGoogleSelector(true);
  };

  const handleGoogleAccountSelect = async (selectedEmail: string) => {
    setIsLoading(true);
    try {
      // Simulate sign in with the selected Google account
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('isAuthenticated', 'true');
      
      // Extract name from email (simple approach)
      const userName = selectedEmail.split('@')[0].replace(/\./g, ' ').replace(/(\w)(\w*)/g, 
        (g0, g1, g2) => g1.toUpperCase() + g2);
      
      localStorage.setItem('userName', userName);
      
      toast({
        title: "Login efetuado com sucesso",
        description: `Bem-vinda, ${userName}!`,
      });
      
      setShowGoogleSelector(false);
      navigate('/home');
    } catch (error) {
      toast({
        title: "Erro ao fazer login com Google",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const cancelGoogleLogin = () => {
    setShowGoogleSelector(false);
  };

  return {
    isLoading,
    showGoogleSelector,
    handleGoogleLogin,
    handleGoogleAccountSelect,
    cancelGoogleLogin
  };
};
