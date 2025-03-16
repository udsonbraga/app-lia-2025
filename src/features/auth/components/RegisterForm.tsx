
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { validateForm, formatPhone } from "@/features/auth/utils/formValidation";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export function RegisterForm() {
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
      
      // Generate a random UUID for the user
      const userId = crypto.randomUUID();
      
      // Add the new user to localStorage
      const newUser = {...formData, id: userId};
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set the user as authenticated and store name and ID
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userId', userId);
      
      // Also save the user to Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([
          { 
            id: userId,
            name: formData.name,
            email: formData.email,
            phone: formData.phone
          }
        ])
        .select();
      
      if (error) {
        console.error('Erro ao salvar usuário no Supabase:', error);
        toast({
          title: "Usuário salvo localmente",
          description: "Não foi possível salvar no banco de dados remoto, mas você pode continuar usando o aplicativo.",
        });
      } else {
        console.log('Usuário salvo no Supabase com sucesso:', data);
        toast({
          title: "Cadastro realizado com sucesso!",
          description: "Bem-vinda ao SafeLady.",
        });
      }
      
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

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 text-[#8B5CF6] mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
        <p className="text-gray-600 mt-2">
          Proteja-se e junte-se à nossa rede de apoio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome Completo
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            placeholder="Digite seu nome completo"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            E-mail
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            placeholder="seu@email.com"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Telefone
          </label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            placeholder="(00) 00000-0000"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Senha
          </label>
          <Input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox 
            id="terms" 
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
            className="mt-1"
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Eu li e aceito a Política de Privacidade
            </label>
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                navigate('/help');
              }}
              className="text-xs text-[#8B5CF6] underline flex items-center gap-1"
            >
              Leia nossa Política de Privacidade
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading || !acceptedTerms}
          className="w-full py-3 px-4 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Cadastrando..." : "Criar Conta"}
        </Button>
      </form>
    </div>
  );
};

