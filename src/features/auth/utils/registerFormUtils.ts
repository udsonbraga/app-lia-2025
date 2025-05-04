
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validateForm } from "@/features/auth/utils/formValidation";

export interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export const useRegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedTerms) {
      toast({
        title: "Termos não aceitos",
        description: "Você precisa aceitar os termos de uso para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Check if user already exists
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const userExists = users.some((user: any) => user.email === formData.email);
      
      if (userExists) {
        toast({
          title: "Email já cadastrado",
          description: "Já existe uma conta com este email. Tente fazer login.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Add the new user
      const newUser = {...formData};
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Agora você pode fazer login no SafeLady.",
      });
      
      // Redireciona para a página de login em vez da página inicial
      navigate("/login");
    } catch (error) {
      toast({
        title: "Erro ao realizar cadastro",
        description: "Por favor, tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    isLoading,
    acceptedTerms,
    setAcceptedTerms,
    handleSubmit
  };
};
