
import React, { useEffect } from 'react';
import { Header } from "@/components/disguise/Header";
import { DisguiseModeContainer } from "@/components/disguise/DisguiseModeContainer";
import { useDisguiseMode } from "@/hooks/useDisguiseMode";

const DisguiseModePage: React.FC = () => {
  const { exitDisguiseMode } = useDisguiseMode();

  // Initialize products when the component mounts
  useEffect(() => {
    // This will ensure we have products to display when entering disguise mode
    const initializeData = async () => {
      // Any initial setup for disguise mode can go here
    };
    
    initializeData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onExitDisguise={exitDisguiseMode} 
        onAddProduct={() => {}} // We'll handle this through container
      />
      
      <div className="container mx-auto px-4 pt-20 pb-20">
        <DisguiseModeContainer />
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 text-gray-600 py-1 text-xs text-center">
        © 2025 Moda Feminina. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default DisguiseModePage;
