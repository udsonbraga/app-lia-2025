
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import FormField from "@/features/auth/components/FormField";
import TermsCheckbox from "@/features/auth/components/TermsCheckbox";
import { registerFormSchema } from "@/features/auth/utils/formValidation";
import { useAuth } from "@/hooks/useAuth";

export const RegisterForm = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // Definir tipo do formulário usando o esquema Zod
  type FormValues = z.infer<typeof registerFormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!acceptedTerms) {
      // Mostrar erro se os termos não foram aceitos
      return;
    }

    setIsLoading(true);

    try {
      // Chamar função de registro usando o hook de autenticação
      const success = await signUp(values.email, values.password, values.name);
      
      if (!success) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
    }
  };

  const handleTermsChange = (event: FormEvent<HTMLInputElement>) => {
    setAcceptedTerms(event.currentTarget.checked);
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        Criar Nova Conta
      </h1>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          name="name"
          label="Nome"
          placeholder="Seu nome completo"
          register={form.register}
          error={form.formState.errors.name}
          disabled={isLoading}
        />

        <FormField
          name="email"
          label="Email"
          placeholder="seu.email@exemplo.com"
          type="email"
          register={form.register}
          error={form.formState.errors.email}
          disabled={isLoading}
        />

        <FormField
          name="password"
          label="Senha"
          placeholder="Crie uma senha forte"
          type="password"
          register={form.register}
          error={form.formState.errors.password}
          disabled={isLoading}
        />

        <FormField
          name="confirmPassword"
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          type="password"
          register={form.register}
          error={form.formState.errors.confirmPassword}
          disabled={isLoading}
        />

        <TermsCheckbox
          onChange={handleTermsChange}
          checked={acceptedTerms}
          disabled={isLoading}
        />

        <Button
          type="submit"
          className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9] text-white"
          disabled={isLoading || !acceptedTerms}
        >
          {isLoading ? "Criando conta..." : "Criar Conta"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline"
            >
              Faça login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
