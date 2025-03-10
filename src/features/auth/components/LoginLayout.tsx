
import React from "react";

interface LoginLayoutProps {
  children: React.ReactNode;
}

export const LoginLayout = ({ children }: LoginLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF84C6] to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/0d65b2be-45e2-4d35-ae90-6efa24396f55.png" 
            alt="Safe Lady Logo" 
            className="h-24 w-24 object-contain" 
          />
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
