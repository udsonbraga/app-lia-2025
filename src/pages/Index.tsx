
import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BottomNavigation } from "@/components/BottomNavigation";
import { DrawerMenu } from "@/components/DrawerMenu";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisguised, setIsDisguised] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmergencyContact = async () => {
    setIsLoading(true);
    // Simulate sending message
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast({
      title: "Pedido de ajuda enviado",
      description: "As autoridades e seus contatos de confiança foram notificados.",
    });
    
    setIsLoading(false);
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
      
      // Se houver uma mudança significativa na aceleração
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
      {/* Status Bar Space */}
      <div className="h-6 bg-transparent" />
      
      {/* Drawer Menu */}
      <DrawerMenu />
      
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen pb-20">
        <div className="w-full max-w-md text-center space-y-8 animate-fade-in">
          {/* App Title */}
          <div className="space-y-3">
            <h1 className={`text-3xl font-bold tracking-tight ${isDisguised ? 'text-gray-800' : 'text-gray-900'} sm:text-4xl`}>
              {isDisguised ? 'Notas Pessoais' : 'Safe Lady'}
            </h1>
            <p className={`text-base ${isDisguised ? 'text-gray-500' : 'text-gray-600'} max-w-xl mx-auto`}>
              {isDisguised ? 'Suas anotações diárias' : 'Proteção imediata ao alcance de um toque. Você não está sozinha.'}
            </p>
          </div>

          {/* Main Emergency Button - Hidden in disguise mode */}
          {!isDisguised && (
            <button
              onClick={handleEmergencyContact}
              disabled={isLoading}
              className={`
                relative group flex items-center justify-center gap-3
                w-40 h-40 sm:w-48 sm:h-48 rounded-full mx-auto
                bg-white shadow-lg hover:shadow-xl
                transition-all duration-300 ease-in-out
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
          )}

          {/* Disguise Mode Content */}
          {isDisguised && (
            <div className="space-y-4">
              <textarea
                className="w-full h-64 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Digite suas anotações aqui..."
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default Index;
