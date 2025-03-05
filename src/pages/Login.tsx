
import { useState } from "react";
import { LoginLayout } from "@/features/auth/components/LoginLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { GoogleAccountSelector } from "@/features/auth/components/GoogleAccountSelector";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";

const Login = () => {
  const { 
    isLoading, 
    showGoogleSelector, 
    handleGoogleLogin, 
    handleGoogleAccountSelect, 
    cancelGoogleLogin 
  } = useGoogleAuth();

  if (showGoogleSelector) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FF84C6] to-white flex flex-col justify-center items-center py-12 px-4">
        <GoogleAccountSelector 
          onCancel={cancelGoogleLogin} 
          onSelect={handleGoogleAccountSelect} 
        />
      </div>
    );
  }

  return (
    <LoginLayout>
      <div>
        <LoginForm />
        <SocialLogin onGoogleLogin={handleGoogleLogin} isLoading={isLoading} />
      </div>
    </LoginLayout>
  );
};

export default Login;
