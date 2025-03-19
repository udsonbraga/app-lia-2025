
import { EmergencyButton } from "@/components/EmergencyButton";
import { MainNavigation } from "@/components/main-navigation/MainNavigation";
import { DisguisePasswordPrompt } from "@/components/DisguisePasswordPrompt";

interface NormalModeProps {
  showPasswordPrompt: boolean;
  disguisePassword: string;
  onPasswordChange: (password: string) => void;
  onDisguiseSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function NormalMode({
  showPasswordPrompt,
  disguisePassword,
  onPasswordChange,
  onDisguiseSubmit,
  onCancel
}: NormalModeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {showPasswordPrompt && (
        <DisguisePasswordPrompt
          password={disguisePassword}
          onPasswordChange={onPasswordChange}
          onSubmit={onDisguiseSubmit}
          onCancel={onCancel}
        />
      )}

      {!showPasswordPrompt && (
        <div className="w-full max-w-md space-y-6">
          <EmergencyButton />
          <MainNavigation />
        </div>
      )}
    </div>
  );
}
