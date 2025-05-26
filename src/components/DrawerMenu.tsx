
import { BookOpen, Shield, Users, MessageCircle, Settings, LogOut, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface DrawerMenuProps {
  onClose: () => void;
}

const DrawerMenu = ({ onClose }: DrawerMenuProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    {
      icon: Home,
      label: "Início",
      href: "/home",
    },
    {
      icon: MessageCircle,
      label: "Feedback",
      href: "/feedback",
    },
    {
      icon: Settings,
      label: "Configurações",
      href: "/settings",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 py-6">
        <nav className="space-y-2 px-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {user && (
        <div className="border-t border-gray-200 p-4">
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      )}
    </div>
  );
};

export default DrawerMenu;
