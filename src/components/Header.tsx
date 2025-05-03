
import { useNavigate } from "react-router-dom";
import { MainDrawer } from "@/components/MainDrawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle, Spy } from "lucide-react";
import { useEffect, useState } from "react";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";

export function Header() {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const { isDisguiseActive, toggleDisguiseMode } = useDisguiseMode();

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
            <MainDrawer />
          </div>
          
          <h1 className="text-xl font-semibold">Safe Lady</h1>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              {userName && !isDisguiseActive && (
                <span className="text-sm font-medium mr-2 hidden sm:block">{userName}</span>
              )}
              <button 
                onClick={toggleDisguiseMode}
                className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all"
              >
                {isDisguiseActive ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={avatarUrl || ""} alt="Avatar" />
                    <AvatarFallback>
                      {userName ? userName.charAt(0).toUpperCase() : <UserCircle className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Spy className="h-6 w-6 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
