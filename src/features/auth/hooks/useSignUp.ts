
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
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
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
      
      // Em vez de navegar diretamente, mostrar o diálogo de sucesso
      setRegisteredEmail(email);
      setShowSuccessDialog(true);
      
      // A navegação será tratada pelo diálogo após o fechamento
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
  
  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    // Navegação é feita pelo componente de diálogo
  };

  return {
    signUp,
    isLoading,
    error,
    showSuccessDialog,
    registeredEmail,
    closeSuccessDialog
  };
};
