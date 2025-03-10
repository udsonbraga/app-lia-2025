
import React, { useState } from "react";
import { Mail, Phone, Check, ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface PasswordRecoveryProps {
  onBack: () => void;
}

type RecoveryStep = "method" | "otp" | "newPassword" | "success";

export const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email");
  const [currentStep, setCurrentStep] = useState<RecoveryStep>("method");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [contactValue, setContactValue] = useState("");

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save the contact value for future steps
      if (recoveryMethod === "email") {
        setContactValue(recoveryEmail);
      } else {
        setContactValue(recoveryPhone);
      }

      // Simulate sending a recovery email or SMS with OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (recoveryMethod === "email") {
        // In a real app, you would send an actual email here
        console.log(`Recovery email sent to: ${recoveryEmail}`);
        
        toast({
          title: "Código de verificação enviado",
          description: `Enviamos um código de verificação para ${recoveryEmail}. Por favor, verifique sua caixa de entrada e spam.`,
        });
      } else {
        // In a real app, you would send an actual SMS here
        console.log(`Recovery SMS sent to: ${recoveryPhone}`);
        
        toast({
          title: "Código de verificação enviado",
          description: `Enviamos um código de verificação para ${recoveryPhone}. Por favor, aguarde o recebimento da mensagem.`,
        });
      }
      
      // Move to the OTP verification step
      setCurrentStep("otp");
    } catch (error) {
      toast({
        title: "Erro ao recuperar senha",
        description: "Não foi possível processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate OTP verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demonstration, we'll consider any 6-digit code as valid
      if (otpCode.length !== 6) {
        throw new Error("Código inválido");
      }
      
      toast({
        title: "Código verificado",
        description: "Seu código foi verificado com sucesso.",
      });
      
      // Move to the new password step
      setCurrentStep("newPassword");
    } catch (error) {
      toast({
        title: "Erro na verificação",
        description: "O código informado é inválido ou expirou. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate password match
      if (newPassword !== confirmPassword) {
        throw new Error("As senhas não coincidem");
      }
      
      // Validate password strength
      if (newPassword.length < 6) {
        throw new Error("A senha deve ter pelo menos 6 caracteres");
      }
      
      // Simulate password reset
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real app, you'd update the password in the database
      // For demonstration, let's check if there are users in localStorage
      const storedUsers = localStorage.getItem('users');
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((user: any) => {
          if (recoveryMethod === "email" && user.email === recoveryEmail) {
            return { ...user, password: newPassword };
          }
          return user;
        });
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }
      
      toast({
        title: "Senha alterada",
        description: "Sua senha foi alterada com sucesso. Você já pode fazer login com a nova senha.",
      });
      
      // Move to success step
      setCurrentStep("success");
    } catch (error: any) {
      toast({
        title: "Erro ao redefinir senha",
        description: error.message || "Não foi possível alterar sua senha. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render step: Initial method selection (email/phone)
  const renderMethodStep = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recuperar Senha</h3>
        <button 
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Voltar
        </button>
      </div>
      
      <Tabs defaultValue="email" onValueChange={(value) => setRecoveryMethod(value as "email" | "phone")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> Telefone
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <form onSubmit={handleRecoverySubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="recovery-email">Email</Label>
              <Input
                id="recovery-email"
                type="email"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9]"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar código"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="phone">
          <form onSubmit={handleRecoverySubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="recovery-phone">Telefone</Label>
              <Input
                id="recovery-phone"
                type="tel"
                value={recoveryPhone}
                onChange={(e) => setRecoveryPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9]"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar código"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );

  // Render step: OTP verification
  const renderOtpStep = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => setCurrentStep("method")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h3 className="text-lg font-medium text-gray-900">Verificação</h3>
      </div>
      
      <p className="text-sm text-gray-600">
        Digite o código de verificação enviado para {recoveryMethod === "email" ? recoveryEmail : recoveryPhone}
      </p>
      
      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div>
          <Label htmlFor="otp-code">Código de verificação</Label>
          <Input
            id="otp-code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
            placeholder="Digite o código de 6 dígitos"
            className="mt-1 text-center text-lg tracking-widest"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9]"
          disabled={isLoading || otpCode.length !== 6}
        >
          {isLoading ? "Verificando..." : "Verificar código"}
        </Button>
      </form>
      
      <div className="text-center">
        <button
          onClick={handleRecoverySubmit}
          className="text-sm text-[#FF84C6] hover:text-[#FF5AA9]"
          disabled={isLoading}
        >
          Não recebeu o código? Reenviar
        </button>
      </div>
    </div>
  );

  // Render step: Set new password
  const renderNewPasswordStep = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={() => setCurrentStep("otp")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2"
        >
          <ArrowLeft className="h-5 w-5 text-gray-500" />
        </button>
        <h3 className="text-lg font-medium text-gray-900">Nova Senha</h3>
      </div>
      
      <form onSubmit={handlePasswordReset} className="space-y-4">
        <div>
          <Label htmlFor="new-password">Nova senha</Label>
          <div className="relative mt-1">
            <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              className="pl-10"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="confirm-password">Confirme a nova senha</Label>
          <div className="relative mt-1">
            <Lock className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a senha novamente"
              className="pl-10"
              required
            />
          </div>
          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-red-500 mt-1">As senhas não coincidem</p>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9]"
          disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
        >
          {isLoading ? "Alterando senha..." : "Salvar nova senha"}
        </Button>
      </form>
    </div>
  );

  // Render step: Success message
  const renderSuccessStep = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-green-100 p-3 rounded-full">
          <Check className="h-8 w-8 text-green-500" />
        </div>
      </div>
      
      <h3 className="text-lg font-medium text-gray-900">Senha alterada com sucesso!</h3>
      
      <p className="text-sm text-gray-600">
        Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
      </p>
      
      <Button
        onClick={onBack}
        className="mt-4 w-full bg-[#FF84C6] hover:bg-[#FF5AA9]"
      >
        Voltar para o login
      </Button>
    </div>
  );

  // Render different content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case "method":
        return renderMethodStep();
      case "otp":
        return renderOtpStep();
      case "newPassword":
        return renderNewPasswordStep();
      case "success":
        return renderSuccessStep();
      default:
        return renderMethodStep();
    }
  };

  return renderStepContent();
};
