
import { Google } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialLoginProps {
  onGoogleLogin: () => void;
  isLoading: boolean;
}

export const SocialLogin = ({ onGoogleLogin, isLoading }: SocialLoginProps) => {
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
        onClick={onGoogleLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center"
      >
        <Google className="h-4 w-4 mr-2" />
        {isLoading ? "Carregando..." : "Google"}
      </Button>
    </div>
  );
};

export default SocialLogin;
