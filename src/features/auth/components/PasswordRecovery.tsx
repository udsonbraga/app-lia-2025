
import React, { useState } from "react";
import { Mail, Phone, KeyRound, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { validateEmail } from "@/features/auth/utils/formValidation";

interface PasswordRecoveryProps {
  onBack: () => void;
}

type RecoveryStep = 'input' | 'otp' | 'newPassword' | 'success';

export const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email");
  const [step, setStep] = useState<RecoveryStep>("input");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recoveryMethod === "email" && !validateEmail(recoveryEmail)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Código enviado!",
        description: `Enviamos um código de recuperação para ${recoveryMethod === "email" ? recoveryEmail : recoveryPhone}`,
      });
      
      setStep("otp");
    } catch (error) {
      toast({
        title: "Erro ao enviar código",
        description: "Não foi possível enviar o código de recuperação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast({
        title: "Código inválido",
        description: "O código deve conter 6 dígitos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep("newPassword");
    } catch (error) {
      toast({
        title: "Código inválido",
        description: "O código informado não é válido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas diferentes",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep("success");
      
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: "Não foi possível alterar sua senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "input":
        return (
          <Tabs defaultValue="email" onValueChange={(value) => setRecoveryMethod(value as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Telefone
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSendOTP} className="space-y-4 mt-4">
              <TabsContent value="email">
                <div>
                  <Label htmlFor="recovery-email">Email</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="phone">
                <div>
                  <Label htmlFor="recovery-phone">Telefone</Label>
                  <Input
                    id="recovery-phone"
                    type="tel"
                    value={recoveryPhone}
                    onChange={(e) => setRecoveryPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </TabsContent>

              <Button
                type="submit"
                className="w-full bg-safelady hover:bg-safelady/90"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar código"}
              </Button>
            </form>
          </Tabs>
        );

      case "otp":
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <Label htmlFor="otp">Código de verificação</Label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
              />
              <p className="text-sm text-gray-500 mt-2">
                Digite o código de 6 dígitos enviado para {" "}
                {recoveryMethod === "email" ? recoveryEmail : recoveryPhone}
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-safelady hover:bg-safelady/90"
              disabled={isLoading}
            >
              {isLoading ? "Verificando..." : "Verificar código"}
            </Button>
          </form>
        );

      case "newPassword":
        return (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label htmlFor="new-password">Nova senha</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
              />
            </div>

            <div>
              <Label htmlFor="confirm-password">Confirme a nova senha</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Digite novamente sua nova senha"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-safelady hover:bg-safelady/90"
              disabled={isLoading}
            >
              {isLoading ? "Alterando..." : "Alterar senha"}
            </Button>
          </form>
        );

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Senha alterada com sucesso!</h3>
            <p className="text-sm text-gray-500">
              Você será redirecionado para a tela de login em instantes...
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recuperar Senha</h3>
        {step === "input" && (
          <button 
            onClick={onBack}
            className="text-sm text-safelady hover:text-safelady/90"
          >
            Voltar
          </button>
        )}
      </div>
      
      {renderStep()}
    </div>
  );
};
