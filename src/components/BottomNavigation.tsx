
import { Home, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const [isDisguised, setIsDisguised] = useState(false);

  const toggleDisguise = () => {
    setIsDisguised(!isDisguised);
    // Aqui você pode adicionar a lógica para mudar a aparência do app
    document.body.classList.toggle('disguise-mode');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="flex justify-around items-center">
        <button
          onClick={() => navigate("/")}
          className="flex flex-col items-center p-2"
        >
          <Home className="h-6 w-6 text-red-500" />
          <span className="text-xs text-gray-600">Início</span>
        </button>
        
        <button
          onClick={toggleDisguise}
          className="flex flex-col items-center p-2"
        >
          {isDisguised ? (
            <>
              <EyeOff className="h-6 w-6 text-red-500" />
              <span className="text-xs text-gray-600">Normal</span>
            </>
          ) : (
            <>
              <Eye className="h-6 w-6 text-red-500" />
              <span className="text-xs text-gray-600">Disfarce</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
