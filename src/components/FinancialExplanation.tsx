
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";

export function FinancialExplanation() {
  const [showExplanation, setShowExplanation] = useState(true);
  
  if (!showExplanation) return null;
  
  return (
    <Card className="p-4 mb-6 bg-white/90 animate-fade-in border-[#FFE4F1] shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-[#FF84C6]" />
          <h2 className="font-semibold text-lg">Finanças Pessoais</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowExplanation(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Fechar
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        Este recurso te ajuda a gerenciar suas finanças pessoais de forma segura e discreta.
      </p>
    </Card>
  );
}
