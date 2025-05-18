
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/features/auth/components/FormField";
import { TermsCheckbox } from "@/features/auth/components/TermsCheckbox";
import { registerFormSchema } from "@/features/auth/utils/formValidation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

export const RegisterForm = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

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
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar a Política de Privacidade para continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Chamar função de registro usando o hook de autenticação
      const success = await signUp(values.email, values.password, values.name);
      
      if (success) {
        setShowSuccessDialog(true);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro ao registrar:", error);
      setIsLoading(false);
      
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao processar seu cadastro. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptedTerms(checked);
  };
  
  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false);
    navigate("/login");
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
          type="text"
          register={form.register}
          error={form.formState.errors.name}
          disabled={isLoading}
          value=""
          onChange={() => {}}
        />

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
          placeholder="Crie uma senha forte"
          type="password"
          register={form.register}
          error={form.formState.errors.password}
          disabled={isLoading}
          value=""
          onChange={() => {}}
        />

        <FormField
          name="confirmPassword"
          label="Confirmar Senha"
          placeholder="Confirme sua senha"
          type="password"
          register={form.register}
          error={form.formState.errors.confirmPassword}
          disabled={isLoading}
          value=""
          onChange={() => {}}
        />

        <TermsCheckbox
          acceptedTerms={acceptedTerms}
          onCheckedChange={handleTermsChange}
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

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-[#FF84C6]">Cadastro realizado com sucesso!</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-center mb-4">
                  Sua conta foi criada com sucesso! Agora você pode fazer login para acessar todos os recursos do SafeLady.
                </p>
                <Button 
                  onClick={handleCloseSuccessDialog}
                  className="bg-[#FF84C6] hover:bg-[#FF5AA9] text-white w-full"
                >
                  Ir para o Login
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
