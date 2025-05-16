
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface RegisterSuccessDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

export const RegisterSuccessDialog = ({ open, onClose, email }: RegisterSuccessDialogProps) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!open) return;
    
    // Iniciar contagem regressiva
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          redirectToLogin();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const redirectToLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl">Cadastro Realizado!</DialogTitle>
          <DialogDescription className="text-center">
            <p className="my-4">
              Seu cadastro foi realizado com sucesso. Um email de confirmação foi enviado para:
              <span className="font-semibold block mt-2">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Por favor, verifique seu email e confirme o cadastro.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Button onClick={redirectToLogin} className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9] text-white">
            Ir para Login ({countdown})
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
