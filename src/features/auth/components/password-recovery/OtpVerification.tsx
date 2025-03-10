
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RecoveryMethod } from "./types";

interface OtpVerificationProps {
  otp: string;
  setOtp: (otp: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  recoveryMethod: RecoveryMethod;
  recoveryEmail: string;
  recoveryPhone: string;
}

export const OtpVerification = ({
  otp,
  setOtp,
  isLoading,
  onSubmit,
  recoveryMethod,
  recoveryEmail,
  recoveryPhone,
}: OtpVerificationProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="otp">Código de verificação</Label>
        <Input
          id="otp"
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="000000"
          className="text-center text-2xl tracking-widest"
        />
        <p className="text-sm text-gray-500 mt-2">
          Digite o código de 6 dígitos enviado para {" "}
          {recoveryMethod === "email" ? recoveryEmail : recoveryPhone}
        </p>
      </div>

      <Button
        type="submit"
        className="w-full bg-safelady hover:bg-safelady/90"
        disabled={isLoading}
      >
        {isLoading ? "Verificando..." : "Verificar código"}
      </Button>
    </form>
  );
};
