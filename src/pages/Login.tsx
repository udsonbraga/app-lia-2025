
import React from "react";
import { LoginLayout } from "@/features/auth/components/LoginLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";

const Login = () => {
  return (
    <LoginLayout>
      <LoginForm />
    </LoginLayout>
  );
};

export default Login;
