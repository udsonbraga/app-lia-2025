
import { AlertCircle, Bell, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { handleEmergencyAlert } from "@/utils/emergencyUtils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function EmergencyButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showNoContactsDialog, setShowNoContactsDialog] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    
    try {
      const hasContacts = await handleEmergencyAlert({ toast });
      
      // Se não tiver contatos, mostra o diálogo
      if (hasContacts === false) {
        setShowNoContactsDialog(true);
      } else if (hasContacts === true) {
        // Se o alerta foi enviado com sucesso
        setAlertSent(true);
        
        // Ocultar a notificação após 8 segundos
        setTimeout(() => {
          setAlertSent(false);
        }, 8000);
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

  return (
    <>
      {alertSent && (
        <div className="fixed top-4 inset-x-0 mx-auto max-w-md z-50 animate-fade-in">
          <Alert className="border-green-500 bg-green-50 shadow-lg">
            <Bell className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-700">Alerta enviado com sucesso!</AlertTitle>
            <AlertDescription className="text-green-600">
              Seus contatos foram notificados com sua localização atual.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
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
              Adicione um contato de Confiança para receber o alerta.
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center py-4">
            <Shield className="w-16 h-16 text-safelady mx-auto mb-4" />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
