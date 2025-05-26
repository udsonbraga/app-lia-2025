
import html2pdf from 'html2pdf.js';
import { format } from "date-fns";
import { DiaryEntry } from "@/types/diary";

export const generateDiaryEntryPDF = (entry: DiaryEntry): void => {
  const content = document.createElement('div');
  const currentUserName = localStorage.getItem('userName') || 'Usuário';
  
  let imagesHtml = '';
  if (entry.attachments.some(att => att.url)) {
    imagesHtml = `
      <h2>Imagens</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; margin-bottom: 20px;">
        ${entry.attachments
          .filter(att => att.url)
          .map(att => `
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
      <p><strong>Data:</strong> ${format(new Date(entry.createdAt), "dd/MM/yyyy 'às' HH:mm")}</p>
      <p><strong>Local:</strong> ${entry.location}</p>
      <h2>Descrição da Ocorrência</h2>
      <p style="white-space: pre-wrap;">${entry.text}</p>
      
      ${imagesHtml}
      
      ${entry.attachments.length > 0 ? `
        <h2>Anexos</h2>
        <ul>
          ${entry.attachments.map(attachment => `<li>${attachment.name}</li>`).join('')}
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
    filename: `relato-${format(new Date(entry.createdAt), "dd-MM-yyyy")}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  return html2pdf().from(content).set(opt).save();
};
