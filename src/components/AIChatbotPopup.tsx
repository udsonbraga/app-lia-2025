
import { useState, useEffect } from "react";
import { X, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";

// Base de conhecimento para respostas da IA
const knowledgeBase = [
  {
    keywords: ["olá", "oi", "ei", "hey", "hi", "hello", "bemvinda", "bem-vinda", "boas vindas"],
    response: "Olá! Seja bem-vinda ao Safe Lady. Estou aqui para ajudar você com informações e suporte. Como posso auxiliar hoje?"
  },
  {
    keywords: ["ajuda", "socorro", "emergência", "denunciar", "perigo", "violência"],
    response: "Se você está em uma situação de emergência, use o botão de Emergência na tela inicial para enviar alertas aos seus contatos de confiança. Em caso de perigo imediato, ligue para 190 (Polícia) ou 180 (Central de Atendimento à Mulher)."
  },
  {
    keywords: ["configurar", "adicionar", "contato", "contatos", "seguro"],
    response: "Para adicionar contatos seguros, acesse a seção 'Contato Seguro' no menu principal. Lá você poderá cadastrar pessoas de confiança que receberão alertas em caso de emergência."
  },
  {
    keywords: ["diário", "seguro", "registrar", "registro", "anotar"],
    response: "O Diário Seguro permite que você registre situações e eventos de forma segura e criptografada. Acesse através do menu principal na opção 'Diário Seguro'."
  },
  {
    keywords: ["esconder", "disfarçar", "app", "aplicativo", "disfarce"],
    response: "O Safe Lady possui um modo disfarce que pode ser ativado nas configurações. Isso altera a aparência do aplicativo para parecer um app comum, mantendo suas funcionalidades acessíveis de forma discreta."
  },
  {
    keywords: ["financeiro", "dinheiro", "gestão", "financeira", "independência"],
    response: "A gestão financeira é uma parte importante da independência. Acesse 'Gestão Financeira' no menu para registrar e acompanhar suas finanças pessoais."
  },
  {
    keywords: ["rede", "apoio", "instituições", "ajuda", "locais", "próximos"],
    response: "Na seção 'Rede de Apoio' você encontra informações sobre instituições, ONGs e serviços públicos que podem te ajudar. Acesse pelo menu principal."
  },
  {
    keywords: ["lei", "legal", "legislação", "medida", "protetiva", "maria da penha"],
    response: "A Lei Maria da Penha (Lei 11.340/2006) é um importante marco legal de proteção às mulheres contra violência doméstica e familiar. Ela prevê medidas protetivas de urgência e punições para agressores. Para mais informações, acesse a seção 'Rede de Apoio'."
  },
  {
    keywords: ["direitos", "direito", "assistência", "jurídica", "advogado", "defensoria"],
    response: "Você tem direito à assistência jurídica gratuita através da Defensoria Pública. Em casos de violência doméstica, também pode procurar os Juizados de Violência Doméstica e Familiar contra a Mulher ou a Delegacia da Mulher mais próxima."
  },
  {
    keywords: ["denúncia", "denunciar", "disque", "canal"],
    response: "Para fazer denúncias, você pode utilizar os seguintes canais: Disque 180 (Central de Atendimento à Mulher), Disque 190 (Polícia Militar), ou procurar a Delegacia da Mulher mais próxima."
  }
];

export function AIChatbotPopup() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    // Show welcome message after a short delay when component mounts
    if (!hasShownWelcome) {
      const timer = setTimeout(() => {
        const userName = localStorage.getItem('userName') || 'Usuária';
        setOpen(true);
        setMessages([{
          text: `Olá, ${userName}! Sou a assistente do Safe Lady. Posso ajudar com informações sobre seus direitos, medidas de segurança e outras dúvidas. Como posso ajudar hoje?`,
          isUser: false
        }]);
        setHasShownWelcome(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [hasShownWelcome]);

  const findResponse = (query: string) => {
    const queryLower = query.toLowerCase();
    
    // Buscar resposta no conhecimento base
    for (const item of knowledgeBase) {
      if (item.keywords.some(keyword => queryLower.includes(keyword))) {
        return item.response;
      }
    }
    
    // Resposta padrão
    return "Não tenho informações específicas sobre isso. Posso ajudar com informações sobre emergências, contatos seguros, diário seguro, rede de apoio, legislação e direitos. Tem algo específico que gostaria de saber?";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, {text: inputMessage, isUser: true}]);
    setInputMessage("");
    
    // Simular digitação da IA
    setIsTyping(true);
    
    // Temporizar para simular processamento
    setTimeout(() => {
      const response = findResponse(inputMessage);
      setMessages(prev => [...prev, {text: response, isUser: false}]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-16 right-4 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Toggle 
            pressed={open} 
            className={`w-12 h-12 rounded-full shadow-md ${open ? 'bg-safelady text-white' : 'bg-white text-safelady'}`}
          >
            <Bot className="h-5 w-5" />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 max-h-96 overflow-hidden flex flex-col" sideOffset={5}>
          {/* Header */}
          <div className="bg-safelady text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-semibold">Assistente Safe Lady</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-white hover:bg-safelady-dark rounded-full p-1" 
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-64">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[80%] rounded-lg p-2 text-sm
                  ${msg.isUser 
                    ? 'bg-safelady text-white' 
                    : 'bg-gray-100 text-gray-800'
                  }
                `}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t p-3 flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="min-h-[40px] resize-none text-sm"
              rows={1}
            />
            <Button 
              onClick={handleSendMessage} 
              className="h-10 bg-safelady hover:bg-safelady-dark"
              disabled={inputMessage.trim() === ''}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
