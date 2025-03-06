
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate sign in with Google without account selection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use a fixed email for demo purposes
      const userEmail = "usuario@gmail.com";
      localStorage.setItem('isAuthenticated', 'true');
      
      // Extract name from email (simple approach)
      const userName = userEmail.split('@')[0].replace(/\./g, ' ').replace(/(\w)(\w*)/g, 
        (g0, g1, g2) => g1.toUpperCase() + g2);
      
      localStorage.setItem('userName', userName);
      
      toast({
        title: "Login efetuado com sucesso",
        description: `Bem-vinda, ${userName}!`,
      });
      
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

  return {
    isLoading,
    handleGoogleLogin
  };
};
