
import React from "react";
import { Shield } from "lucide-react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF84C6] to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-[#FEF7CD] drop-shadow-md" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Safe Lady
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
