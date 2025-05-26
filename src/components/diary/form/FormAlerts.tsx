
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check } from "lucide-react";

interface FormAlertsProps {
  errors: {text?: string, location?: string};
  saveSuccess: boolean;
}

const FormAlerts = ({ errors, saveSuccess }: FormAlertsProps) => {
  const hasErrors = Object.values(errors).some(error => error);
  
  return (
    <>
      {hasErrors && (
        <Alert variant="destructive">
          <AlertTitle>Campos pendentes</AlertTitle>
          <AlertDescription>
            Por favor, preencha os campos obrigatórios para prosseguir.
          </AlertDescription>
        </Alert>
      )}
      
      {saveSuccess && (
        <Alert className="bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <Check className="h-5 w-5 text-green-600 mr-2" />
            <AlertTitle className="text-green-700">Relato salvo com sucesso!</AlertTitle>
          </div>
          <AlertDescription className="text-green-600 ml-7">
            Suas anotações foram registradas no diário seguro.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default FormAlerts;
