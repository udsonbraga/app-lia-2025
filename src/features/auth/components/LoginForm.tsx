
import React from "react";
import { Button } from "@/components/ui/button";
import { PasswordRecovery } from "./PasswordRecovery";
import { LoginFormFields } from "./LoginFormFields";
import { LoginFormButtons } from "./LoginFormButtons";
import { useLogin } from "../hooks/useLogin";

export const LoginForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    showRecovery,
    setShowRecovery,
    handleSubmit
  } = useLogin();

  if (showRecovery) {
    return <PasswordRecovery onBack={() => setShowRecovery(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <LoginFormFields 
        email={email}
        password={password}
        setEmail={setEmail}
        setPassword={setPassword}
        setShowRecovery={setShowRecovery}
      />
      
      <LoginFormButtons 
        isLoading={isLoading}
      />
    </form>
  );
};
