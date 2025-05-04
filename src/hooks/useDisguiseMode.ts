
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useDisguiseMode() {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Function to reset all passwords
  const resetAllPasswords = () => {
    // Clear any stored contacts
    localStorage.removeItem('contactName');
    localStorage.removeItem('contactNumber');
    localStorage.removeItem('contacts'); // Safe contacts
    
    toast({
      title: "Senhas resetadas",
      description: "Todos os dados de contato foram removidos com sucesso.",
    });
  };

  return {
    resetAllPasswords
  };
}
