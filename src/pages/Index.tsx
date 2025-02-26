import { useState, useEffect } from "react";
import { Shield, Users, BookOpen, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DrawerMenu } from "@/components/DrawerMenu";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisguised, setIsDisguised] = useState(false);
  const [disguisePassword, setDisguisePassword] = useState("");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [notes, setNotes] = useState(() => localStorage.getItem('disguiseNotes') || "");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Pedido de ajuda enviado",
      description: "As autoridades e seus contatos de confiança foram notificados.",
    });
    
    setIsLoading(false);
  };

  const handleDisguiseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disguisePassword) {
      localStorage.setItem('disguisePassword', disguisePassword);
      setIsDisguised(true);
      setShowPasswordPrompt(false);
      setDisguisePassword("");
    }
  };

  const toggleDisguise = () => {
    if (!isDisguised) {
      setShowPasswordPrompt(true);
    } else {
      const savedPassword = prompt("Digite a senha para sair do modo disfarce:");
      if (savedPassword === localStorage.getItem('disguisePassword')) {
        setIsDisguised(false);
        localStorage.removeItem('disguisePassword');
      } else {
        toast({
          title: "Senha incorreta",
          description: "A senha fornecida não está correta.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
  };

  const handleSaveNotes = () => {
    localStorage.setItem('disguiseNotes', notes);
    toast({
      title: "Notas salvas",
      description: "Suas anotações foram salvas com sucesso.",
    });
  };

  useEffect(() => {
    let lastY = 0;
    let lastX = 0;
    let lastZ = 0;
    let lastTime = new Date().getTime();

    const handleMotion = (event: DeviceMotionEvent) => {
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastTime;
      
      if (timeDiff < 100) return; // Limita a verificação a cada 100ms
      
      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;
      
      const { x, y, z } = acceleration;
      if (x === null || y === null || z === null) return;
      
      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);
      
      if (deltaX + deltaY + deltaZ > 30) {
        handleEmergencyContact();
      }
      
      lastX = x;
      lastY = y;
      lastZ = z;
      lastTime = currentTime;
    };

    window.addEventListener('devicemotion', handleMotion);
    
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  return (
    <div className={`min-h-screen ${isDisguised ? 'bg-white' : 'bg-gradient-to-b from-rose-50 to-white'}`}>
      <div className="fixed top-0 right-0 h-14 bg-white shadow-sm flex items-center px-4 z-50 ml-16">
        <DrawerMenu />
        <h1 className="text-xl font-semibold text-center flex-1">
          {isDisguised ? 'Notas Pessoais' : 'Safe Lady'}
        </h1>
        <div className="w-8" />
      </div>
      
      <div className="container mx-auto px-4 pt-20 pb-16 flex flex-col min-h-screen ml-16">
        <div className="flex-1 flex flex-col items-center justify-center">
          {showPasswordPrompt && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <form onSubmit={handleDisguiseSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Definir Senha do Modo Disfarce</h3>
                <input
                  type="password"
                  value={disguisePassword}
                  onChange={(e) => setDisguisePassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md mb-4"
                  placeholder="Digite uma senha"
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Confirmar</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordPrompt(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          )}

          {!isDisguised && (
            <div className="w-full max-w-md space-y-6">
              <button
                onClick={handleEmergencyContact}
                disabled={isLoading}
                className={`
                  relative group flex items-center justify-center gap-3
                  w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto
                  bg-white shadow-lg hover:shadow-xl
                  transition-all duration-300 ease-in-out mb-8
                  ${isLoading ? "animate-button-press" : ""}
                `}
              >
                <div className="absolute inset-0 bg-red-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <div className="flex flex-col items-center gap-2">
                  <Shield size={40} className="text-red-500" />
                  <span className="text-base font-semibold text-gray-800">
                    {isLoading ? "Enviando..." : "Botão de Emergência"}
                  </span>
                </div>
              </button>

              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => navigate("/support-network")}
                  className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
                >
                  <Users className="h-6 w-6 text-red-500" />
                  <span className="font-medium text-gray-800">Rede de Apoio</span>
                </button>

                <button
                  onClick={() => navigate("/diary")}
                  className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
                >
                  <BookOpen className="h-6 w-6 text-red-500" />
                  <span className="font-medium text-gray-800">Diário Seguro</span>
                </button>

                <button
                  onClick={() => navigate("/safe-contact")}
                  className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
                >
                  <Phone className="h-6 w-6 text-red-500" />
                  <span className="font-medium text-gray-800">Contato Seguro</span>
                </button>
              </div>
            </div>
          )}

          {isDisguised && (
            <div className="w-full max-w-2xl mx-auto p-4">
              <textarea
                className="w-full h-64 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Digite suas anotações aqui..."
                value={notes}
                onChange={handleNotesChange}
              />
            </div>
          )}
        </div>
      </div>

      <BottomNavigation 
        isDisguised={isDisguised}
        onDisguiseToggle={toggleDisguise}
        onSave={isDisguised ? handleSaveNotes : undefined}
        showSave={isDisguised}
      />
    </div>
  );
};

export default Index;
