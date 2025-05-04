
import { useState, useEffect } from "react";
import { MapPin, Trash2, FileDown } from "lucide-react";
import { format } from "date-fns";
import html2pdf from 'html2pdf.js';
import { DiaryEntry } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface EntryListProps {
  entries: DiaryEntry[];
  onDelete: (id: string) => Promise<void>;
  userName: string;
}

export const EntryList = ({ entries, onDelete, userName }: EntryListProps) => {
  const { toast } = useToast();

  const generatePDF = (entry: any) => {
    const content = document.createElement('div');
    const currentUserName = userName || 'Usuário';
    
    let imagesHtml = '';
    if (entry.attachments && entry.attachments.some((att: any) => att.url)) {
      imagesHtml = `
        <h2>Imagens</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; margin-bottom: 20px;">
          ${entry.attachments
            .filter((att: any) => att.url)
            .map((att: any) => `
              <div style="margin-bottom: 10px;">
                <img src="${att.url}" style="max-width: 300px; max-height: 200px; border: 1px solid #ccc; border-radius: 4px;" />
                <p style="margin-top: 5px; font-size: 12px; color: #666;">${att.name}</p>
              </div>
            `).join('')}
        </div>
      `;
    }
    
    content.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; position: relative;">
        <h1 style="text-align: center; color: #000000; font-size: 28px; font-weight: bold;">Relatório Seguro</h1>
        <p><strong>Data:</strong> ${format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm")}</p>
        <p><strong>Local:</strong> ${entry.location}</p>
        <h2>Descrição da Ocorrência</h2>
        <p style="white-space: pre-wrap;">${entry.text}</p>
        
        ${imagesHtml}
        
        ${entry.attachments && entry.attachments.length > 0 ? `
          <h2>Anexos</h2>
          <ul>
            ${entry.attachments.map((attachment: any) => `<li>${attachment.name}</li>`).join('')}
          </ul>
        ` : ''}
        
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; pointer-events: none; opacity: 0.1; transform: rotate(-30deg); font-size: 80px; color: #FF84C6; font-weight: bold;">
          SAFE LADY
        </div>
        
        <footer style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px; text-align: right; font-size: 12px; color: #666;">
          <p>Documento gerado por: ${currentUserName}</p>
          <p>Data de geração: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}</p>
        </footer>
      </div>
    `;

    const opt = {
      margin: 10,
      filename: `relato-${format(new Date(entry.created_at), "dd-MM-yyyy")}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(content).set(opt).save();

    toast({
      title: "PDF gerado",
      description: "O relatório foi exportado com sucesso.",
    });
  };

  if (entries.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Entradas anteriores</h2>
      <div className="divide-y divide-gray-100">
        {entries.map((entry) => (
          <div key={entry.id} className="py-4">
            <div className="flex justify-between items-start mb-2">
              <time className="text-sm text-gray-500">
                {format(new Date(entry.created_at), "dd/MM/yyyy 'às' HH:mm")}
              </time>
              <div className="flex space-x-2">
                <button
                  onClick={() => generatePDF(entry)}
                  className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  title="Exportar como PDF"
                >
                  <FileDown className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(entry.id)}
                  className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  title="Remover relato"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">{entry.location}</p>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{entry.text}</p>
            
            {entry.attachments && entry.attachments.some((att: any) => att.url) && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Imagens:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {entry.attachments
                    .filter((att: any) => att.url)
                    .map((att: any, idx: number) => (
                      <div key={idx} className="border rounded-md overflow-hidden">
                        <img 
                          src={att.url} 
                          alt={att.name}
                          className="h-32 w-full object-cover" 
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {entry.attachments && entry.attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-600">Anexos:</p>
                <ul className="mt-1 space-y-1">
                  {entry.attachments.map((attachment: any, index: number) => (
                    <li key={index} className="text-sm text-gray-500">
                      {attachment.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
