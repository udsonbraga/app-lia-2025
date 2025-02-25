
import { Home, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BottomNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-1 px-4">
      <div className="flex justify-around items-center">
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center p-2"
        >
          <Home className="h-5 w-5 text-red-500" />
          <span className="text-xs text-gray-600">Início</span>
        </button>
        
        <button
          onClick={() => navigate("/customize")}
          className="flex flex-col items-center p-2"
        >
          <Palette className="h-5 w-5 text-red-500" />
          <span className="text-xs text-gray-600">Personalizar</span>
        </button>
      </div>
    </div>
  );
};
