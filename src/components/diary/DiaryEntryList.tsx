
import { useState } from "react";
import { format } from "date-fns";
import { Trash2, FileDown, MapPin } from "lucide-react";
import { DiaryEntry } from "@/types/diary";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

interface DiaryEntryListProps {
  entries: DiaryEntry[];
  onDelete: (id: string) => void;
  onExportPDF: (entry: DiaryEntry) => void;
}

const DiaryEntryList = ({ entries, onDelete, onExportPDF }: DiaryEntryListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setEntryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      onDelete(entryToDelete);
      setEntryToDelete(null);
    }
    setDeleteDialogOpen(false);
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
                {format(new Date(entry.createdAt), "dd/MM/yyyy 'às' HH:mm")}
              </time>
              <div className="flex space-x-2">
                <button
                  onClick={() => onExportPDF(entry)}
                  className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  title="Exportar como PDF"
                >
                  <FileDown className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteClick(entry.id)}
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
            
            {entry.attachments.some(att => att.url) && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Imagens:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {entry.attachments
                    .filter(att => att.url)
                    .map((att, idx) => (
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
            
            {entry.attachments.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-600">Anexos:</p>
                <ul className="mt-1 space-y-1">
                  {entry.attachments.map((attachment, index) => (
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

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja excluir este relato?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O relato será removido permanentemente do seu diário.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiaryEntryList;
