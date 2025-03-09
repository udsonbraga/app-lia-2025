
import React, { useEffect, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress - make it faster
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 10; // Increase by 10% each time for faster loading
        if (newProgress >= 100) {
          clearInterval(interval);
          // Start fade out when loading is complete
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              onComplete();
            }, 300); // Reduced from 500ms to 300ms for faster transition
          }, 200); // Reduced from 300ms to 200ms for faster experience
        }
        return newProgress < 100 ? newProgress : 100;
      });
    }, 70); // Reduced from 100ms to 70ms for faster loading

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-safelady transition-opacity duration-300 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-64 h-64 mb-4">
        <img
          src="/lovable-uploads/6ea1fa8d-6a04-4ff5-b6b9-89a2a7d8e585.png"
          alt="Safe Lady Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Safe Lady</h1>
      <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full transition-all duration-200 ease-out"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      <p className="text-white mt-2">Carregando... {loadingProgress}%</p>
    </div>
  );
};
