
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormFieldsProps {
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setShowRecovery: (show: boolean) => void;
}

export const LoginFormFields = ({
  email,
  password,
  setEmail,
  setPassword,
  setShowRecovery
}: LoginFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF84C6] focus:border-[#FF84C6]"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Senha
        </Label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#FF84C6] focus:border-[#FF84C6]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="text-sm">
          <button
            type="button"
            onClick={() => setShowRecovery(true)}
            className="font-medium text-[#FF84C6] hover:text-[#FF5AA9]"
          >
            Esqueci minha senha
          </button>
        </div>
      </div>
    </>
  );
};
