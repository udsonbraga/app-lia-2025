
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Phone } from "lucide-react";

export function MainNavigation() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={() => navigate("/support-network")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
      >
        <Users className="h-6 w-6 text-red-500" />
        <span className="font-medium text-gray-800">Rede de Apoio</span>
      </button>

      <button
        onClick={() => navigate("/diary")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
      >
        <BookOpen className="h-6 w-6 text-red-500" />
        <span className="font-medium text-gray-800">Diário Seguro</span>
      </button>

      <button
        onClick={() => navigate("/safe-contact")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-3"
      >
        <Phone className="h-6 w-6 text-red-500" />
        <span className="font-medium text-gray-800">Contato Seguro</span>
      </button>
    </div>
  );
}
