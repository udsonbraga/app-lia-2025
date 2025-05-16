
import { useAuthSession } from "@/features/auth/hooks/useAuthSession";
import { useSignIn } from "@/features/auth/hooks/useSignIn";
import { useSignUp } from "@/features/auth/hooks/useSignUp";
import { useSignOut } from "@/features/auth/hooks/useSignOut";
import { AuthState } from "@/features/auth/types/authTypes";

/**
 * Hook principal de autenticação que combina todos os hooks especializados
 */
export function useAuth() {
  // Obter estado da sessão
  const sessionState = useAuthSession();
  
  // Obter funcionalidades de login
  const { signIn, isLoading: signInLoading, error: signInError } = useSignIn();
  
  // Obter funcionalidades de cadastro
  const { 
    signUp, 
    isLoading: signUpLoading, 
    error: signUpError,
    showSuccessDialog,
    registeredEmail,
    closeSuccessDialog
  } = useSignUp();
  
  // Obter funcionalidades de logout
  const { signOut, isLoading: signOutLoading, error: signOutError } = useSignOut();

  // Determinar estado de carregamento geral
  const isLoading = sessionState.isLoading || signInLoading || signUpLoading || signOutLoading;
  
  // Determinar erro geral
  const error = sessionState.error || signInError || signUpError || signOutError;

  return {
    ...sessionState,
    signIn,
    signUp,
    signOut,
    isLoading,
    error,
    showSuccessDialog,
    registeredEmail,
    closeSuccessDialog
  };
}

// Re-exportando o tipo AuthState para compatibilidade
export type { AuthState } from "@/features/auth/types/authTypes";
export { cleanupAuthState } from "@/features/auth/utils/authStateUtils";
