
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored authentication on mount
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (isAuthenticated) {
        const userName = localStorage.getItem('userName') || '';
        const userEmail = localStorage.getItem('userEmail') || '';
        const userId = localStorage.getItem('userId') || '';
        setUser({
          id: userId,
          name: userName,
          email: userEmail
        });
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Check for stored users
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find((user: any) => 
        user.email === email && user.password === password
      );
      
      if (foundUser) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', foundUser.name);
        localStorage.setItem('userEmail', foundUser.email);
        localStorage.setItem('userId', foundUser.id || crypto.randomUUID());
        
        setUser({
          id: foundUser.id || crypto.randomUUID(),
          name: foundUser.name,
          email: foundUser.email
        });
        
        toast({
          title: "Login realizado com sucesso",
          description: `Bem-vindo de volta, ${foundUser.name}!`,
        });
        
        return { success: true };
      } else {
        throw new Error("Credenciais inválidas");
      }
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
      
      // Check for existing users
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const userExists = users.some((user: any) => user.email === email);
      
      if (userExists) {
        return { 
          success: false, 
          error: "Já existe uma conta com este email. Tente fazer login." 
        };
      }
      
      // Create new user
      const userId = crypto.randomUUID();
      const newUser = {
        id: userId,
        name: name,
        email: email,
        password: password
      };
      
      // Add to users list
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set as authenticated
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', userId);
      
      // Update state
      setUser({
        id: userId,
        name: name,
        email: email
      });
      
      toast({
        title: "Conta criada com sucesso",
        description: "Bem-vindo ao Safe Lady!",
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    setUser(null);
    setIsLoading(false);
    
    toast({
      title: "Logout realizado com sucesso",
      description: "Você saiu da sua conta.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
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
