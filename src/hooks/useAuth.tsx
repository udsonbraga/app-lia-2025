
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signUp: (email: string, password: string, name: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
  signOut: () => Promise<void>;
  localSignIn: (email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
    userName?: string;
  }>;
  localSignUp: (name: string, email: string, password: string) => Promise<{
    success: boolean;
    error?: string;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Primeiro configura o listener para mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo de volta!",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado com sucesso",
            description: "Você saiu da sua conta.",
          });
        }
      }
    );

    // Depois busca a sessão atual
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      toast({
        title: "Conta criada com sucesso",
        description: "Verifique seu e-mail para confirmar o cadastro.",
      });
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const localSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Check for stored users
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find((user: any) => 
        user.email === email && user.password === password
      );
      
      if (foundUser) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', foundUser.name);
        
        toast({
          title: "Login efetuado com sucesso",
          description: `Bem-vinda de volta, ${foundUser.name}!`,
        });
        
        return { success: true, userName: foundUser.name };
      } else if (email === "usuario@teste.com" && password === "senha123") {
        // Fallback test user
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', 'Usuária Teste');
        
        toast({
          title: "Login efetuado com sucesso",
          description: "Bem-vinda de volta, Usuária Teste!",
        });
        
        return { success: true, userName: 'Usuária Teste' };
      }
      
      return { success: false, error: "Credenciais inválidas" };
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      return { success: false, error: error.message || "Erro desconhecido ao fazer login" };
    } finally {
      setIsLoading(false);
    }
  };

  const localSignUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check if user already exists
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const userExists = users.some((user: any) => user.email === email);
      
      if (userExists) {
        return { 
          success: false, 
          error: "Este email já está cadastrado. Tente fazer login."
        };
      }
      
      // Add the new user
      const newUser = { name, email, password };
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Simulate a delay for the network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Agora você pode fazer login com sua conta.",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      return { 
        success: false, 
        error: error.message || "Erro desconhecido ao registrar" 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    // Remove local storage authentication
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    // Also sign out from Supabase if needed
    await supabase.auth.signOut();
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      isLoading, 
      signIn, 
      signUp, 
      signOut,
      localSignIn,
      localSignUp
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
