
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LogOut, UserCircle, Settings, Palette, Upload, Trash2, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DrawerMenu = () => {
  const navigate = useNavigate();
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
        <button className="flex items-center justify-center">
          <Avatar className="h-8 w-8 border-2 border-gray-200">
            <AvatarImage src={avatarUrl || ""} alt="Avatar" />
            <AvatarFallback>
              {userName ? userName.charAt(0).toUpperCase() : <UserCircle className="h-8 w-8 text-gray-700" />}
            </AvatarFallback>
          </Avatar>
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
