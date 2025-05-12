
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, LoaderCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const LoadingScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Iniciar a reprodução de áudio
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(error => {
        console.log("Erro ao reproduzir áudio:", error);
      });
    }

    // Initial animation delay
    setTimeout(() => {
      setShowWelcome(true);
    }, 600);

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              navigate("/login");
            }, 800);
          }, 500);
        }
        return newProgress < 100 ? newProgress : 100;
      });
    }, 40);

    return () => {
      clearInterval(interval);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#FF84C6] to-white transition-all duration-800 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Elemento de áudio */}
      <audio ref={audioRef} src="/loading-sound.mp3" preload="auto" />
      
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-20 left-20 w-28 h-28 rounded-full bg-[#FFAED9] opacity-30 blur-xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-[#FFAED9] opacity-20 blur-xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-20 h-20 rounded-full bg-[#FF84C6] opacity-20 blur-lg -z-10"></div>
      
      {/* Logo com animação */}
      <div className="w-72 h-72 sm:w-80 sm:h-80 mb-6 relative overflow-hidden">
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${
          showWelcome ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}>
          <div className="relative">
            <img
              src="/lovable-uploads/0d65b2be-45e2-4d35-ae90-6efa24396f55.png"
              alt="Lia Logo"
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              {loadingProgress < 100 && (
                <LoaderCircle className="w-8 h-8 text-white animate-spin" />
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Título com animação */}
      <div className={`transition-all duration-700 delay-300 transform ${
        showWelcome ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}>
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Lia
        </h1>
      </div>
      
      {/* Barra de progresso estilizada */}
      <div className={`w-64 transition-all duration-500 delay-500 ${
        showWelcome ? "opacity-100" : "opacity-0"
      }`}>
        <Progress 
          value={loadingProgress} 
          className="h-2 bg-white/30" 
        />
      </div>
      
      {/* Texto de carregamento com animação */}
      <p className={`text-white mt-2 transition-all duration-500 delay-700 font-medium ${
        showWelcome ? "opacity-100" : "opacity-0"
      }`}>
        {loadingProgress < 100 ? `Carregando... ${loadingProgress}%` : "Bem-vinda!"}
      </p>
      
      {/* Mensagem de boas-vindas com fade-in */}
      <div className={`mt-12 text-white/80 text-sm text-center max-w-xs transition-all duration-500 delay-1000 ${
        showWelcome && loadingProgress > 30 ? "opacity-100" : "opacity-0"
      }`}>
        <span className="font-medium">Sua segurança é nossa prioridade</span>
      </div>
    </div>
  );
};
