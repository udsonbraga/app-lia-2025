
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { PasswordRecovery } from "./PasswordRecovery";
import { supabase, getUserByEmail, createUserInSupabase } from "@/integrations/supabase/client";

export const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Iniciando processo de login para:', email);
      
      // Buscar usuário no Supabase primeiro
      const { success: supabaseSuccess, data: supabaseUser, error: supabaseError } = 
        await getUserByEmail(email);
      
      if (supabaseError) {
        console.error('Erro ao buscar usuário no Supabase:', supabaseError);
      }
      
      // Verificar no localStorage como fallback
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find((user: any) => 
        user.email === email && user.password === password
      );
      
      console.log('Resultado da busca no localStorage:', foundUser ? 'Usuário encontrado' : 'Usuário não encontrado');

      // Se o usuário for encontrado no Supabase, priorize isso
      if (supabaseUser) {
        console.log('Usuário encontrado no Supabase:', supabaseUser);
        
        // Para simplicidade, ainda estamos verificando a senha contra o localStorage 
        // ou permitindo usuário de teste
        const matchingLocalUser = users.find((user: any) => 
          user.email === email && user.password === password
        );

        if (matchingLocalUser || (email === "usuario@teste.com" && password === "senha123")) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userName', supabaseUser.name || 'Usuário');
          localStorage.setItem('userId', supabaseUser.id);
          
          toast({
            title: "Login efetuado com sucesso",
            description: `Bem-vinda de volta, ${supabaseUser.name || 'Usuário'}!`,
          });
          
          navigate('/home');
          return;
        }
      }
      
      // Fallback para login local se não encontrado no Supabase
      if (foundUser) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', foundUser.name);
        localStorage.setItem('userId', foundUser.id || 'local-user-id');
        
        // Sincronizar este usuário com o Supabase se ainda não estiver lá
        if (!supabaseUser) {
          console.log('Sincronizando usuário local com Supabase:', foundUser);
          const { success, data, error } = await createUserInSupabase({ 
            id: foundUser.id || crypto.randomUUID(),
            name: foundUser.name,
            email: foundUser.email,
            phone: foundUser.phone
          });
            
          if (error) {
            console.error('Erro ao sincronizar usuário local com Supabase:', error);
          } else {
            console.log('Usuário sincronizado com Supabase:', data);
          }
        }
        
        toast({
          title: "Login efetuado com sucesso",
          description: `Bem-vinda de volta, ${foundUser.name}!`,
        });
        
        navigate('/home');
      } else if (email === "usuario@teste.com" && password === "senha123") {
        // Login de usuário de teste
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Gerar um ID de usuário de teste se não existir
        const testUserId = 'test-user-id';
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', 'Usuária Teste');
        localStorage.setItem('userId', testUserId);
        
        // Se o usuário de teste não existir no Supabase, crie-o
        if (!supabaseUser) {
          console.log('Criando usuário de teste no Supabase');
          const { success, data, error } = await createUserInSupabase({ 
            id: testUserId,
            name: 'Usuária Teste',
            email: 'usuario@teste.com'
          });
            
          if (error) {
            console.error('Erro ao salvar usuário de teste no Supabase:', error);
          } else {
            console.log('Usuário de teste salvo/atualizado no Supabase:', data);
          }
        }
        
        toast({
          title: "Login efetuado com sucesso",
          description: "Bem-vinda de volta, Usuária Teste!",
        });
        
        navigate('/home');
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      toast({
        title: "Erro ao fazer login",
        description: "Usuário não cadastrado ou senha incorreta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showRecovery) {
    return <PasswordRecovery onBack={() => setShowRecovery(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF84C6] focus:border-[#FF84C6]"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF84C6] focus:border-[#FF84C6]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="text-sm">
          <button
            type="button"
            onClick={() => setShowRecovery(true)}
            className="font-medium text-[#FF84C6] hover:text-[#FF5AA9]"
          >
            Esqueci minha senha
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9] transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <Button
          variant="outline"
          className="w-full transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-[#D6BCFA] hover:bg-[#C4B5FD] text-purple-800 border-purple-300"
          onClick={() => navigate("/register")}
        >
          Criar nova conta
        </Button>
      </div>
    </form>
  );
};
