
import React, { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface PasswordRecoveryProps {
  onBack: () => void;
}

export const PasswordRecovery = ({ onBack }: PasswordRecoveryProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email");

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate sending a recovery email or SMS
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    } catch (error) {
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
                onChange={(e) => setRecoveryPhone(e.target.value)}
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
