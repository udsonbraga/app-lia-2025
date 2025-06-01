
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PasswordRecoveryProps {
  onBack: () => void;
}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onBack }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate password recovery email sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailSent(true);
      toast({
        title: "Email enviado",
        description: "Instruções para redefinir sua senha foram enviadas para seu email.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível enviar o email de recuperação. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Email enviado</CardTitle>
          <CardDescription>
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onBack} variant="outline" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Recuperar senha</CardTitle>
        <CardDescription>
          Digite seu email para receber instruções de recuperação de senha.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Enviar instruções'}
          </Button>

          <Button 
            type="button" 
            variant="ghost" 
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordRecovery;
