import { useState, useEffect } from "react";
import { Shield, Users, BookOpen, Phone } from "lucide-react";
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
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm flex items-center px-4 z-50">
        <DrawerMenu />
        <h1 className="text-xl font-semibold text-center flex-1">
          {isDisguised ? 'Notas Pessoais' : 'Safe Lady'}
        </h1>
        <div className="w-8" />
      </div>
      
      <div className="container mx-auto px-4 pt-20 pb-16 flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center">
          {!isDisguised && (
            <>
              <button
                onClick={handleEmergencyContact}
                disabled={isLoading}
                className={`
                  relative group flex items-center justify-center gap-3
                  w-40 h-40 sm:w-48 sm:h-48 rounded-full
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

              <div className="grid grid-cols-3 gap-4 w-full max-w-xl mx-auto">
                <button
                  onClick={() => navigate("/support-network")}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2"
                >
                  <Users className="h-6 w-6 text-red-500" />
                  <span className="text-sm font-medium text-gray-800 text-center">Rede de Apoio</span>
                </button>

                <button
                  onClick={() => navigate("/diary")}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2"
                >
                  <BookOpen className="h-6 w-6 text-red-500" />
                  <span className="text-sm font-medium text-gray-800 text-center">Diário Seguro</span>
                </button>

                <button
                  onClick={() => navigate("/safe-contact")}
                  className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col items-center gap-2"
                >
                  <Phone className="h-6 w-6 text-red-500" />
                  <span className="text-sm font-medium text-gray-800 text-center">Contato Seguro</span>
                </button>
              </div>
            </>
          )}

          {isDisguised && (
            <div className="w-full max-w-2xl mx-auto p-4">
              <textarea
                className="w-full h-64 p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Digite suas anotações aqui..."
              />
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Index;
