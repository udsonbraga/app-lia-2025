
import React, { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { validateEmail } from "@/features/auth/utils/formValidation";

interface PasswordRecoveryProps {
  onBack: () => void;
}

export const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email");
  const [errors, setErrors] = useState<{email?: string; phone?: string}>({});

  // Simulated user data that would normally come from a database
  const mockUserData = {
    email: "usuario@teste.com",
    phone: "(11) 99999-9999"
  };

  const validateForm = () => {
    const newErrors: {email?: string; phone?: string} = {};
    let isValid = true;

    if (recoveryMethod === "email") {
      if (!recoveryEmail) {
        newErrors.email = "Por favor, informe seu e-mail";
        isValid = false;
      } else if (!validateEmail(recoveryEmail)) {
        newErrors.email = "E-mail inválido";
        isValid = false;
      }
    } else {
      if (!recoveryPhone) {
        newErrors.phone = "Por favor, informe seu telefone";
        isValid = false;
      } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(recoveryPhone)) {
        newErrors.phone = "Telefone inválido. Use o formato (99) 99999-9999";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const checkCredentials = () => {
    if (recoveryMethod === "email") {
      return recoveryEmail === mockUserData.email;
    } else {
      return recoveryPhone === mockUserData.phone;
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if credentials match simulated user data
      const credentialsMatch = checkCredentials();
      
      if (!credentialsMatch) {
        if (recoveryMethod === "email") {
          throw new Error("E-mail não encontrado em nossa base de dados");
        } else {
          throw new Error("Telefone não encontrado em nossa base de dados");
        }
      }
      
      if (recoveryMethod === "email") {
        // In a real app, you would send an actual email here
        console.log(`Recovery email sent to: ${recoveryEmail}`);
        
        toast({
          title: "Email de recuperação enviado",
          description: `Enviamos um link de recuperação para ${recoveryEmail}. Por favor, verifique sua caixa de entrada e spam.`,
        });
      } else {
        // In a real app, you would send an actual SMS here
        console.log(`Recovery SMS sent to: ${recoveryPhone}`);
        
        toast({
          title: "SMS de recuperação enviado",
          description: `Enviamos um código de recuperação para ${recoveryPhone}. Por favor, aguarde o recebimento da mensagem.`,
        });
      }
      
      onBack();
      setRecoveryEmail("");
      setRecoveryPhone("");
      setErrors({});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Não foi possível processar sua solicitação. Tente novamente mais tarde.";
      
      toast({
        title: "Erro ao recuperar senha",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'email' | 'phone') => {
    const value = e.target.value;
    
    if (field === 'email') {
      setRecoveryEmail(value);
      if (errors.email) {
        setErrors(prev => ({...prev, email: undefined}));
      }
    } else {
      // Format phone number while typing
      const numericValue = value.replace(/\D/g, '');
      let formattedValue = value;
      
      if (numericValue.length <= 11) {
        if (numericValue.length === 11) {
          formattedValue = `(${numericValue.slice(0, 2)}) ${numericValue.slice(2, 7)}-${numericValue.slice(7, 11)}`;
        } else if (numericValue.length > 2) {
          const areaCode = numericValue.slice(0, 2);
          const prefix = numericValue.slice(2, Math.min(7, numericValue.length));
          const suffix = numericValue.length > 7 ? `-${numericValue.slice(7)}` : '';
          formattedValue = `(${areaCode}) ${prefix}${suffix}`;
        } else if (numericValue.length > 0) {
          formattedValue = `(${numericValue}`;
        }
      }
      
      setRecoveryPhone(formattedValue);
      if (errors.phone) {
        setErrors(prev => ({...prev, phone: undefined}));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Recuperar Senha</h3>
        <button 
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Voltar
        </button>
      </div>
      
      <Tabs defaultValue="email" onValueChange={(value) => setRecoveryMethod(value as "email" | "phone")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Email
          </TabsTrigger>
          <TabsTrigger value="phone" className="flex items-center gap-2">
            <Phone className="h-4 w-4" /> Telefone
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <form onSubmit={handleRecoverySubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="recovery-email">Email</Label>
              <Input
                id="recovery-email"
                type="email"
                value={recoveryEmail}
                onChange={(e) => handleInputChange(e, 'email')}
                placeholder="seu@email.com"
                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Recuperar senha"}
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="phone">
          <form onSubmit={handleRecoverySubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="recovery-phone">Telefone</Label>
              <Input
                id="recovery-phone"
                type="tel"
                value={recoveryPhone}
                onChange={(e) => handleInputChange(e, 'phone')}
                placeholder="(00) 00000-0000"
                className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-neutral-800 hover:bg-neutral-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Recuperar senha"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};
