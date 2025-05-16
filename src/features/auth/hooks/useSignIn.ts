
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cleanupAuthState } from "../utils/authStateUtils";

/**
 * Hook para gerenciar o processo de login
 */
export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Limpar estado de autenticação anterior
      cleanupAuthState();
      
      console.log("Tentando login com:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro de login:", error.message);
        
        // Specific handling for email not confirmed error
        if (error.message.includes("Email not confirmed")) {
          setError("Email not confirmed");
          throw new Error("Email not confirmed");
        } else {
          toast({
            title: "Erro ao fazer login",
            description: "Verifique seus dados e tente novamente.",
            variant: "destructive"
          });
        }
        
        setError(error.message);
        setIsLoading(false);
        return false;
      }

      console.log("Login bem-sucedido:", data.user?.email);
      
      // Verificar se o usuário está autenticado
      if (data.user) {
        localStorage.setItem('isAuthenticated', 'true');
        
        if (data.user.user_metadata?.name) {
          localStorage.setItem('userName', data.user.user_metadata.name);
        }
        
        navigate('/home');
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vinda de volta!`,
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Erro no processo de login:", error);
      
      if (error.message === "Email not confirmed") {
        // Let the component handle this specific error
        throw error;
      } else {
        toast({
          title: "Erro de sistema",
          description: "Ocorreu um erro ao processar sua solicitação.",
          variant: "destructive"
        });
      }
      
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signIn,
    isLoading,
    error
  };
};
