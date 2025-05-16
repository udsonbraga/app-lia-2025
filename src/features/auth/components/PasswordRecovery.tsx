
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FormField } from "./FormField";
import { supabase } from "@/integrations/supabase/client";

const recoverySchema = z.object({
  email: z.string().email("Informe um email válido"),
});

type FormValues = z.infer<typeof recoverySchema>;

export const PasswordRecovery = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      setEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar o email de recuperação.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <div className="flex items-center mb-4">
        <Button
          type="button"
          variant="ghost"
          className="p-0 mr-2"
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Recuperar Senha</h1>
      </div>

      {!emailSent ? (
        <>
          <p className="text-gray-600">
            Informe o email associado à sua conta para receber instruções de
            recuperação de senha.
          </p>
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
            <Button
              type="submit"
              className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar"}
            </Button>
          </form>
        </>
      ) : (
        <div className="space-y-4 text-center">
          <p className="text-green-600 font-medium">
            Email de recuperação enviado!
          </p>
          <p className="text-gray-600">
            Verifique sua caixa de entrada e clique no link que enviamos para
            redefinir sua senha.
          </p>
          <Button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full"
            variant="outline"
          >
            Voltar para o login
          </Button>
        </div>
      )}
    </div>
  );
};

export default PasswordRecovery;
