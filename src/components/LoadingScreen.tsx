
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

export const LoadingScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Iniciar a reprodução de áudio
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Ajuste o volume conforme necessário
      audioRef.current.play().catch(error => {
        console.log("Erro ao reproduzir áudio:", error);
      });
    }

    // Initial animation delay
    setTimeout(() => {
      setShowWelcome(true);
    }, 800);

    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const newProgress = prev + 5;
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
    }, 100);

    return () => {
      clearInterval(interval);
      // Parar a reprodução de áudio quando o componente for desmontado
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
      {/* Elemento de áudio - coloque seu arquivo de áudio no diretório public */}
      <audio ref={audioRef} src="/loading-sound.mp3" preload="auto" />
      
      <div className="w-72 h-72 sm:w-80 sm:h-80 mb-6 relative overflow-hidden">
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${showWelcome ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
          <img
            src="/lovable-uploads/0d65b2be-45e2-4d35-ae90-6efa24396f55.png"
            alt="Safe Lady Logo"
            className="w-full h-full object-contain animate-pulse"
          />
        </div>
      </div>
      
      <div className={`transition-all duration-700 delay-300 transform ${showWelcome ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-md flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Safe Lady
        </h1>
      </div>
      
      <div className={`w-64 h-2 bg-white/30 rounded-full overflow-hidden transition-all duration-500 delay-500 ${showWelcome ? "opacity-100" : "opacity-0"}`}>
        <div 
          className="h-full bg-white rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      
      <p className={`text-white mt-2 transition-all duration-500 delay-700 ${showWelcome ? "opacity-100" : "opacity-0"}`}>
        Carregando... {loadingProgress}%
      </p>
      
      <div className={`mt-12 text-white/80 text-sm text-center max-w-xs transition-all duration-500 delay-1000 ${showWelcome && loadingProgress > 30 ? "opacity-100" : "opacity-0"}`}>
        Sua segurança é nossa prioridade
      </div>
    </div>
  );
};
