
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export const useAuthService = () => {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
    try {
      const result = await apiService.signIn(email, password);
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', result.user?.name || result.user?.email || '');
      
      return {
        success: true,
        error: null,
        data: result
      };
    } catch (error: any) {
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
      
      return {
        success: true,
        error: null,
        data: result
      };
    } catch (error: any) {
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
