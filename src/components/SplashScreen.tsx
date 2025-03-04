
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const SplashScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate("/login");
      }, 500); // Short fade-out transition before navigation
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-safelady transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-48 h-48 mb-6 logo-pulse">
        <img
          src="/logo-shield.png"
          alt="Safe Lady Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold text-white">Safe Lady</h1>
      <p className="text-white mt-2">Proteção e segurança para você</p>
    </div>
  );
};
