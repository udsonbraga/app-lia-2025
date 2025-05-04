
import React, { useEffect } from 'react';
import { Header } from "@/components/Header";
import { NormalMode } from "@/components/NormalMode";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/LoadingScreen";

const Home = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <div>Redirecionando para login...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-100 to-white flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 pt-20 pb-20 flex flex-col items-center">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vinda ao Safe Lady</h1>
          <p className="text-gray-600">Seu aplicativo pessoal de segurança e proteção</p>
        </div>
        
        <div className="w-full">
          <NormalMode />
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-1 text-xs text-center">
        © 2025 SafeLady. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default Home;
