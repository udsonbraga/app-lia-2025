
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TermsCheckboxProps {
  acceptedTerms: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function TermsCheckbox({ 
  acceptedTerms, 
  onCheckedChange,
  disabled = false 
}: TermsCheckboxProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-start space-x-2">
      <Checkbox 
        id="terms" 
        checked={acceptedTerms}
        onCheckedChange={(checked) => onCheckedChange(checked === true)}
        className="mt-1"
        disabled={disabled}
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Eu li e aceito a Política de Privacidade
        </label>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            navigate('/help');
          }}
          className="text-xs text-[#8B5CF6] underline flex items-center gap-1"
        >
          Leia nossa Política de Privacidade
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

export default TermsCheckbox;
