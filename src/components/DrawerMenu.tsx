
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Settings, Palette, LogOut, UserCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const DrawerMenu = () => {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isDisguised, setIsDisguised] = useState(false);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const toggleDisguise = () => {
    setIsDisguised(!isDisguised);
    document.body.classList.toggle('disguise-mode');
  };

  const menuItems = [
    {
      title: isDisguised ? "Modo Normal" : "Modo Disfarce",
      action: toggleDisguise,
      icon: isDisguised ? <EyeOff className="h-5 w-5 text-gray-600" /> : <Eye className="h-5 w-5 text-gray-600" />,
      description: "Alterne entre os modos de visualização"
    },
    {
      title: "Dados Cadastrais",
      path: "/profile",
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      description: "Atualize suas informações pessoais"
    },
    {
      title: "Ajuda",
      path: "/help",
      icon: null,
      description: "Suporte e informações"
    },
  ];

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="w-8 h-8 flex items-center justify-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
            />
          ) : (
            <UserCircle className="h-8 w-8 text-gray-700" />
          )}
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
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="h-20 w-20 rounded-full object-cover ring-4 ring-gray-100"
                />
              ) : (
                <UserCircle className="h-20 w-20 text-gray-700" />
              )}
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
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
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
