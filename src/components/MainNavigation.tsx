
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, BookOpen, Phone, MessageSquare, Bot, AlertTriangle } from "lucide-react";
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
      icon: <Users className="h-6 w-6" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      route: "/support-network"
    },
    {
      id: "diary",
      title: "Diário Seguro",
      description: "Registre seus pensamentos com privacidade",
      icon: <BookOpen className="h-6 w-6" />,
      color: "bg-gradient-to-r from-blue-400 to-cyan-400",
      route: "/diary"
    },
    {
      id: "safe-contact",
      title: "Contato Seguro",
      description: "Mantenha contatos importantes acessíveis",
      icon: <Phone className="h-6 w-6" />,
      color: "bg-gradient-to-r from-green-400 to-teal-400",
      route: "/safe-contact"
    },
    {
      id: "lady-ai",
      title: "LadyIA Assistente",
      description: "Sua assistente virtual para informações e ajuda",
      icon: <Bot className="h-6 w-6" />,
      color: "bg-gradient-to-r from-amber-400 to-orange-400",
      route: "/lady-ai"
    },
    {
      id: "feedback",
      title: "Feedback",
      description: "Ajude-nos a melhorar nosso app",
      icon: <MessageSquare className="h-6 w-6" />,
      color: "bg-gradient-to-r from-rose-400 to-red-400",
      route: null
    }
  ];

  return (
    <div className="flex flex-col space-y-4">
      {navigationButtons.map((button) => (
        <Card
          key={button.id}
          className={`relative overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 ease-in-out
            ${hoveredButton === button.id ? "scale-[1.02]" : ""}
            rounded-full h-16 sm:h-18`}
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
          {/* Animated gradient background */}
          <div className={`absolute inset-0 ${button.color} opacity-90`}></div>
          
          {/* Button content with improved layout */}
          <div className="relative z-10 p-4 h-full flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon with circular background */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm text-white">
                {button.icon}
              </div>
              
              {/* Text content */}
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">{button.title}</h3>
                <p className="text-white/80 text-xs hidden md:block">{button.description}</p>
              </div>
            </div>
            
            {/* Alert icon on the right side */}
            <div className={`flex items-center justify-center w-8 h-8 mr-2 rounded-full ${
              hoveredButton === button.id ? "bg-white/20 backdrop-blur-sm" : "bg-transparent"
            } transition-all duration-300`}>
              <AlertTriangle className={`h-4 w-4 text-white transition-opacity duration-300 ${
                hoveredButton === button.id ? "opacity-100" : "opacity-0"
              }`} />
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
              className="bg-[#FF84C6] hover:bg-[#FF5AA9]"
            >
              {feedbackSubmitting ? "Enviando..." : "Enviar feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
