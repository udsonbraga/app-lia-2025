
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RegisterLayoutProps {
  children: ReactNode;
}

export function RegisterLayout({ children }: RegisterLayoutProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Voltar
        </Button>

        {children}
      </div>
    </div>
  );
}
