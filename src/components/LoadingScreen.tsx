
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoadingScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Start fade out when loading is complete
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              navigate("/login");
            }, 500);
          }, 300);
        }
        return newProgress < 100 ? newProgress : 100;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-safelady transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-48 h-48 mb-6">
        <img
          src="/logo-shield.png"
          alt="Safe Lady Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold text-white mb-4">Safe Lady</h1>
      <div className="w-64 h-2 bg-white/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-white rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      <p className="text-white mt-2">Carregando... {loadingProgress}%</p>
    </div>
  );
};
