
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthState } from "../types/authTypes";

/**
 * Hook para gerenciar a sessão de autenticação do usuário
 */
export const useAuthSession = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    error: null,
  });

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
  }, []);

  return state;
};
