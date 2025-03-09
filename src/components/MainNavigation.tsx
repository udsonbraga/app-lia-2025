
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Phone, MessageSquare } from "lucide-react";
import { FeedbackButton } from "./FeedbackButton";

export function MainNavigation() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={() => navigate("/support-network")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
      >
        <div className="flex items-center gap-3 mx-auto">
          <Users className="h-6 w-6 text-red-500" />
          <span className="font-medium text-gray-800 text-center">Rede de Apoio</span>
        </div>
      </button>

      <button
        onClick={() => navigate("/diary")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
      >
        <div className="flex items-center gap-3 mx-auto">
          <BookOpen className="h-6 w-6 text-red-500" />
          <span className="font-medium text-gray-800 text-center">Diário Seguro</span>
        </div>
      </button>

      <button
        onClick={() => navigate("/safe-contact")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
      >
        <div className="flex items-center gap-3 mx-auto">
          <Phone className="h-6 w-6 text-red-500" />
          <span className="font-medium text-gray-800 text-center">Contato Seguro</span>
        </div>
      </button>

      <FeedbackButton />
    </div>
  );
}
