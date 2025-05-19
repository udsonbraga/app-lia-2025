
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from "@/features/auth/types/auth";
import { useAuthService } from "@/features/auth/services/authService";
import { useToast } from "@/hooks/use-toast";

export { AuthState };

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
    // Obter sessão atual na montagem inicial
    const getInitialSession = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setState(prev => ({ ...prev, error: error.message, isLoading: false }));
          return;
        }
        
        const session = data?.session;
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
          isLoading: false,
          error: null
        }));
        
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
      }
    };

    getInitialSession();

    // Configurar listener para mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
        }));
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await authService.signIn(email, password);
    
    if (result.success && result.data) {
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
      setState(prev => ({
        ...prev,
        error: result.error || "Erro ao fazer login",
        isLoading: false
      }));
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    const result = await authService.signUp(email, password, name);
    
    if (result.success && result.data) {
      setState(prev => ({
        ...prev,
        user: result.data.user,
        session: result.data.session,
        isLoading: false,
        error: null
      }));
      return true;
    } else {
      setState(prev => ({
        ...prev,
        error: result.error || "Erro ao criar conta",
        isLoading: false
      }));
      return false;
    }
  };

  const signOut = async () => {
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
