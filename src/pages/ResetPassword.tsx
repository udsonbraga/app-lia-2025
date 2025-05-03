
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';
import { resetPassword } from '@/services/authService';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: 'Campo obrigatório',
        description: 'Por favor, informe seu e-mail.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: 'E-mail enviado',
          description: 'Verifique sua caixa de entrada para redefinir sua senha.',
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível enviar o e-mail de redefinição de senha.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Safe Lady</h1>
            <p className="text-gray-600 mt-2">Recuperação de Senha</p>
          </div>

          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-800">
                  Enviamos um e-mail para <strong>{email}</strong> com as instruções para redefinir sua senha.
                </p>
              </div>
              <p className="text-gray-600">
                Verifique sua caixa de entrada e siga as instruções no e-mail.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="mt-4 w-full bg-[#FF84C6] hover:bg-[#FF5AA9] text-white"
              >
                Voltar para o login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Informe o e-mail associado à sua conta para receber um link de redefinição de senha.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
              </Button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm text-safelady hover:underline">
                  Voltar para o login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
