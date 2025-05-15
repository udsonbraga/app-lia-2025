
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormFieldRHF } from "@/features/auth/components/FormField";
import { loginFormSchema } from "@/features/auth/utils/formValidation";
import { useAuth } from "@/hooks/useAuth";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  type FormValues = z.infer<typeof loginFormSchema>;

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
      console.error("Login error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">Entre na sua conta</h1>
      
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormFieldRHF
          name="email"
          label="Email"
          placeholder="seu.email@exemplo.com"
          type="email"
          register={form.register}
          error={form.formState.errors.email}
          disabled={isLoading}
        />
        
        <FormFieldRHF
          name="password"
          label="Senha"
          placeholder="Sua senha"
          type="password"
          register={form.register}
          error={form.formState.errors.password}
          disabled={isLoading}
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
