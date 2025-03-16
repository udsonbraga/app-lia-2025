
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface LoginFormButtonsProps {
  isLoading: boolean;
}

export const LoginFormButtons = ({ isLoading }: LoginFormButtonsProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-4">
      <Button
        type="submit"
        className="w-full bg-[#FF84C6] hover:bg-[#FF5AA9] transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
      
      <Button
        variant="outline"
        className="w-full transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-[#D6BCFA] hover:bg-[#C4B5FD] text-purple-800 border-purple-300"
        onClick={() => navigate("/register")}
      >
        Criar nova conta
      </Button>
    </div>
  );
};
