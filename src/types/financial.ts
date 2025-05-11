
/**
 * Tipos para gerenciamento de anotações financeiras
 */

export type FinancialCategory = 
  | "Cartão de Crédito" 
  | "Aluguel" 
  | "Parcelas" 
  | "Contas" 
  | "Outros";

export interface FinancialNote {
  id: string;
  title: string;
  amount: number;
  category: FinancialCategory | string;
  dueDate: string;
  isPaid: boolean;
  isRecurring: boolean;
  recurrenceInterval?: 'monthly' | 'weekly' | 'yearly';
  description?: string;
  createdAt: string;
}
