
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'suggestion' | 'bug' | 'improvement'>('suggestion');
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva seu feedback antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this to a server
      // For now, we'll simulate a server request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Feedback enviado:", {
        type: feedbackType,
        message,
        email,
        date: new Date().toISOString()
      });
      
      toast({
        title: "Feedback enviado",
        description: "Obrigado pelo seu feedback! Sua opinião é muito importante para nós.",
      });
      
      // Reset form and close dialog
      setMessage("");
      setEmail("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu feedback. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white"
        size="sm"
      >
        <MessageSquare className="h-4 w-4" />
        <span>Feedback</span>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Envie seu feedback</DialogTitle>
            <DialogDescription>
              Ajude-nos a melhorar o Safe Lady com suas sugestões, críticas ou relatos de problemas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback-type">Tipo de feedback</Label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={feedbackType === 'suggestion' ? 'default' : 'outline'}
                  onClick={() => setFeedbackType('suggestion')}
                  className={feedbackType === 'suggestion' ? 'bg-neutral-800 text-white' : ''}
                  size="sm"
                >
                  Sugestão
                </Button>
                <Button 
                  type="button" 
                  variant={feedbackType === 'bug' ? 'default' : 'outline'}
                  onClick={() => setFeedbackType('bug')}
                  className={feedbackType === 'bug' ? 'bg-neutral-800 text-white' : ''}
                  size="sm"
                >
                  Problema
                </Button>
                <Button 
                  type="button" 
                  variant={feedbackType === 'improvement' ? 'default' : 'outline'}
                  onClick={() => setFeedbackType('improvement')}
                  className={feedbackType === 'improvement' ? 'bg-neutral-800 text-white' : ''}
                  size="sm"
                >
                  Melhoria
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Sua mensagem</Label>
              <Textarea
                id="message"
                placeholder="Descreva seu feedback, sugestão ou problema..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Para que possamos entrar em contato sobre seu feedback, se necessário.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-neutral-800 hover:bg-neutral-700 text-white"
            >
              {isSubmitting ? "Enviando..." : "Enviar feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
