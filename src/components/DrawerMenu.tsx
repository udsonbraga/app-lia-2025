
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DrawerMenu = () => {
  const navigate = useNavigate();

  const menuItems = [
    { title: "Início", path: "/" },
    { title: "Rede de Apoio", path: "/support-network" },
    { title: "Diário Seguro", path: "/diary" },
    { title: "Contato Seguro", path: "/safe-contact" },
    { title: "Configurações", path: "/settings" },
    { title: "Ajuda", path: "/help" },
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
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                }}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {item.title}
              </button>
            ))}
          </nav>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
