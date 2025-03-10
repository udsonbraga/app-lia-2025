
import React from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF84C6] to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-[#FF84C6] opacity-50 blur-3xl -z-10" />
      <div className="absolute top-40 left-20 w-20 h-20 rounded-full bg-[#FFAED9] opacity-50 blur-xl -z-10" />
      <div className="absolute bottom-20 right-20 w-32 h-32 rounded-full bg-[#FFAED9] opacity-40 blur-xl -z-10" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/0d65b2be-45e2-4d35-ae90-6efa24396f55.png" 
            alt="Safe Lady Logo" 
            className="h-28 w-28 object-contain drop-shadow-lg" 
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white drop-shadow-md">
          Safe Lady
        </h2>
        <p className="mt-2 text-center text-sm text-white/80">
          Seu aplicativo pessoal de segurança e proteção
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-pink-100">
          {children}
        </div>
      </div>
    </div>
  );
};
