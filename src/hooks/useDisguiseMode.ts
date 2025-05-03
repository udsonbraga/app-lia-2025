
import { useToast } from "@/hooks/use-toast";

export function useDisguiseMode() {
  const { toast } = useToast();

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
