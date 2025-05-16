
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState } from "../utils/authStateUtils";

/**
 * Hook para gerenciar o processo de logout
 */
export const useSignOut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signOut = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Limpar tokens de autenticação
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro ao fazer logout:", error);
        setError(error.message);
        setIsLoading(false);
        return false;
      }
      
      navigate('/login');
      return true;
    } catch (error: any) {
      console.error("Erro no processo de logout:", error);
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signOut,
    isLoading,
    error
  };
};
