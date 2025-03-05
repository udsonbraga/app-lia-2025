
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeContact } from "@/features/support-network/types";

interface AddContactFormProps {
  newContact: Omit<SafeContact, "id">;
  onNewContactChange: (contact: Omit<SafeContact, "id">) => void;
  onAddContact: () => void;
  onCancel: () => void;
}

const AddContactForm = ({
  newContact,
  onNewContactChange,
  onAddContact,
  onCancel,
}: AddContactFormProps) => {
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    return value;
  };

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 className="font-medium">Adicionar Novo Contato</h3>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Nome</label>
        <Input
          placeholder="Nome do contato"
          value={newContact.name}
          onChange={(e) =>
            onNewContactChange({ ...newContact, name: e.target.value })
          }
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Telefone
        </label>
        <Input
          placeholder="(00) 00000-0000"
          value={newContact.phone}
          onChange={(e) =>
            onNewContactChange({
              ...newContact,
              phone: formatPhone(e.target.value),
            })
          }
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          ID do Telegram
        </label>
        <Input
          placeholder="username (sem @)"
          value={newContact.telegramId}
          onChange={(e) =>
            onNewContactChange({
              ...newContact,
              telegramId: e.target.value,
            })
          }
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">
          Parentesco
        </label>
        <Select
          value={newContact.relationship}
          onValueChange={(value) =>
            onNewContactChange({
              ...newContact,
              relationship: value,
            })
          }
        >
          <SelectTrigger>
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
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onAddContact}>Adicionar Contato</Button>
      </div>
    </div>
  );
};

export default AddContactForm;
