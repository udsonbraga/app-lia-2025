
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { handleEmergencyAlert } from "@/utils/emergencyUtils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showNoContactsDialog, setShowNoContactsDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    
    try {
      const hasContacts = await handleEmergencyAlert({ toast });
      
      // Se não tiver contatos, mostra o diálogo
      if (hasContacts === false) {
        setShowNoContactsDialog(true);
      }
    } catch (error) {
      console.error("Erro ao enviar alerta de emergência:", error);
      toast({
        title: "Erro ao enviar alerta",
        description: "Não foi possível enviar o alerta de emergência. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = () => {
    setShowNoContactsDialog(false);
    navigate("/safe-contact");
  };

  return (
    <>
      <button
        onClick={handleEmergencyContact}
        disabled={isLoading}
        className={`
          relative group flex items-center justify-center gap-3
          w-48 h-48 sm:w-56 sm:h-56 rounded-full mx-auto
          bg-white shadow-lg hover:shadow-xl active:scale-95
          transition-all duration-300 ease-in-out mb-8
          hover:bg-safelady-light
          ${isLoading ? "animate-pulse bg-safelady-light" : ""}
        `}
      >
        <div className="absolute inset-0 bg-safelady rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        <div className="flex flex-col items-center gap-2">
          <Shield size={50} className={`text-safelady ${isLoading ? "animate-pulse" : ""}`} />
          <span className="text-base font-semibold text-gray-800">
            {isLoading ? "Enviando..." : "Emergência"}
          </span>
        </div>
      </button>

      <Dialog open={showNoContactsDialog} onOpenChange={setShowNoContactsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contatos não configurados</DialogTitle>
            <DialogDescription>
              Para usar o botão de emergência, é necessário cadastrar pelo menos um contato de confiança que receberá os alertas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-4">
            <Shield className="w-16 h-16 text-safelady mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              O botão de emergência envia sua localização para seus contatos cadastrados.
            </p>
          </div>
          
          <DialogFooter className="sm:justify-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowNoContactsDialog(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleAddContact}
              className="bg-safelady hover:bg-safelady/90"
            >
              Cadastrar Contato
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
