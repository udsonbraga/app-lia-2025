
import { BottomNavigation } from "@/components/BottomNavigation";
import { Header } from "@/components/Header";
import { NormalMode } from "@/components/NormalMode";
import { useMotionDetector } from "@/hooks/useMotionDetector";
import { useState, useEffect } from "react";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Use motion detector
  useMotionDetector();

  // Check if dark mode is enabled
  useEffect(() => {
    const darkModeEnabled = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(darkModeEnabled);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-b from-rose-100 to-white ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      
      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Bem-vinda ao Safe Lady</h1>
          <p className="text-gray-600">Seu aplicativo pessoal de segurança e proteção</p>
        </div>
        
        <NormalMode />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white py-1 text-xs text-center">
        © 2025 SafeLady. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default Index;
