
import { useHasSafeContacts } from "@/hooks/useSafeContacts";
import { Link } from "react-router-dom";
import { MainDrawer } from "@/components/MainDrawer";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { FeedbackButton } from "@/components/FeedbackButton";

interface HeaderProps {
  isDisguised?: boolean;
  toggleDisguise?: () => void;
}

export function Header({ isDisguised = false, toggleDisguise }: HeaderProps) {
  const { hasSafeContacts } = useHasSafeContacts();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-40 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <MainDrawer />
          
          {!isDisguised && (
            <Link to="/home" className="ml-2 font-bold text-neutral-800 text-lg">
              Safe Lady
            </Link>
          )}
          
          {isDisguised && (
            <span className="ml-2 font-bold text-neutral-800 text-lg">
              Finanças Pessoais
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {!hasSafeContacts && !isDisguised && (
            <Link 
              to="/safe-contact" 
              className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-xs"
            >
              <AlertTriangle className="h-3 w-3" />
              Configure contatos de segurança
            </Link>
          )}
          
          <FeedbackButton />
          
          {toggleDisguise && (
            <button
              onClick={toggleDisguise}
              className={`
                flex items-center gap-1 px-3 py-2 rounded-md text-sm
                ${isDisguised 
                  ? "bg-neutral-800 text-white hover:bg-neutral-700" 
                  : "bg-neutral-800 text-white hover:bg-neutral-700"}
              `}
            >
              {isDisguised ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  <span>Modo Normal</span>
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  <span>Ativar Modo Disfarce</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
