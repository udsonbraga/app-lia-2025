
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

// Função para limpar todos os dados de autenticação do localStorage
const cleanupAuthState = () => {
  // Remover tokens padrão
  localStorage.removeItem('isAuthenticated');
  
  // Remover todas as chaves de autenticação do Supabase do localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

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
    // Configurar listener para mudanças na autenticação PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
        }));
        
        // Se o usuário fez login, redirecionar
        if (event === 'SIGNED_IN') {
          localStorage.setItem('isAuthenticated', 'true');
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem('isAuthenticated');
        }
      }
    );

    // DEPOIS verificar a sessão existente
    const getInitialSession = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Erro ao obter sessão:", error);
          setState(prev => ({ ...prev, error: error.message, isLoading: false }));
          return;
        }
        
        const session = data?.session;
        
        if (session?.user) {
          console.log("Sessão existente encontrada:", session.user.email);
          localStorage.setItem('isAuthenticated', 'true');
        }
        
        setState(prev => ({
          ...prev,
          session,
          user: session?.user || null,
          isLoading: false,
          error: null
        }));
        
      } catch (error: any) {
        console.error("Erro ao inicializar autenticação:", error);
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
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Limpar estado de autenticação anterior
      cleanupAuthState();
      
      console.log("Tentando login com:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro de login:", error.message);
        
        // Mensagem específica para email não confirmado
        if (error.message.includes("Email not confirmed")) {
          toast({
            title: "Email não confirmado",
            description: "Por favor, verifique seu email e confirme sua conta antes de fazer login.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Erro ao fazer login",
            description: "Verifique seus dados e tente novamente.",
            variant: "destructive"
          });
        }
        
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
        return false;
      }

      console.log("Login bem-sucedido:", data.user?.email);
      
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
        
        if (data.user.user_metadata?.name) {
          localStorage.setItem('userName', data.user.user_metadata.name);
        }
        
        navigate('/home');
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vinda de volta!`,
        });
        return true;
      }
      
      return false;
    } catch (error: any) {
      console.error("Erro no processo de login:", error);
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
        
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
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
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      setState(prev => ({
        ...prev,
        user: data.user,
        session: data.session,
        isLoading: false,
        error: null
      }));
      
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
      // Limpar tokens de autenticação
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro ao fazer logout:", error);
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }));
        return false;
      }
      
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
      console.error("Erro no processo de logout:", error);
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
