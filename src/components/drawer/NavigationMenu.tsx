
import { useNavigate } from "react-router-dom";
import { HelpCircle, LogOut } from "lucide-react";

interface NavigationMenuProps {
  handleLogout: () => void;
}

export const NavigationMenu = ({ handleLogout }: NavigationMenuProps) => {
  const navigate = useNavigate();
  
  const menuItems = [
    {
      title: "Ajuda",
      path: "/help",
      icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
      description: "Suporte e informações"
    },
  ];

  return (
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
  );
};
