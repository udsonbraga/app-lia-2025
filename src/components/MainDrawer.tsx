
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { useEmergencySoundDetection } from "@/hooks/useEmergencySoundDetection";
import { useMotionDetector } from "@/hooks/useMotionDetector";

// Import refactored components
import { AvatarSection } from "@/components/drawer/AvatarSection";
import { ToggleSettings } from "@/components/drawer/ToggleSettings";
import { NavigationMenu } from "@/components/drawer/NavigationMenu";

export const MainDrawer = () => {
  const navigate = useNavigate();
  const { isListening, toggleSoundDetection } = useEmergencySoundDetection();
  const { isMotionDetectionEnabled, toggleMotionDetection } = useMotionDetector();
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem("avatarUrl")
  );
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-center">
          <AvatarSection 
            avatarUrl={avatarUrl} 
            userName={userName} 
            setAvatarUrl={setAvatarUrl} 
          />
          
          <Separator className="my-2" />
        </DrawerHeader>
        
        <div className="px-4 pb-6">
          <ToggleSettings 
            isListening={isListening}
            toggleSoundDetection={toggleSoundDetection}
            isMotionDetectionEnabled={isMotionDetectionEnabled}
            toggleMotionDetection={toggleMotionDetection}
          />
          
          <Separator className="my-4" />
          
          <NavigationMenu handleLogout={handleLogout} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
