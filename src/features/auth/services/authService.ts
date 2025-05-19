
import { supabase } from "@/integrations/supabase/client";
import { cleanupAuthState, getAuthErrorMessage } from "../utils/authUtils";
import { useToast } from "@/hooks/use-toast";

export const useAuthService = () => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        const errorMessage = getAuthErrorMessage(error.message);
        
        toast({
          title: "Erro ao fazer login",
          description: errorMessage,
          variant: "destructive"
        });
        
        return {
          success: false,
          error: errorMessage,
          data: null
        };
      }

      // Verificar se o usuário está autenticado
      if (data.user) {
        localStorage.setItem('isAuthenticated', 'true');
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vinda de volta!`,
        });
        return {
          success: true,
          error: null,
          data
        };
      }
      
      return {
        success: false,
        error: "Falha na autenticação",
        data: null
      };
    } catch (error: any) {
      const errorMessage = "Ocorreu um erro ao processar sua solicitação.";
      
      toast({
        title: "Erro de sistema",
        description: errorMessage,
        variant: "destructive"
      });
      
      return {
        success: false,
        error: errorMessage,
        data: null
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
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
        toast({
          title: "Erro ao criar conta",
          description: "Verifique seus dados e tente novamente.",
          variant: "destructive"
        });
        
        return {
          success: false,
          error: error.message,
          data: null
        };
      }

      // Armazenar o nome do usuário para uso em todo o aplicativo
      localStorage.setItem('userName', name);
      
      // Success toast notification - will show alongside the dialog
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vinda ao SafeLady.",
      });
      
      localStorage.setItem('isAuthenticated', 'true');
      return {
        success: true,
        error: null,
        data
      };
    } catch (error: any) {
      toast({
        title: "Erro de sistema",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
      
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  };

  const signOut = async () => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }
      
      return {
        success: true,
        error: null
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  };

  return {
    signIn,
    signUp,
    signOut
  };
};
