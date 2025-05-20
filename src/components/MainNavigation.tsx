
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, BookOpen, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function MainNavigation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState("sugestão");
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

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
      // Obter a sessão atual do usuário
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      // Inserir o feedback no banco de dados
      const { error } = await supabase
        .from('user_feedback')
        .insert({
          feedback_type: feedbackType,
          content: feedbackContent,
          user_id: userId || null // Permite feedback anônimo
        });
        
      if (error) {
        console.error("Erro ao salvar feedback:", error);
        throw error;
      }
      
      toast({
        title: "Feedback enviado",
        description: "Agradecemos seu feedback! Sua opinião é muito importante para nós.",
      });
      
      setFeedbackContent("");
      setFeedbackSuccess(true);
      
      // Resetar o estado de sucesso após 3 segundos
      setTimeout(() => {
        setFeedbackOpen(false);
        setFeedbackSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Erro completo:", error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar seu feedback. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setFeedbackSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={() => navigate("/support-network")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
      >
        <div className="flex items-center gap-3 mx-auto">
          <Users className="h-6 w-6 text-[#FF84C6]" />
          <span className="font-medium text-gray-800 text-center">Rede de Apoio</span>
        </div>
      </button>

      <button
        onClick={() => navigate("/diary")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
      >
        <div className="flex items-center gap-3 mx-auto">
          <BookOpen className="h-6 w-6 text-[#FF84C6]" />
          <span className="font-medium text-gray-800 text-center">Diário Seguro</span>
        </div>
      </button>

      <button
        onClick={() => navigate("/safe-contact")}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
      >
        <div className="flex items-center gap-3 mx-auto">
          <Phone className="h-6 w-6 text-[#FF84C6]" />
          <span className="font-medium text-gray-800 text-center">Contato Seguro</span>
        </div>
      </button>

      <button
        onClick={() => setFeedbackOpen(true)}
        className="w-full p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center"
      >
        <div className="flex items-center gap-3 mx-auto">
          <MessageSquare className="h-6 w-6 text-[#FF84C6]" />
          <span className="font-medium text-gray-800 text-center">Feedback</span>
        </div>
      </button>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={(open) => {
        if (!feedbackSuccess) {
          setFeedbackOpen(open);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Envie seu feedback</DialogTitle>
            <DialogDescription>
              Sua opinião é muito importante para melhorarmos o Safe Lady
            </DialogDescription>
          </DialogHeader>
          
          {feedbackSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center">
              <div className="bg-green-100 rounded-full p-3 mb-4">
                <MessageSquare className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-600 mb-2">Registro enviado!</h3>
              <p className="text-center text-gray-600">
                Obrigado por compartilhar sua opinião conosco. Seu feedback nos ajuda a melhorar!
              </p>
            </div>
          ) : (
            <>
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
