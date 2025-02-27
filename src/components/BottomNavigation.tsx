import { Eye, EyeOff } from "lucide-react";

interface BottomNavigationProps {
  isDisguised?: boolean;
  onDisguiseToggle?: () => void;
}

export const BottomNavigation = ({ isDisguised, onDisguiseToggle }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-center items-center">
      {/* Mantemos a div vazia para futura expansão se necessário */}
    </div>
  );
};
