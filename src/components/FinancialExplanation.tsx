
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PiggyBank } from "lucide-react";

export function FinancialExplanation() {
  const [showExplanation, setShowExplanation] = useState(true);
  
  if (!showExplanation) return null;
  
  return (
    <Card className="p-4 mb-6 bg-white animate-fade-in">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-safelady" />
          <h2 className="font-semibold text-lg">Finanças Pessoais</h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setShowExplanation(false)}
        >
          Fechar
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        Gerencie suas finanças pessoais de forma segura e discreta.
      </p>
    </Card>
  );
}
