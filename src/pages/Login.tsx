
import React, { useState, useEffect } from "react";
import { LoginLayout } from "@/features/auth/components/LoginLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { SkeletonLoadingScreen } from "@/components/SkeletonLoadingScreen";

const Login = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simular tempo de carregamento para demonstrar o Skeleton UI
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return <SkeletonLoadingScreen />;
  }

  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
};

export default Login;
