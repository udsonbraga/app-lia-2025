
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { LogOut, UserCircle, Settings, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DrawerMenu = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    localStorage.getItem("avatarUrl")
  );

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      localStorage.setItem("avatarUrl", imageUrl);
    }
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
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      description: "Suporte e informações"
    },
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="w-8 h-8 flex items-center justify-center">
          <Avatar className="h-8 w-8 border-2 border-gray-200">
            <AvatarImage src={avatarUrl || ""} alt="Avatar" />
            <AvatarFallback>
              <UserCircle className="h-8 w-8 text-gray-700" />
            </AvatarFallback>
          </Avatar>
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex flex-col items-center">
          <div className="relative mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              id="avatar-input"
            />
            <label
              htmlFor="avatar-input"
              className="cursor-pointer block"
            >
              <Avatar className="h-20 w-20 ring-4 ring-gray-100">
                <AvatarImage src={avatarUrl || ""} alt="Avatar" />
                <AvatarFallback>
                  <UserCircle className="h-20 w-20 text-gray-700" />
                </AvatarFallback>
              </Avatar>
            </label>
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
