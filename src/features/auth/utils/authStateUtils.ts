
/**
 * Utilitários para gerenciamento do estado de autenticação
 */

/**
 * Limpa todos os dados de autenticação do localStorage
 */
export const cleanupAuthState = () => {
  // Remover tokens padrão
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userName');
  
  // Remover todas as chaves de autenticação do Supabase do localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * Salva informações básicas do usuário após autenticação bem-sucedida
 */
export const saveAuthState = (userName: string | undefined) => {
  localStorage.setItem('isAuthenticated', 'true');
  
  if (userName) {
    localStorage.setItem('userName', userName);
  }
};
