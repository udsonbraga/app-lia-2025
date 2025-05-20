
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SaveButtonProps {
  onClick: () => void;
  isSaving: boolean;
}

const SaveButton = ({ onClick, isSaving }: SaveButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isSaving}
      className="w-full flex items-center justify-center gap-2 bg-[#FF84C6] hover:bg-[#ff6cb7] text-white"
    >
      {isSaving ? (
        <>
          <span className="animate-pulse">Salvando...</span>
        </>
      ) : (
        <>
          <Save className="h-5 w-5" />
          Salvar
        </>
      )}
    </Button>
  );
};

export default SaveButton;
