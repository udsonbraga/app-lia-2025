
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateEmail } from "@/features/auth/utils/formValidation";
import { RecoveryStep, RecoveryMethod, PasswordRecoveryProps } from "./password-recovery/types";
import { RecoveryMethodInput } from "./password-recovery/RecoveryMethodInput";
import { OtpVerification } from "./password-recovery/OtpVerification";
import { NewPasswordForm } from "./password-recovery/NewPasswordForm";
import { SuccessMessage } from "./password-recovery/SuccessMessage";

export const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>("email");
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
          <RecoveryMethodInput
            recoveryEmail={recoveryEmail}
            setRecoveryEmail={setRecoveryEmail}
            recoveryPhone={recoveryPhone}
            setRecoveryPhone={setRecoveryPhone}
            recoveryMethod={recoveryMethod}
            setRecoveryMethod={setRecoveryMethod}
            isLoading={isLoading}
            onSubmit={handleSendOTP}
          />
        );

      case "otp":
        return (
          <OtpVerification
            otp={otp}
            setOtp={setOtp}
            isLoading={isLoading}
            onSubmit={handleVerifyOTP}
            recoveryMethod={recoveryMethod}
            recoveryEmail={recoveryEmail}
            recoveryPhone={recoveryPhone}
          />
        );

      case "newPassword":
        return (
          <NewPasswordForm
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            isLoading={isLoading}
            onSubmit={handleResetPassword}
          />
        );

      case "success":
        return <SuccessMessage />;
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
