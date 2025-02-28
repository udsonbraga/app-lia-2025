
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DrawerMenu } from "@/components/DrawerMenu";

interface HeaderProps {
  isDisguised: boolean;
  toggleDisguise: () => void;
}

export function Header({ isDisguised, toggleDisguise }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full px-4">
          {isDisguised ? (
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
          ) : (
            <div className="w-8"></div>
          )}
          <h1 className="text-xl font-semibold">
            {isDisguised ? 'Notas Pessoais' : 'Safe Lady'}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDisguise}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title={isDisguised ? "Modo Normal" : "Modo Disfarce"}
            >
              {isDisguised ? 
                <EyeOff className="h-6 w-6 text-red-500" /> : 
                <Eye className="h-6 w-6 text-red-500" />
              }
            </button>
            {!isDisguised && <DrawerMenu />}
          </div>
        </div>
      </div>
    </div>
  );
}
