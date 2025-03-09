
import React, { useState } from "react";
import { Mail, Phone, Check, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { validateEmail, formatPhone, validatePhone } from "@/features/auth/utils/formValidation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PasswordRecoveryProps {
  onBack: () => void;
}

export const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const findUserByEmail = (email: string) => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (!storedUsers) return null;
      
      const users = JSON.parse(storedUsers);
      return users.find((user: any) => user.email === email);
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  };
  
  const findUserByPhone = (phone: string) => {
    try {
      const storedUsers = localStorage.getItem('users');
      if (!storedUsers) return null;
      
      const users = JSON.parse(storedUsers);
      return users.find((user: any) => user.phone === phone);
    } catch (error) {
      console.error("Error finding user by phone:", error);
      return null;
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (recoveryMethod === "email") {
        if (!validateEmail(recoveryEmail)) {
          setError("Por favor, insira um endereço de email válido.");
          setIsLoading(false);
          return;
        }
        
        const user = findUserByEmail(recoveryEmail);
        if (!user) {
          setError("Não encontramos nenhuma conta associada a este email.");
          setIsLoading(false);
          return;
        }
        
        // Simulate sending a recovery email
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSuccess(`Email de recuperação enviado para ${recoveryEmail}`);
        toast({
          title: "Email de recuperação enviado",
          description: `Enviamos um link de recuperação para ${recoveryEmail}. Por favor, verifique sua caixa de entrada e spam.`,
        });
      } else {
        if (!validatePhone(recoveryPhone)) {
          setError("Por favor, insira um número de telefone válido no formato (00) 00000-0000.");
          setIsLoading(false);
          return;
        }
        
        const user = findUserByPhone(recoveryPhone);
        if (!user) {
          setError("Não encontramos nenhuma conta associada a este número de telefone.");
          setIsLoading(false);
          return;
        }
        
        // Simulate sending a recovery SMS
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSuccess(`SMS de recuperação enviado para ${recoveryPhone}`);
        toast({
          title: "SMS de recuperação enviado",
          description: `Enviamos um código de recuperação para ${recoveryPhone}. Por favor, aguarde o recebimento da mensagem.`,
        });
      }
      
      // Reset form after 3 seconds and redirect back
      setTimeout(() => {
        setRecoveryEmail("");
        setRecoveryPhone("");
        onBack();
      }, 3000);
    } catch (error) {
      setError("Não foi possível processar sua solicitação. Tente novamente mais tarde.");
      toast({
        title: "Erro ao recuperar senha",
        description: "Não foi possível processar sua solicitação. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="bg-green-50 text-green-800 border-green-200">
          <Check className="h-4 w-4 text-green-500" />
          <AlertTitle>Sucesso</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
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
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9]"
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
                onChange={(e) => setRecoveryPhone(formatPhone(e.target.value))}
                placeholder="(00) 00000-0000"
                required
                className="mt-1"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9]"
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
