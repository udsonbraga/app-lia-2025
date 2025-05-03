
import { EmergencyButton } from "@/components/EmergencyButton";
import { MainNavigation } from "@/components/MainNavigation";

export function NormalMode() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <EmergencyButton />
        <MainNavigation />
      </div>
    </div>
  );
}
