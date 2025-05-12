
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const SkeletonLoadingScreen = () => {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Efeito simulando o carregamento
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        navigate("/login");
      }, 800);
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-full max-w-md px-4">
        {/* Logo placeholder */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <Shield className="w-20 h-20 text-[#FF84C6]" />
            <Skeleton className="absolute inset-0 rounded-full w-20 h-20 animate-pulse" />
          </div>
        </div>

        {/* Card com skeleton para formulário de login */}
        <Card className="w-full p-6 shadow-md">
          {/* Header skeleton */}
          <div className="mb-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Campo de email skeleton */}
          <div className="mb-6">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Campo de senha skeleton */}
          <div className="mb-6">
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Esqueci senha link skeleton */}
          <div className="flex justify-end mb-6">
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Botão de login skeleton */}
          <Skeleton className="h-10 w-full mb-4" />

          {/* Divisor skeleton */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Skeleton className="w-full h-px" />
            </div>
            <div className="relative flex justify-center">
              <Skeleton className="w-24 h-6 bg-white" />
            </div>
          </div>

          {/* Botão social login skeleton */}
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    </div>
  );
};
