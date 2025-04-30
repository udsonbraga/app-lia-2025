
import React, { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Base de conhecimento para respostas da IA
const knowledgeBase = [
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
    keywords: ["backup", "dados", "recuperar", "perder", "informações"],
    response: "Seus dados são armazenados de forma segura e sincronizados com sua conta. Se precisar recuperar informações, faça login em sua conta em qualquer dispositivo."
  },
  {
    keywords: ["como", "usar", "funciona", "tutorial", "explicar"],
    response: "O Safe Lady oferece várias funcionalidades para sua segurança: botão de emergência, contatos seguros, diário seguro, rede de apoio e gestão financeira. Cada recurso pode ser acessado pelo menu principal."
  },
  {
    keywords: ["direitos", "lei", "legal", "maria da penha", "medida", "protetiva"],
    response: "Você pode encontrar informações sobre seus direitos legais, Lei Maria da Penha e medidas protetivas na seção 'Rede de Apoio', na aba 'Direitos'."
  }
];

// Componente principal da LadyAI
export function LadyAI() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    {text: "Olá! Eu sou a LadyIA, assistente virtual do Safe Lady. Como posso ajudar você hoje?", isUser: false}
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findResponse = (query: string) => {
    const queryLower = query.toLowerCase();
    
    // Verificar palavras de emergência
    const isEmergency = ['socorro', 'ajuda', 'emergência', 'polícia', 'help'].some(
      keyword => queryLower.includes(keyword)
    );
    
    if (isEmergency) {
      toast({
        title: "Alerta de Emergência",
        description: "Detectamos palavras de emergência. Deseja ir para a tela de emergência?",
        variant: "destructive",
        action: (
          <Button 
            variant="outline" 
            onClick={() => navigate("/home")}
            className="bg-white text-red-500 hover:bg-red-50"
          >
            Ir para Emergência
          </Button>
        ),
      });
    }
    
    // Buscar resposta no conhecimento base
    for (const item of knowledgeBase) {
      if (item.keywords.some(keyword => queryLower.includes(keyword))) {
        return item.response;
      }
    }
    
    // Resposta padrão
    return "Desculpe, não tenho informações específicas sobre isso. Posso ajudar com informações sobre emergências, contatos seguros, diário seguro, rede de apoio e gestão financeira. Como posso ajudar?";
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold">LadyIA - Assistente</h1>
            <div className="w-8" />
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-auto pt-20 pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-4 ${msg.isUser ? 'flex justify-end' : 'flex justify-start'}`}
            >
              <div 
                className={`rounded-lg py-2 px-4 max-w-[80%] ${
                  msg.isUser 
                    ? 'bg-[#FF84C6] text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 text-gray-800 rounded-lg py-2 px-4">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:200ms]" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:400ms]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Digite sua pergunta aqui..."
            className="min-h-[50px] resize-none"
          />
          <Button 
            onClick={handleSendMessage} 
            className="h-auto bg-[#FF84C6] hover:bg-[#FF5AA9] transition-colors"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
