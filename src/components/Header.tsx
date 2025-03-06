
import { useNavigate } from "react-router-dom";
import { MainDrawer } from "@/components/MainDrawer";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  isDisguised: boolean;
  toggleDisguise: () => void;
}

export function Header({ isDisguised }: HeaderProps) {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Get user avatar and name from localStorage
    const storedAvatar = localStorage.getItem("avatarUrl");
    const storedName = localStorage.getItem("userName");
    
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
    }
    
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

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
          
          {!isDisguised && (
            <div className="flex items-center">
              {userName && (
                <span className="text-sm font-medium mr-2 hidden sm:block">{userName}</span>
              )}
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl || ""} alt="Avatar" />
                <AvatarFallback>
                  {userName ? userName.charAt(0).toUpperCase() : <UserCircle className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
