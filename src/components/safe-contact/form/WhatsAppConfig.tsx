
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WhatsAppConfigProps {
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioWhatsappNumber?: string;
  onUpdate: (data: {
    twilioAccountSid?: string;
    twilioAuthToken?: string;
    twilioWhatsappNumber?: string;
  }) => void;
}

const WhatsAppConfig = ({
  twilioAccountSid = "",
  twilioAuthToken = "",
  twilioWhatsappNumber = "",
  onUpdate,
}: WhatsAppConfigProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handlePrefillTwilioData = () => {
    onUpdate({
      twilioAccountSid: "ACa442b3fbd9216a4ba74662505c414e2b",
      twilioAuthToken: "a9cfb35d626f6eb0ac331d2740aa211f",
      twilioWhatsappNumber: "+18312176749"
    });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full border rounded-md overflow-hidden"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex items-center">
          <ShieldCheck className="h-4 w-4 text-safelady mr-2" />
          <span>Configuração do WhatsApp (Twilio)</span>
        </div>
        {isOpen ? (
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
            value={twilioAccountSid}
            onChange={(e) => onUpdate({ twilioAccountSid: e.target.value })}
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
            value={twilioAuthToken}
            onChange={(e) => onUpdate({ twilioAuthToken: e.target.value })}
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
            value={twilioWhatsappNumber}
            onChange={(e) => onUpdate({ twilioWhatsappNumber: e.target.value })}
          />
          <p className="text-xs text-gray-500 mt-1">
            Exemplo: +18312176749 (informe apenas o número, o prefixo "whatsapp:" será adicionado automaticamente)
          </p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default WhatsAppConfig;
