
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/features/auth/components/FormField";
import { loginFormSchema } from "@/features/auth/utils/formValidation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn, testDatabaseConnection } = useAuth();
  const { toast } = useToast();
  
  type FormValues = z.infer<typeof loginFormSchema>;

  // Test database connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const isConnected = await testDatabaseConnection();
        setConnectionStatus(isConnected ? 'Conectado' : 'Falha na conexão');
        
        if (isConnected) {
          toast({
            title: "Banco de dados conectado",
            description: "A conexão com o Supabase foi estabelecida com sucesso.",
          });
        } else {
          toast({
            title: "Erro de conexão",
            description: "Não foi possível conectar ao banco de dados. Verifique o console para mais detalhes.",
            variant: "destructive"
          });
        }
      } catch (error) {
        setConnectionStatus('Erro');
        console.error("Erro ao verificar conexão:", error);
      }
    };
    
    checkConnection();
  }, [toast]);

  const form = useForm<FormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const success = await signIn(values.email, values.password);
      if (!success) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro de login:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Entre na sua conta</h1>
      
      {connectionStatus && (
        <div className={`text-sm text-center p-2 rounded ${
          connectionStatus === 'Conectado' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          Status do banco de dados: {connectionStatus}
        </div>
      )}
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="email"
          label="Email"
          placeholder="seu.email@exemplo.com"
          type="email"
          register={form.register}
          error={form.formState.errors.email}
          disabled={isLoading}
          value=""
          onChange={() => {}}
        />
        
        <FormField
          name="password"
          label="Senha"
          placeholder="Sua senha"
          type="password"
          register={form.register}
          error={form.formState.errors.password}
          disabled={isLoading}
          value=""
          onChange={() => {}}
        />
        
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => navigate('/password-recovery')}
            className="text-sm text-blue-600 hover:underline"
          >
            Esqueceu a senha?
          </button>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9] text-white"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Não tem conta?{" "}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline"
            >
              Cadastre-se
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
