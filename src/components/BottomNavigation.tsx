
import { Home, Palette, Eye, EyeOff, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavigationProps {
  isDisguised?: boolean;
  onDisguiseToggle?: () => void;
  onSave?: () => void;
  showSave?: boolean;
}

export const BottomNavigation = ({ isDisguised, onDisguiseToggle, onSave, showSave }: BottomNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-6">
      <button
        onClick={() => navigate("/")}
        className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
        title="Início"
      >
        <Home className="h-6 w-6 text-red-500" />
      </button>
      
      <button
        onClick={onDisguiseToggle}
        className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
        title={isDisguised ? "Modo Normal" : "Modo Disfarce"}
      >
        {isDisguised ? 
          <EyeOff className="h-6 w-6 text-red-500" /> : 
          <Eye className="h-6 w-6 text-red-500" />
        }
      </button>
      
      <button
        onClick={() => navigate("/customize")}
        className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
        title="Personalizar"
      >
        <Palette className="h-6 w-6 text-red-500" />
      </button>

      {showSave && (
        <button
          onClick={onSave}
          className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
          title="Salvar"
        >
          <Save className="h-6 w-6 text-red-500" />
        </button>
      )}
    </div>
  );
};
