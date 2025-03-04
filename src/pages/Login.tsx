
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [recoveryMethod, setRecoveryMethod] = useState<"email" | "phone">("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check for stored users
      const storedUsers = localStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      
      const foundUser = users.find((user: any) => 
        user.email === email && user.password === password
      );
      
      if (foundUser) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', foundUser.name);
        
        toast({
          title: "Login efetuado com sucesso",
          description: `Bem-vinda de volta, ${foundUser.name}!`,
        });
        
        navigate('/home');
      } else if (email === "usuario@teste.com" && password === "senha123") {
        // Fallback test user
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', 'Usuária Teste');
        
        toast({
          title: "Login efetuado com sucesso",
          description: "Bem-vinda de volta, Usuária Teste!",
        });
        
        navigate('/home');
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Usuário não cadastrado ou senha incorreta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Simular login com Google
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', 'Usuária Google');
      
      toast({
        title: "Login efetuado com sucesso",
        description: "Bem-vinda, Usuária Google!",
      });
      
      navigate('/home');
    } catch (error) {
      toast({
        title: "Erro ao fazer login com Google",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      
      setShowRecovery(false);
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
    <div className="min-h-screen bg-gradient-to-b from-[#FF84C6] to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-white" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Safe Lady
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {showRecovery ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Recuperar Senha</h3>
                <button 
                  onClick={() => setShowRecovery(false)}
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
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF84C6] focus:border-[#FF84C6]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Senha
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF84C6] focus:border-[#FF84C6]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <div className="text-sm">
                    <button
                      type="button"
                      onClick={() => setShowRecovery(true)}
                      className="font-medium text-[#FF84C6] hover:text-[#FF5AA9]"
                    >
                      Esqueci minha senha
                    </button>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Ou continue com</span>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                    Google
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/register")}
                >
                  Criar nova conta
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
