
/**
 * Clean up all Supabase auth related data
 */
export const cleanupAuthState = () => {
  // Remove standard auth tokens
  localStorage.removeItem('supabase.auth.token');
  
  // Remove all Supabase auth keys from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Remove from sessionStorage if in use
  Object.keys(sessionStorage || {}).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      sessionStorage.removeItem(key);
    }
  });
  
  // Remove other auth related items
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userName');
};

/**
 * Helper function to create appropriate error messages for auth errors
 */
export const getAuthErrorMessage = (errorMessage: string): string => {
  if (errorMessage.includes("Invalid login credentials")) {
    return "Credenciais inválidas. Verifique seu email e senha.";
  } else if (errorMessage.includes("Email not confirmed")) {
    return "Email não confirmado. Verifique sua caixa de entrada.";
  } else if (errorMessage.includes("User not found")) {
    return "Usuário não encontrado. Verifique seu email ou registre-se.";
  } else if (errorMessage.includes("Invalid email")) {
    return "Email inválido. Verifique o formato do email.";
  }
  
  return "Verifique suas credenciais e tente novamente.";
};
