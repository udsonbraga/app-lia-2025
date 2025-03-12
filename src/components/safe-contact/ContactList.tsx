
import { User, Phone, MessageSquare, Trash2, Shield } from "lucide-react";
import { SafeContact } from "@/features/support-network/types";

interface ContactListProps {
  contacts: SafeContact[];
  onRemoveContact: (id: string) => void;
}

const ContactList = ({ contacts, onRemoveContact }: ContactListProps) => {
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
            {contact.twilioWhatsappNumber && (
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Shield className="h-3 w-3 mr-2 text-gray-400" />
                WhatsApp configurado
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1">
              <span className="text-gray-500">Parentesco:</span> {contact.relationship}
            </p>
          </div>
          <button
            onClick={() => onRemoveContact(contact.id)}
            className="p-1 hover:bg-red-50 rounded-full"
          >
            <Trash2 className="h-5 w-5 text-red-500" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ContactList;
