import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SafeContact } from "@/features/support-network/types";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Save, User, Phone, MessageCircle, Users, ShieldCheck, Globe } from "lucide-react";
import { useState } from "react";
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
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("55"); // Brasil como padrão

  const formatInternationalPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    
    if (numbers.startsWith(countryCode)) {
      const localNumber = numbers.substring(countryCode.length);
      if (localNumber.length <= 11) {
        return `(+${countryCode}) ${localNumber.replace(/(\d{2})(\d{5})(\d{4})/, "$1 $2-$3")}`;
      }
    } 
    else if (numbers.length <= 11) {
      return `(+${countryCode}) ${numbers.replace(/(\d{2})(\d{5})(\d{4})/, "$1 $2-$3")}`;
    }
    
    return value;
  };

  const handlePrefillTwilioData = () => {
    onNewContactChange({
      ...newContact,
      twilioAccountSid: "ACa442b3fbd9216a4ba74662505c414e2b",
      twilioAuthToken: "a9cfb35d626f6eb0ac331d2740aa211f",
      twilioWhatsappNumber: "+18312176749"
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
          
          <div className="space-y-2">
            <label className="text-sm text-gray-600">Telefone (formato internacional)</label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-shrink-0 w-24">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="55"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, ""))}
                  className="pl-10"
                  maxLength={3}
                />
              </div>
              <div className="relative flex-grow">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="11 99999-9999"
                  value={newContact.phone.replace(/^\(\+\d+\)\s/, "")}
                  onChange={(e) => {
                    const formattedPhone = formatInternationalPhone(e.target.value);
                    onNewContactChange({
                      ...newContact,
                      phone: formattedPhone,
                    });
                  }}
                  className="pl-10"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Formato: (+55) 92 85231-265
            </p>
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

        <Separator className="my-2" />

        <Collapsible
          open={isWhatsappOpen}
          onOpenChange={setIsWhatsappOpen}
          className="w-full border rounded-md overflow-hidden"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center">
              <ShieldCheck className="h-4 w-4 text-safelady mr-2" />
              <span>Configuração do WhatsApp (Twilio)</span>
            </div>
            {isWhatsappOpen ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 p-4 bg-gray-50/50">
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handlePrefillTwilioData}
                className="text-xs bg-safelady-light text-safelady hover:bg-safelady hover:text-white transition-colors"
              >
                Preencher dados Twilio
              </Button>
            </div>
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
                Exemplo: ACa442b3fbd9216a4ba74662505c414e2b
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
                Exemplo: a9cfb35d626f6eb0ac331d2740aa211f
              </p>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Twilio WhatsApp Number
              </label>
              <Input
                placeholder="+1xxxxxxxxxx"
                value={newContact.twilioWhatsappNumber}
                onChange={(e) =>
                  onNewContactChange({
                    ...newContact,
                    twilioWhatsappNumber: e.target.value,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-1">
                Exemplo: +18312176749 (informe apenas o número, o prefixo "whatsapp:" será adicionado automaticamente)
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

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
