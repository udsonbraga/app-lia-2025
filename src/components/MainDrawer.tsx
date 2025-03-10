
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, UserCircle, Upload, Trash2, Mic, PhoneIncoming, Palette, HelpCircle, LogOut, Moon, Sun, TextCursor } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { useEmergencySoundDetection } from "@/hooks/useEmergencySoundDetection";
import { useMotionDetector } from "@/hooks/useMotionDetector";
import { Separator } from "@/components/ui/separator";

export const MainDrawer = () => {
  const navigate = useNavigate();
  const { isListening, toggleSoundDetection } = useEmergencySoundDetection();
  const { isMotionDetectionEnabled, toggleMotionDetection } = useMotionDetector();
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem("avatarUrl")
  );
  const [userName, setUserName] = useState<string>("");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }

    // Apply dark mode class if enabled
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      localStorage.setItem("avatarUrl", imageUrl);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    localStorage.removeItem("avatarUrl");
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    localStorage.setItem("darkMode", newDarkModeState.toString());
  };

  const menuItems = [
    {
      title: "Personalizar",
      path: "/customize",
      icon: <Palette className="h-5 w-5 text-purple-600" />,
      description: "Alterar cores e temas"
    },
    {
      title: "Acessibilidade",
      path: "/accessibility",
      icon: <TextCursor className="h-5 w-5 text-blue-600" />,
      description: "Ajustar tamanho do texto"
    },
    {
      title: "Ajuda",
      path: "/help",
      icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
      description: "Suporte e informações"
    },
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-center">
          <div className="relative mb-2">
            <Avatar className="h-20 w-20 ring-4 ring-gray-100">
              <AvatarImage src={avatarUrl || ""} alt="Avatar" />
              <AvatarFallback>
                {userName ? userName.charAt(0).toUpperCase() : <UserCircle className="h-20 w-20 text-gray-700" />}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {userName && (
            <div className="text-lg font-medium mb-2">{userName}</div>
          )}
          
          <div className="flex gap-2 mb-4">
            <label htmlFor="avatar-input" className="cursor-pointer flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-gray-700">
              <Upload className="h-3 w-3" />
              Alterar foto
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-input"
              />
            </label>
            
            {avatarUrl && (
              <button 
                onClick={handleRemoveAvatar}
                className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md text-gray-700"
              >
                <Trash2 className="h-3 w-3" />
                Remover
              </button>
            )}
          </div>
          
          <Separator className="my-2" />
        </DrawerHeader>
        
        <div className="px-4 pb-6">
          <div className="w-full space-y-4 mb-6">
            <button className="w-full text-left">
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  {isDarkMode ? 
                    <Moon className="h-5 w-5 text-indigo-600" /> : 
                    <Sun className="h-5 w-5 text-yellow-500" />
                  }
                  <div>
                    <div className="font-medium text-gray-900">Modo Noturno</div>
                    <div className="text-sm text-gray-500">
                      Alterar entre tema claro e escuro
                    </div>
                  </div>
                </div>
                <div className="ml-auto">
                  <Switch 
                    id="dark-mode" 
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                    className={isDarkMode ? "bg-green-500" : ""}
                  />
                </div>
              </div>
            </button>
            
            <button className="w-full text-left">
              <div className="flex items-center">
                <div className="flex items-center gap-3">
                  <Mic className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">Detecção de Áudio</div>
                    <div className="text-sm text-gray-500">
                      Envia alerta automático ao detectar palavras de emergência
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
                      Alerta seus contatos em caso de movimento brusco
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
          
          <Separator className="my-4" />
          
          <nav className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.title}
                onClick={() => {
                  if (item.path) {
                    navigate(item.path);
                  }
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <div className="font-medium text-gray-900">{item.title}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
            
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-5 w-5" />
                <div className="font-medium">Sair</div>
              </div>
            </button>
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
