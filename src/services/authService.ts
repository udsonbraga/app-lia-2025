
import { supabase } from '@/lib/supabase';

interface UserCredentials {
  email: string;
  password: string;
}

interface RegisterData extends UserCredentials {
  name: string;
}

export const signIn = async ({ email, password }: UserCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    return { 
      success: false, 
      error: error.message || 'Falha ao fazer login. Verifique suas credenciais.'
    };
  }
};

export const signUp = async ({ email, password, name }: RegisterData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    
    if (error) throw error;
    
    return { success: true, data };
  } catch (error: any) {
    console.error('Erro ao registrar:', error);
    return { 
      success: false, 
      error: error.message || 'Falha ao criar conta. Tente novamente mais tarde.' 
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao fazer logout:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Nenhuma sessão ativa' };
    }
    
    return { success: true, user: session.user };
  } catch (error: any) {
    console.error('Erro ao obter usuário atual:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao solicitar redefinição de senha:', error);
    return { success: false, error: error.message };
  }
};
