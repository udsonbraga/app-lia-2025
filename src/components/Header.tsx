
import { useNavigate } from "react-router-dom";
import { MainDrawer } from "@/components/MainDrawer";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, UserCircle, Store, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { handleEmergencyAlert } from "@/utils/emergencyUtils";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  isDisguised: boolean;
  toggleDisguise: () => void;
}

export function Header({ isDisguised, toggleDisguise }: HeaderProps) {
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const { toast } = useToast();

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

  const handleDisguisedCart = () => {
    // Check if there are any emergency contacts configured
    const safeContacts = localStorage.getItem("safeContacts");
    const contacts = safeContacts ? JSON.parse(safeContacts) : [];
    
    if (contacts.length === 0) {
      // Show empty cart message if no emergency contacts
      toast({
        title: "Seu Carrinho está vazio",
        description: "Adicione produtos para continuar com a compra.",
      });
      return;
    }
    
    // Trigger emergency alert silently
    try {
      handleEmergencyAlert({ toast })
        .then(() => {
          // Show processing message to maintain disguise
          toast({
            title: "Seu pedido está sendo processado",
            description: "Aguarde enquanto preparamos seus itens.",
          });
        })
        .catch((error) => {
          console.error("Erro ao processar carrinho:", error);
        });
    } catch (error) {
      console.error("Erro ao processar carrinho:", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
      <div className="container mx-auto h-full">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            {/* Only show drawer menu when not in disguise mode */}
            {!isDisguised && <MainDrawer />}
            
            {/* Back button for disguise mode */}
            {isDisguised && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mr-2 p-1"
                onClick={toggleDisguise}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <h1 className="text-xl font-semibold">
            {isDisguised ? 'Moda Elegante' : 'Lia'}
          </h1>
          
          <div className="flex items-center gap-3">
            {/* Shopping Cart icon when in disguised mode */}
            {isDisguised && (
              <button 
                onClick={handleDisguisedCart}
                className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-100 transition-colors"
                aria-label="Carrinho de compras"
              >
                <ShoppingCart className="h-5 w-5 text-pink-500" />
              </button>
            )}
            
            {!isDisguised && (
              <button 
                onClick={toggleDisguise}
                className="flex items-center gap-2 text-sm px-2 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Store className="h-5 w-5 text-safelady" />
              </button>
            )}
            
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
    </div>
  );
}
