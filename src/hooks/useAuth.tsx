
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { AuthState } from "@/features/auth/types/auth";
import { useAuthService } from "@/features/auth/services/authService";
import { useToast } from "@/hooks/use-toast";

export type { AuthState };

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });
  
  const navigate = useNavigate();
  const authService = useAuthService();
  const { toast } = useToast();

  useEffect(() => {
    console.log("=== USEAUTH INITIALIZATION ===");
    
    // Configurar listener para mudanças na autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", { event, session: !!session, userId: session?.user?.id });
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
          isLoading: false,
          error: null
        }));

        // Se o usuário fez login, salvar no localStorage para compatibilidade
        if (session?.user) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userName', session.user.user_metadata?.name || session.user.email || '');
          localStorage.setItem('authToken', session.access_token);
          console.log("User authenticated, localStorage updated");
        } else {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userName');
          localStorage.removeItem('authToken');
          console.log("User signed out, localStorage cleared");
        }
      }
    );

    // DEPOIS obter sessão atual
    const getInitialSession = async () => {
      try {
        console.log("Getting initial session...");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setState(prev => ({ ...prev, error: error.message, isLoading: false }));
          return;
        }
        
        const session = data?.session;
        console.log("Initial session:", { hasSession: !!session, userId: session?.user?.id });
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
          isLoading: false,
          error: null
        }));
        
      } catch (error: any) {
        console.error("Error in getInitialSession:", error);
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("=== SIGNIN ATTEMPT ===");
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await authService.signIn(email, password);
    
    if (result.success && result.data) {
      console.log("SignIn successful:", result.data.user?.id);
      setState(prev => ({
        ...prev,
        user: result.data.user,
        session: result.data.session,
        isLoading: false,
        error: null
      }));
      
      navigate('/home');
      return true;
    } else {
      console.error("SignIn failed:", result.error);
      setState(prev => ({
        ...prev,
        error: result.error || "Erro ao fazer login",
        isLoading: false
      }));
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log("=== SIGNUP ATTEMPT ===");
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await authService.signUp(email, password, name);
    
    if (result.success && result.data) {
      console.log("SignUp successful:", result.data.user?.id);
      setState(prev => ({
        ...prev,
        user: result.data.user,
        session: result.data.session,
        isLoading: false,
        error: null
      }));
      return true;
    } else {
      console.error("SignUp failed:", result.error);
      setState(prev => ({
        ...prev,
        error: result.error || "Erro ao criar conta",
        isLoading: false
      }));
      return false;
    }
  };

  const signOut = async () => {
    console.log("=== SIGNOUT ATTEMPT ===");
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await authService.signOut();
    
    if (result.success) {
      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        isLoading: false,
        error: null
      }));
      
      navigate('/login');
      return true;
    } else {
      setState(prev => ({
        ...prev,
        error: result.error || "Erro ao sair",
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
