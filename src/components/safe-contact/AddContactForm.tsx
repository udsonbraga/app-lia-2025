
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeContact } from "@/features/support-network/types";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

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
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);

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

      <Separator className="my-2" />

      <Collapsible
        open={isWhatsappOpen}
        onOpenChange={setIsWhatsappOpen}
        className="w-full"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900">
          <span>Configuração do WhatsApp (Twilio)</span>
          {isWhatsappOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-3 mt-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Twilio Account SID
            </label>
            <Input
              placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={newContact.twilioAccountSid}
              onChange={(e) =>
                onNewContactChange({
                  ...newContact,
                  twilioAccountSid: e.target.value,
                })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Identificação da conta no Twilio
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Twilio Auth Token
            </label>
            <Input
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              type="password"
              value={newContact.twilioAuthToken}
              onChange={(e) =>
                onNewContactChange({
                  ...newContact,
                  twilioAuthToken: e.target.value,
                })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Chave de autenticação para uso da API
            </p>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Twilio WhatsApp Number
            </label>
            <Input
              placeholder="whatsapp:+1xxxxxxxxxx"
              value={newContact.twilioWhatsappNumber}
              onChange={(e) =>
                onNewContactChange({
                  ...newContact,
                  twilioWhatsappNumber: e.target.value,
                })
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Número aprovado pelo WhatsApp para envio (formato: whatsapp:+1xxxxxxxxxx)
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onAddContact} className="bg-[#FF84C6] hover:bg-[#FF5AA9] text-white">
          Adicionar Contato
        </Button>
      </div>
    </div>
  );
};

export default AddContactForm;
