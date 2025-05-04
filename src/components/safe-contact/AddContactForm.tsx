
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeContact } from "@/features/support-network/types";
import { User, Phone, MessageCircle, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AddContactFormProps {
  newContact: Omit<SafeContact, "id">;
  onNewContactChange: (contact: Omit<SafeContact, "id">) => void;
  onAddContact: () => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const AddContactForm = ({
  newContact,
  onNewContactChange,
  onAddContact,
  onCancel,
  isEditing = false,
}: AddContactFormProps) => {
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  return (
    <Card className="mb-4 border border-gray-200 shadow-sm">
      <CardHeader className="p-4 bg-gray-50 rounded-t-lg">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {isEditing ? "Editar Contato" : "Adicionar Novo Contato"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Nome do contato"
              value={newContact.name}
              onChange={(e) =>
                onNewContactChange({ ...newContact, name: e.target.value })
              }
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="(00) 00000-0000"
              value={newContact.phone}
              onChange={(e) =>
                onNewContactChange({
                  ...newContact,
                  phone: formatPhone(e.target.value),
                })
              }
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <MessageCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="ID do Telegram (sem @)"
              value={newContact.telegramId}
              onChange={(e) =>
                onNewContactChange({
                  ...newContact,
                  telegramId: e.target.value,
                })
              }
              className="pl-10"
            />
          </div>
          
          <div className="relative">
            <Users className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            <Select
              value={newContact.relationship}
              onValueChange={(value) =>
                onNewContactChange({
                  ...newContact,
                  relationship: value,
                })
              }
            >
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Selecione o parentesco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pai">Pai</SelectItem>
                <SelectItem value="Mãe">Mãe</SelectItem>
                <SelectItem value="Irmão/Irmã">Irmão/Irmã</SelectItem>
                <SelectItem value="Tio/Tia">Tio/Tia</SelectItem>
                <SelectItem value="Amigo/Amiga">Amigo/Amiga</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button 
            onClick={onAddContact} 
            className="flex-1 bg-[#FF84C6] hover:bg-[#FF5AA9] text-white flex items-center justify-center gap-2"
          >
            {isEditing ? "Salvar Contato" : "Adicionar Contato"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddContactForm;
