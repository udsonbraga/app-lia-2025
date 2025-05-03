
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeContact } from "@/features/support-network/types";
import { Separator } from "@/components/ui/separator";
import { User, Phone, MessageCircle, Users, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IconInput from "./form/IconInput";
import WhatsAppConfig from "./form/WhatsAppConfig";
import { formatPhone } from "./utils/formatPhone";

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
  const handlePhoneChange = (value: string) => {
    onNewContactChange({ ...newContact, phone: formatPhone(value) });
  };

  const handleWhatsAppConfigUpdate = (data: {
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioWhatsappNumber?: string;
  }) => {
    onNewContactChange({
      ...newContact,
      ...data
    });
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
          <IconInput
            icon={<User className="h-4 w-4" />}
            placeholder="Nome do contato"
            value={newContact.name}
            onChange={(value) => onNewContactChange({ ...newContact, name: value })}
          />
          
          <IconInput
            icon={<Phone className="h-4 w-4" />}
            placeholder="(00) 00000-0000"
            value={newContact.phone}
            onChange={handlePhoneChange}
          />
          
          <IconInput
            icon={<MessageCircle className="h-4 w-4" />}
            placeholder="ID do Telegram (sem @)"
            value={newContact.telegramId}
            onChange={(value) => onNewContactChange({ ...newContact, telegramId: value })}
          />
          
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

        <Separator className="my-2" />

        <WhatsAppConfig
          twilioAccountSid={newContact.twilioAccountSid}
          twilioAuthToken={newContact.twilioAuthToken}
          twilioWhatsappNumber={newContact.twilioWhatsappNumber}
          onUpdate={handleWhatsAppConfigUpdate}
        />

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
            <Save className="h-4 w-4" />
            {isEditing ? "Salvar Contato" : "Adicionar Contato"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddContactForm;
