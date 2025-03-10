
import React from "react";
import { Shield } from "lucide-react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-safelady to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-white drop-shadow-lg animate-pulse" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white drop-shadow-md">
          Safe Lady
        </h2>
        <p className="mt-2 text-center text-sm text-white/90">
          Sua segurança é nossa prioridade
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 hover:shadow-xl transition-shadow duration-300">
          {children}
        </div>
      </div>
    </div>
  );
};
