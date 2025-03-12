
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const LoadingScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
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
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#FF84C6] to-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-72 h-72 sm:w-80 sm:h-80 mb-6">
        <img
          src="/lovable-uploads/0d65b2be-45e2-4d35-ae90-6efa24396f55.png"
          alt="Safe Lady Logo"
          className="w-full h-full object-contain animate-pulse"
        />
      </div>
      <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md">Safe Lady</h1>
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
