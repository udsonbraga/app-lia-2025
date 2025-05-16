
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/home`
        }
      });

      if (error) {
        if (error.message.includes("provider is not enabled")) {
          throw new Error("O provedor Google não está habilitado no Supabase. Por favor, configure-o no painel de controle do Supabase.");
        }
        
        toast({
          title: "Erro ao fazer login com Google",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // O redirecionamento será feito pelo Supabase OAuth
      localStorage.setItem('isAuthenticated', 'true');
    } catch (error: any) {
      console.error("Google login error:", error);
      throw error; // Propagate the error to be handled by the component
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleGoogleLogin
  };
};
