
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { FinancialNote } from "@/types/financial";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays } from "lucide-react";

interface FinancialCalendarProps {
  notes: FinancialNote[];
}

export function FinancialCalendar({ notes }: FinancialCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const getDayContent = (day: Date) => {
    const dayNotes = notes.filter(
      note => format(new Date(note.dueDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    );

    if (dayNotes.length === 0) return null;

    return (
      <div className="w-full h-full absolute inset-0 flex items-center justify-center">
        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
          dayNotes.some(note => !note.isPaid) 
            ? 'bg-red-100' 
            : 'bg-green-100'
        }`}>
          {day.getDate()}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-red-500" />
        Calendário Financeiro
      </h2>
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        locale={ptBR}
        className="rounded-md border shadow pointer-events-auto"
        components={{
          DayContent: ({ date: day }) => getDayContent(day)
        }}
      />
    </div>
  );
}
