
export interface FinancialNote {
  id: string;
  title: string;
  amount: number;
  category: string;
  dueDate: string;
  isRecurring: boolean;
  recurrenceInterval?: 'monthly' | 'weekly' | 'yearly';
  description?: string;
  isPaid: boolean;
  createdAt: string;
}

export type FinancialCategory = 
  | "Cartão de Crédito"
  | "Aluguel"
  | "Parcelas"
  | "Contas"
  | "Outros";
