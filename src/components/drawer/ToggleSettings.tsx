
import { Switch } from "@/components/ui/switch";
import { Mic, PhoneIncoming } from "lucide-react";

interface ToggleSettingsProps {
  isListening: boolean;
  toggleSoundDetection: () => void;
  isMotionDetectionEnabled: boolean;
  toggleMotionDetection: () => void;
}

export const ToggleSettings = ({
  isListening,
  toggleSoundDetection,
  isMotionDetectionEnabled,
  toggleMotionDetection
}: ToggleSettingsProps) => {
  return (
    <div className="w-full space-y-4 mb-6">
      <button className="w-full text-left">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <Mic className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-gray-900">Detecção de Áudio</div>
              <div className="text-sm text-gray-500">
                Detecta palavras de emergência
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <Switch 
              id="sound-detection" 
              checked={isListening}
              onCheckedChange={toggleSoundDetection}
              className={isListening ? "bg-green-500" : ""}
            />
          </div>
        </div>
      </button>
      
      <button className="w-full text-left">
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <PhoneIncoming className="h-5 w-5 text-orange-600" />
            <div>
              <div className="font-medium text-gray-900">Detecção de Movimento</div>
              <div className="text-sm text-gray-500">
                Detecta movimento brusco
              </div>
            </div>
          </div>
          <div className="ml-auto">
            <Switch 
              id="motion-detection" 
              checked={isMotionDetectionEnabled}
              onCheckedChange={toggleMotionDetection}
              className={isMotionDetectionEnabled ? "bg-green-500" : ""}
            />
          </div>
        </div>
      </button>
    </div>
  );
};
