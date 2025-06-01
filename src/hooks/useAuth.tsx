
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

export interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log("=== USEAUTH INITIALIZATION ===");
    
    // Check if user is authenticated from localStorage
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const authToken = localStorage.getItem('authToken');
    const userName = localStorage.getItem('userName');
    
    if (isAuthenticated && authToken) {
      console.log("User found in localStorage");
      setState(prev => ({
        ...prev,
        user: { name: userName, id: 'local-user' },
        session: { access_token: authToken },
        isLoading: false,
        error: null
      }));
    } else {
      console.log("No authenticated user found");
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("=== SIGNIN ATTEMPT ===");
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await apiService.signIn(email, password);
      
      console.log("SignIn successful:", result.user?.id);
      
      // Update localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', result.user?.name || result.user?.email || '');
      
      setState(prev => ({
        ...prev,
        user: result.user,
        session: result.session,
        isLoading: false,
        error: null
      }));
      
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vinda de volta!",
      });
      
      navigate('/home');
      return true;
    } catch (error: any) {
      console.error("SignIn failed:", error);
      setState(prev => ({
        ...prev,
        error: error.message || "Erro ao fazer login",
        isLoading: false
      }));
      
      toast({
        title: "Erro ao fazer login",
        description: error.message || "Erro ao processar login",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log("=== SIGNUP ATTEMPT ===");
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await apiService.signUp(email, password, name);
      
      console.log("SignUp successful:", result.user?.id);
      
      // Update localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', name);
      
      setState(prev => ({
        ...prev,
        user: result.user,
        session: result.session,
        isLoading: false,
        error: null
      }));
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vinda ao Lia.",
      });
      
      return true;
    } catch (error: any) {
      console.error("SignUp failed:", error);
      setState(prev => ({
        ...prev,
        error: error.message || "Erro ao criar conta",
        isLoading: false
      }));
      
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Erro ao processar cadastro",
        variant: "destructive"
      });
      
      return false;
    }
  };

  const signOut = async () => {
    console.log("=== SIGNOUT ATTEMPT ===");
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiService.signOut();
      
      // Clear localStorage
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userName');
      localStorage.removeItem('authToken');
      
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        isLoading: false,
        error: null
      }));
      
      navigate('/login');
      return true;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "Erro ao sair",
        isLoading: false
      }));
      return false;
    }
  };

  return {
    ...state,
    signIn,
    signUp,
    signOut
  };
}
