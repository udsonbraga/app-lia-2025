
import { User, Phone, MessageSquare, Trash2, Pencil } from "lucide-react";
import { SafeContact } from "@/features/support-network/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";

interface ContactListProps {
  contacts: SafeContact[];
  onRemoveContact: (id: string) => void;
  onEditContact?: (contact: SafeContact) => void;
}

const ContactList = ({ contacts, onRemoveContact, onEditContact }: ContactListProps) => {
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setContactToDelete(id);
  };

  const confirmDelete = () => {
    if (contactToDelete) {
      onRemoveContact(contactToDelete);
      setContactToDelete(null);
    }
  };

  if (contacts.length === 0) {
    return (
      <div className="text-center py-8 mb-4">
        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <User className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500">
          Você ainda não adicionou contatos de segurança.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mb-8">
      {contacts.map((contact) => (
        <div
          key={contact.id}
          className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
        >
          <div className="flex-1">
            <h3 className="font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-safelady" />
              {contact.name}
            </h3>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <Phone className="h-3 w-3 mr-2 text-gray-400" />
              {contact.phone}
            </p>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MessageSquare className="h-3 w-3 mr-2 text-gray-400" />
              Telegram: @{contact.telegramId}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <span className="text-gray-500">Parentesco:</span> {contact.relationship}
            </p>
          </div>
          <div className="flex gap-2">
            {onEditContact && (
              <button
                onClick={() => onEditContact(contact)}
                className="p-1 hover:bg-blue-50 rounded-full"
                aria-label="Editar contato"
              >
                <Pencil className="h-5 w-5 text-blue-500" />
              </button>
            )}
            <button
              onClick={() => handleDeleteClick(contact.id)}
              className="p-1 hover:bg-red-50 rounded-full"
              aria-label="Remover contato"
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </button>
          </div>
        </div>
      ))}

      <AlertDialog open={!!contactToDelete} onOpenChange={(open) => !open && setContactToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este contato? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Não</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Sim, excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactList;
