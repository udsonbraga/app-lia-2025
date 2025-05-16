
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SocialLoginProps {
  onGoogleLogin: () => void;
  isLoading: boolean;
}

export const SocialLogin = ({ onGoogleLogin, isLoading }: SocialLoginProps) => {
  const { toast } = useToast();
  const [localLoading, setLocalLoading] = useState(false);
  
  const handleGoogleLogin = async () => {
    try {
      setLocalLoading(true);
      await onGoogleLogin();
    } catch (error: any) {
      console.error("Google login error:", error);
      
      if (error.message?.includes("provider is not enabled")) {
        toast({
          title: "Provedor não configurado",
          description: "O login com Google não está configurado. Entre em contato com o administrador.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erro ao entrar com Google",
          description: "Ocorreu um problema ao tentar entrar com Google. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setLocalLoading(false);
    }
  };
  
  return (
    <div className="space-y-4 mt-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 text-gray-500 bg-white">
            Ou continue com
          </span>
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading || localLoading}
        className="w-full flex items-center justify-center"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="h-4 w-4 mr-2"
          fill="currentColor"
        >
          <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z" />
        </svg>
        {isLoading || localLoading ? "Carregando..." : "Google"}
      </Button>
    </div>
  );
};

export default SocialLogin;
