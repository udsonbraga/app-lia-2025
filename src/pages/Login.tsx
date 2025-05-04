
import { LoginLayout } from "@/features/auth/components/LoginLayout";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { SocialLogin } from "@/features/auth/components/SocialLogin";
import { useGoogleAuth } from "@/features/auth/hooks/useGoogleAuth";

const Login = () => {
  const { isLoading, handleGoogleLogin } = useGoogleAuth();

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
