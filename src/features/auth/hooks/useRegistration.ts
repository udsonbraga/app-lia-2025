
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { validateForm } from "@/features/auth/utils/formValidation";
import { supabase, createUserInSupabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export function useRegistration() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

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
      // Verificar se o usuário já existe no Supabase
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', formData.email)
        .limit(1);
      
      if (checkError) {
        console.error('Erro ao verificar usuário existente:', checkError);
        throw new Error('Erro ao verificar usuário');
      }
      
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Email já cadastrado",
          description: "Já existe uma conta com este email. Tente fazer login.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Gerar um UUID para o usuário
      const userId = crypto.randomUUID();
      
      // Salvar o usuário no localStorage (backup)
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const newUser = {...formData, id: userId};
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Salvar o usuário no Supabase usando a nova função
      const { success, data: supabaseUser, error: supabaseError } = await createUserInSupabase({
        id: userId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      });
      
      if (!success) {
        console.error('Falha ao salvar usuário no Supabase:', supabaseError);
        toast({
          title: "Usuário salvo localmente",
          description: "Houve um problema ao salvar no banco de dados, mas você pode continuar usando o aplicativo.",
          variant: "destructive",
        });
      } else {
        console.log('Usuário salvo no Supabase com sucesso:', supabaseUser);
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vinda ao SafeLady.",
        });
      }
      
      // Definir o usuário como autenticado e armazenar nome e ID
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userId', userId);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate("/home");
    } catch (error) {
      console.error('Erro durante o cadastro:', error);
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
}
