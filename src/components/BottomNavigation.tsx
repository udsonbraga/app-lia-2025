import { Eye, EyeOff } from "lucide-react";

interface BottomNavigationProps {
  isDisguised?: boolean;
}

export const BottomNavigation = ({ isDisguised }: BottomNavigationProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex justify-center items-center">
      {/* Bottom navigation content removed as requested */}
    </div>
  );
};
