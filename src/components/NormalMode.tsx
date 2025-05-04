
import { EmergencyButton } from "@/components/EmergencyButton";
import { MainNavigation } from "@/components/MainNavigation";

interface NormalModeProps {
  showPasswordPrompt: boolean;
  onCancel: () => void;
}

export function NormalMode({
  showPasswordPrompt,
  onCancel
}: NormalModeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <EmergencyButton />
        <MainNavigation />
      </div>
    </div>
  );
}
