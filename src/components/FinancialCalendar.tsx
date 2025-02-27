
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { FinancialNote } from "@/types/financial";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      locale={ptBR}
      className="rounded-md border shadow"
      components={{
        DayContent: ({ day }) => getDayContent(day)
      }}
    />
  );
}
