
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const DiaryHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-semibold">Diário Seguro</h1>
          <div className="w-8" />
        </div>
      </div>
    </div>
  );
};
