
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PiggyBank, Wallet, Receipt, ArrowDown, ArrowUp } from "lucide-react";

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
      
      <p className="text-sm text-gray-600 mb-3">
        Este recurso te ajuda a gerenciar suas finanças pessoais de forma segura e discreta,
        registrando e acompanhando seus gastos e receitas sem levantar suspeitas.
      </p>
      
      <div className="space-y-3 mb-3">
        <h3 className="font-medium text-gray-800">Como você pode usar:</h3>
        
        <div className="flex items-start gap-3 pl-2">
          <Wallet className="h-4 w-4 text-safelady mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-medium">Controle de gastos:</span> Registre suas despesas, como alimentação, transporte e aluguel.
          </p>
        </div>
        
        <div className="flex items-start gap-3 pl-2">
          <Receipt className="h-4 w-4 text-safelady mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-medium">Acompanhamento de contas:</span> Anote as contas a pagar, seus valores e datas de vencimento.
          </p>
        </div>
        
        <div className="flex items-start gap-3 pl-2">
          <ArrowDown className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-medium">Registro de receitas:</span> Acompanhe depósitos, salários e outras fontes de renda.
          </p>
        </div>
        
        <div className="flex items-start gap-3 pl-2">
          <ArrowUp className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            <span className="font-medium">Visualização de gastos:</span> Veja quanto já gastou no mês, no que gastou e quando.
          </p>
        </div>
      </div>
      
      <Separator className="my-3" />
      
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">Exemplos:</h3>
        <ul className="text-sm space-y-2 pl-4 list-disc">
          <li><span className="font-medium">Aluguel:</span> R$ 1.200,00 - Todo dia 10</li>
          <li><span className="font-medium">Conta de Luz:</span> R$ 150,00 - Todo dia 15</li>
          <li><span className="font-medium">Salário:</span> R$ 3.000,00 - Todo dia 5</li>
          <li><span className="font-medium">Assinatura Netflix:</span> R$ 39,90 - Todo dia 20</li>
        </ul>
      </div>
    </Card>
  );
}
