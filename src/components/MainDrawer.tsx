
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, UserCircle, Upload, Trash2, Eye, EyeOff, HelpCircle, LogOut, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { useEmergencySoundDetection } from "@/hooks/useEmergencySoundDetection";
import { Separator } from "@/components/ui/separator";

export const MainDrawer = () => {
  const navigate = useNavigate();
  const { isDisguised, toggleDisguise } = useDisguiseMode();
  const { isListening, toggleSoundDetection } = useEmergencySoundDetection();
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem("avatarUrl")
  );
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Get user name from localStorage
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

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

  const menuItems = [
    {
      title: "Personalizar",
      path: "/customize",
      icon: <Palette className="h-5 w-5 text-purple-600" />,
      description: "Alterar cores e fontes"
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
          
          <div className="w-full space-y-4 px-4 py-2">
            {/* Modo disfarce toggle */}
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="disguise-mode" className="text-base font-medium flex items-center gap-2">
                  {isDisguised ? <EyeOff className="h-5 w-5 text-safelady" /> : <Eye className="h-5 w-5 text-safelady" />}
                  Modo Disfarce
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Oculta o app transformando-o em um app de notas pessoais
                </p>
              </div>
              <Switch 
                id="disguise-mode" 
                checked={isDisguised}
                onCheckedChange={toggleDisguise}
              />
            </div>
            
            {/* Detecção de som toggle */}
            <div className="flex justify-between items-center">
              <div>
                <Label htmlFor="sound-detection" className="text-base font-medium">
                  Detecção de Áudio
                </Label>
                <p className="text-sm text-gray-500 mt-1">
                  Envia alerta automático ao detectar palavras de emergência
                </p>
              </div>
              <Switch 
                id="sound-detection" 
                checked={isListening}
                onCheckedChange={toggleSoundDetection}
              />
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
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
