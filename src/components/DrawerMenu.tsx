
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu, Settings, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DrawerMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Dados Cadastrais",
      path: "/profile",
      icon: <Settings className="h-5 w-5 text-gray-600" />,
      description: "Atualize suas informações pessoais"
    },
    {
      title: "Personalizar",
      path: "/customize",
      icon: <Palette className="h-5 w-5 text-gray-600" />,
      description: "Mude cores e aparência do app"
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
        <button className="fixed top-3 left-3 p-2 z-50">
          <Menu className="h-6 w-6 text-gray-700" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6">
          <nav className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
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
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
