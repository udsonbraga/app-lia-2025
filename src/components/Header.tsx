
import { useNavigate } from "react-router-dom";
import { MainDrawer } from "@/components/MainDrawer";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";

interface HeaderProps {
  isDisguised: boolean;
  toggleDisguise: () => void;
}

export function Header({ isDisguised }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            {/* Only show drawer menu when not in disguise mode */}
            {!isDisguised && <MainDrawer />}
          </div>
          
          <h1 className="text-xl font-semibold">
            {isDisguised ? 'Notas Pessoais' : 'Safe Lady'}
          </h1>
          
          <div className="w-8"></div>
        </div>
      </div>
    </div>
  );
}
