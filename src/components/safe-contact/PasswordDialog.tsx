
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verificação de Senha</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <p className="text-sm text-gray-600">
              Informe sua senha para voltar ao aplicativo principal.
            </p>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">Verificar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
