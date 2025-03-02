
import { ArrowLeft, Eye, EyeOff, Mic, MicOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DrawerMenu } from "@/components/DrawerMenu";
import { useEmergencySoundDetection } from "@/hooks/useEmergencySoundDetection";

interface HeaderProps {
  isDisguised: boolean;
  toggleDisguise: () => void;
}

export function Header({ isDisguised, toggleDisguise }: HeaderProps) {
  const navigate = useNavigate();
  const { isListening, toggleSoundDetection } = useEmergencySoundDetection();

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <DrawerMenu />
            
            {isDisguised && (
              <button
                onClick={() => navigate('/')}
                className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-700" />
              </button>
            )}
          </div>
          
          <h1 className="text-xl font-semibold">
            {isDisguised ? 'Notas Pessoais' : 'Safe Lady'}
          </h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSoundDetection}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={isListening ? "Desativar detecção de som" : "Ativar detecção de som"}
            >
              {isListening ? 
                <Mic className="h-6 w-6 text-green-500" /> : 
                <MicOff className="h-6 w-6 text-gray-500" />
              }
            </button>
            
            <button
              onClick={toggleDisguise}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={isDisguised ? "Modo Normal" : "Modo Disfarce"}
            >
              {isDisguised ? 
                <EyeOff className="h-6 w-6 text-[#8B5CF6]" /> : 
                <Eye className="h-6 w-6 text-[#8B5CF6]" />
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
