
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
import { CheckCircle, XCircle } from "lucide-react";

export const RegisterForm = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
      
      setRegistrationSuccess(success);
      setErrorMessage(success ? "" : "Não foi possível realizar o cadastro. Verifique seus dados e tente novamente.");
      
      // Importante: mostrar o diálogo antes de qualquer navegação
      setShowFeedbackDialog(true);
      setIsLoading(false);
      
      // Removido o navigate para login daqui - agora só ocorre ao fechar o diálogo
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      setIsLoading(false);
      setRegistrationSuccess(false);
      setErrorMessage(error.message || "Ocorreu um erro ao processar seu cadastro. Tente novamente.");
      setShowFeedbackDialog(true);
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptedTerms(checked);
  };
  
  const handleCloseFeedbackDialog = () => {
    setShowFeedbackDialog(false);
    if (registrationSuccess) {
      navigate("/login");
    }
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

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={(open) => {
        if (!open && registrationSuccess) {
          navigate("/login");
        }
        setShowFeedbackDialog(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-[#FF84C6]">
              {registrationSuccess ? "Cadastro realizado com sucesso!" : "Falha no cadastro"}
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center mt-4">
                <div className={`rounded-full ${registrationSuccess ? "bg-green-100" : "bg-red-100"} p-3 mb-4`}>
                  {registrationSuccess ? (
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-500" />
                  )}
                </div>
                <p className="text-center mb-4">
                  {registrationSuccess 
                    ? "Sua conta foi criada com sucesso! Agora você pode fazer login para acessar todos os recursos do SafeLady."
                    : errorMessage || "Não foi possível criar sua conta. Por favor, tente novamente."}
                </p>
                <Button 
                  onClick={handleCloseFeedbackDialog}
                  className={`${registrationSuccess ? "bg-[#FF84C6] hover:bg-[#FF5AA9]" : "bg-gray-500 hover:bg-gray-600"} text-white w-full`}
                >
                  {registrationSuccess ? "Ir para o Login" : "Tentar novamente"}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
