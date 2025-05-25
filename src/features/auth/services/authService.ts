
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export const useAuthService = () => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      const result = await apiService.signIn(email, password);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', result.user?.user_metadata?.name || '');
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vinda de volta!`,
      });
      
      return {
        success: true,
        error: null,
        data: result
      };
    } catch (error: any) {
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Erro ao processar login",
        variant: "destructive"
      });
      
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await apiService.signUp(email, password, name);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', name);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vinda ao Lia.",
      });
      
      return {
        success: true,
        error: null,
        data: result
      };
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Erro ao processar cadastro",
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
      await apiService.signOut();
      
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userName');
      localStorage.removeItem('authToken');
      
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
