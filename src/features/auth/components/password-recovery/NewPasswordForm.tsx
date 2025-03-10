
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewPasswordFormProps {
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const NewPasswordForm = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  isLoading,
  onSubmit,
}: NewPasswordFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="new-password">Nova senha</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Digite sua nova senha"
        />
      </div>

      <div>
        <Label htmlFor="confirm-password">Confirme a nova senha</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Digite novamente sua nova senha"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-safelady hover:bg-safelady/90"
        disabled={isLoading}
      >
        {isLoading ? "Alterando..." : "Alterar senha"}
      </Button>
    </form>
  );
};
