
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  birthDate: string;
  acceptTerms: boolean;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    birthDate: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName) {
      newErrors.fullName = "Nome completo é obrigatório";
    }

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    if (!formData.password || !validatePassword(formData.password)) {
      newErrors.password = "A senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Data de nascimento é obrigatória";
    } else {
      const age = new Date().getFullYear() - new Date(formData.birthDate).getFullYear();
      if (age < 18) {
        newErrors.birthDate = "Você deve ter pelo menos 18 anos";
      }
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "Você deve aceitar os termos de uso";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular envio para o backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Enviamos um e-mail de confirmação para você.",
      });
      
      navigate("/");
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
            <p className="text-gray-600 mt-2">
              Junte-se à nossa rede de proteção
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Digite seu nome completo"
              />
              {errors.fullName && (
                <p className="text-sm text-red-500 mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone (opcional)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              {errors.birthDate && (
                <p className="text-sm text-red-500 mt-1">{errors.birthDate}</p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 rounded border-gray-300 text-red-500 focus:ring-red-500"
              />
              <label className="ml-2 text-sm text-gray-600">
                Li e aceito os{" "}
                <a href="#" className="text-red-500 hover:text-red-600">
                  termos de uso
                </a>{" "}
                e a{" "}
                <a href="#" className="text-red-500 hover:text-red-600">
                  política de privacidade
                </a>
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-sm text-red-500 mt-1">{errors.acceptTerms}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full py-3 px-4 rounded-lg
                bg-red-500 hover:bg-red-600
                text-white font-medium
                transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {isLoading ? "Cadastrando..." : "Criar Conta"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Faça login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
