
export type RecoveryStep = 'input' | 'otp' | 'newPassword' | 'success';
export type RecoveryMethod = "email" | "phone";

export interface PasswordRecoveryProps {
  onBack: () => void;
}
