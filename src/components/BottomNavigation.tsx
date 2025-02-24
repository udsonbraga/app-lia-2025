
import { Home, Users, BookOpen, Phone, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const BottomNavigation = () => {
  const navigate = useNavigate();

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
          onClick={() => navigate("/support-network")}
          className="flex flex-col items-center p-2"
        >
          <Users className="h-6 w-6 text-red-500" />
          <span className="text-xs text-gray-600">Rede</span>
        </button>
        
        <button
          onClick={() => navigate("/diary")}
          className="flex flex-col items-center p-2"
        >
          <BookOpen className="h-6 w-6 text-red-500" />
          <span className="text-xs text-gray-600">Diário</span>
        </button>
        
        <button
          onClick={() => navigate("/safe-contact")}
          className="flex flex-col items-center p-2"
        >
          <Phone className="h-6 w-6 text-red-500" />
          <span className="text-xs text-gray-600">Contatos</span>
        </button>
      </div>
    </div>
  );
};
