
import { Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface PremiumDialogProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  onUpgrade: () => void;
}

const PremiumDialog = ({ isOpen, onClose, onUpgrade }: PremiumDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Plano Premium Necessário</DialogTitle>
          <DialogDescription className="text-center">
            Para adicionar mais contatos de segurança, é necessário adquirir o plano premium do Safe Lady.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          <Shield className="h-16 w-16 text-amber-500" />
          <p className="text-center">
            Com o plano premium você poderá adicionar até 3 contatos de segurança, 
            além de ter acesso a recursos exclusivos.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancelar
          </Button>
          <Button onClick={onUpgrade} className="bg-amber-500 hover:bg-amber-600">
            Adquirir Premium (R$9,90/mês)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumDialog;
