
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Phone, MessageSquare, Bot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export function MainNavigation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("sugestão");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleSubmitFeedback = async () => {
    if (!feedbackContent.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, digite seu feedback antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    setFeedbackSubmitting(true);
    
    try {
      // Simulate sending feedback
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would save this feedback to a database
      console.log("Feedback submitted:", {
        type: feedbackType,
        content: feedbackContent,
        date: new Date().toISOString(),
        user: localStorage.getItem('userName') || 'Anônimo'
      });
      
      toast({
        title: "Feedback enviado",
        description: "Agradecemos seu feedback! Sua opinião é muito importante para nós.",
      });
      
      setFeedbackContent("");
      setFeedbackOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu feedback. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  // Define navigation buttons with their properties
  const navigationButtons = [
    {
      id: "support-network",
      title: "Rede de Apoio",
      description: "Encontre apoio e recursos para ajudá-la",
      icon: <Users className="h-5 w-5" />,
      route: "/support-network"
    },
    {
      id: "diary",
      title: "Diário Seguro",
      description: "Registre seus pensamentos com privacidade",
      icon: <BookOpen className="h-5 w-5" />,
      route: "/diary"
    },
    {
      id: "safe-contact",
      title: "Contato Seguro",
      description: "Mantenha contatos importantes acessíveis",
      icon: <Phone className="h-5 w-5" />,
      route: "/safe-contact"
    },
    {
      id: "lady-ai",
      title: "LadyIA Assistente",
      description: "Sua assistente virtual para informações e ajuda",
      icon: <Bot className="h-5 w-5" />,
      route: "/lady-ai"
    },
    {
      id: "feedback",
      title: "Feedback",
      description: "Ajude-nos a melhorar nosso app",
      icon: <MessageSquare className="h-5 w-5" />,
      route: null
    }
  ];

  return (
    <div className="flex flex-col space-y-3">
      {navigationButtons.map((button) => (
        <Card
          key={button.id}
          className={`relative overflow-hidden transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg ${
            hoveredButton === button.id ? "scale-[1.02]" : ""
          }`}
          onMouseEnter={() => setHoveredButton(button.id)}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={() => {
            if (button.id === "feedback") {
              setFeedbackOpen(true);
            } else if (button.route) {
              navigate(button.route);
            }
          }}
        >
          {/* Monochromatic background */}
          <div className="absolute inset-0 bg-safelady opacity-5"></div>
          
          {/* Button content with reduced padding */}
          <div className="relative z-10 p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon with circular background */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-safelady text-white">
                {button.icon}
              </div>
              
              {/* Text content */}
              <div className="text-left">
                <h3 className="font-bold text-gray-800 text-base">{button.title}</h3>
                <p className="text-gray-600 text-xs">{button.description}</p>
              </div>
            </div>
            
            {/* Arrow icon that appears on hover */}
            <div className={`transition-all duration-300 ${
              hoveredButton === button.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            }`}>
              <ArrowRight className="h-4 w-4 text-safelady" />
            </div>
          </div>
        </Card>
      ))}

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Envie seu feedback</DialogTitle>
            <DialogDescription>
              Sua opinião é muito importante para melhorarmos o Safe Lady
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="feedback-type" className="text-right">
                Tipo
              </Label>
              <select
                id="feedback-type"
                value={feedbackType}
                onChange={(e) => setFeedbackType(e.target.value)}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="sugestão">Sugestão</option>
                <option value="crítica">Crítica</option>
                <option value="elogio">Elogio</option>
                <option value="bug">Reportar problema</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="feedback-content" className="text-right">
                Mensagem
              </Label>
              <Textarea
                id="feedback-content"
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                placeholder="Digite aqui sua mensagem..."
                className="col-span-3 resize-none"
                rows={4}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setFeedbackOpen(false)}
              disabled={feedbackSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitFeedback}
              disabled={feedbackSubmitting}
              className="bg-safelady hover:bg-safelady-dark"
            >
              {feedbackSubmitting ? "Enviando..." : "Enviar feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
