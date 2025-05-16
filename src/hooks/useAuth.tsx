
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AuthState {
  user: User | null;
  session: Session | null;
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({
          title: "Erro ao fazer login",
          description: "Verifique seus dados e tente novamente.",
          variant: "destructive"
        });
        
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
        return false;
      }

      setState(prev => ({
        ...prev,
        user: data.user,
        session: data.session,
        isLoading: false,
        error: null
      }));
      
      // Verificar se o usuário está autenticado
      if (data.user) {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/home');
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vinda de volta!`,
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast({
        title: "Erro de sistema",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
      
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
      return false;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
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
        
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
        return false;
      }

      // Armazenar o nome do usuário para uso em todo o aplicativo
      localStorage.setItem('userName', name);

      setState(prev => ({
        ...prev,
        user: data.user,
        session: data.session,
        isLoading: false,
        error: null
      }));
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vinda ao SafeLady.",
      });
      
      navigate('/home');
      localStorage.setItem('isAuthenticated', 'true');
      return true;
    } catch (error: any) {
      toast({
        title: "Erro de sistema",
        description: "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive"
      });
      
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
      return false;
    }
  };

  const signOut = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
        return false;
      }

      // Remover tokens de autenticação
      localStorage.removeItem('isAuthenticated');
      
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
        error: error.message,
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
