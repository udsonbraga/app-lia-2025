
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm flex items-center px-4 z-50">
      <button
        onClick={() => navigate('/home')}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
      >
        <ArrowLeft className="h-6 w-6 text-gray-700" />
      </button>
      <h1 className="text-xl font-semibold text-center flex-1">Rede de Apoio</h1>
      <div className="w-8" />
    </div>
  );
};

export default Header;
