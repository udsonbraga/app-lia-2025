
import { Eye, EyeOff } from "lucide-react";

interface BottomNavigationProps {
  isDisguised?: boolean;
  onDisguiseToggle?: () => void;
}

export const BottomNavigation = ({ isDisguised, onDisguiseToggle }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-center items-center">
      {onDisguiseToggle && (
        <button
          onClick={onDisguiseToggle}
          className="p-3 hover:bg-gray-100 rounded-full transition-colors"
          title={isDisguised ? "Modo Normal" : "Modo Disfarce"}
        >
          {isDisguised ? (
            <EyeOff className="h-7 w-7 text-safelady" />
          ) : (
            <Eye className="h-7 w-7 text-safelady" />
          )}
        </button>
      )}
    </div>
  );
};
