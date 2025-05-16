
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cleanupAuthState } from "../utils/authStateUtils";

/**
 * Hook para gerenciar o processo de cadastro
 */
export const useSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Limpar estado de autenticação anterior
      cleanupAuthState();
      
      console.log("Tentando cadastro para:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          },
        }
      });

      if (error) {
        console.error("Erro de cadastro:", error.message);
        toast({
          title: "Erro ao criar conta",
          description: error.message,
          variant: "destructive"
        });
        
        setError(error.message);
        setIsLoading(false);
        return false;
      }

      // Armazenar o nome do usuário para uso em todo o aplicativo
      localStorage.setItem('userName', name);

      if (data.user?.identities?.length === 0) {
        toast({
          title: "Este email já está em uso",
          description: "Por favor, tente fazer login ou use outro email.",
          variant: "destructive"
        });
        setIsLoading(false);
        return false;
      }
      
      if (data.session) {
        // Login automático após cadastro (se não precisar confirmar email)
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home');
      } else {
        // Provavelmente precisa confirmar email
        toast({
          title: "Conta criada com sucesso!",
          description: "Verifique seu email para confirmar sua conta.",
        });
        navigate('/login');
      }
      
      return true;
    } catch (error: any) {
      console.error("Erro no processo de cadastro:", error);
      toast({
        title: "Erro de sistema",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
      
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUp,
    isLoading,
    error
  };
};
