
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  password: string;
  onPasswordChange: (password: string) => void;
  onSubmit: () => void;
}

const PasswordDialog = ({
  open,
  onOpenChange,
  password,
  onPasswordChange,
  onSubmit,
}: PasswordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center">
            <Lock className="h-8 w-8 text-[#FF84C6]" />
          </div>
          <DialogTitle className="text-center text-xl">Verificação de Senha</DialogTitle>
          <DialogDescription className="text-center">
            Para sair do modo disfarce, digite sua senha.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Digite sua senha"
            className="mb-4 border-[#FF84C6] focus:ring-[#FF84C6]"
            autoFocus
          />
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-[#FF84C6] text-[#FF84C6] hover:bg-pink-50"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onSubmit} 
            className="bg-[#FF84C6] hover:bg-[#FF6CB7] transition-colors duration-200"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
