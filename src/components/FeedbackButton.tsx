import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { sendFeedbackMessage } from "@/utils/telegramUtils";

// Telegram support bot token and ID
const SUPPORT_BOT_TOKEN = "7668166969:AAFnukkbhjDnUgGTC5em6vYk1Ch7bXy-rBQ";
const SUPPORT_BOT_ID = "suport@safelady_bot"; // This will be used for display, not for sending

export function FeedbackButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Feedback vazio",
        description: "Por favor, escreva seu feedback antes de enviar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Salvar no localStorage para posterior implementação com banco de dados
      const feedbacksJson = localStorage.getItem("userFeedbacks");
      const feedbacks = feedbacksJson ? JSON.parse(feedbacksJson) : [];
      
      feedbacks.push({
        id: Date.now(),
        message: feedback,
        date: new Date().toISOString(),
      });
      
      localStorage.setItem("userFeedbacks", JSON.stringify(feedbacks));
      
      // Enviar o feedback para o bot de suporte usando a nova função utilitária
      await sendFeedbackMessage(feedback);
      
      toast({
        title: "Feedback enviado",
        description: "Obrigado por nos ajudar a melhorar o Safe Lady!",
      });
      
      // Limpar e fechar
      setFeedback("");
      setShowDialog(false);
    } catch (error) {
      console.error("Erro ao enviar feedback:", error);
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
      <button
        onClick={() => setShowDialog(true)}
        className="px-4 py-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all flex items-center w-full"
      >
        <div className="flex items-center gap-3 mx-auto">
          <MessageSquare className="h-6 w-6 text-safelady" />
          <span className="font-medium text-gray-800 text-center">Enviar Feedback</span>
        </div>
      </button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Seu Feedback é Importante</DialogTitle>
            <DialogDescription className="text-center">
              Conte-nos como podemos melhorar o aplicativo Safe Lady.
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Sugestões, críticas ou ideias para novas funcionalidades..."
              className="min-h-[120px] border-[#FF84C6] focus:ring-[#FF84C6]"
            />
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
              className="border-[#FF84C6] text-[#FF84C6] hover:bg-pink-50 transition-colors duration-200"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
              className="bg-[#FF84C6] hover:bg-[#FF6CB7] transition-colors duration-200"
            >
              {isSubmitting ? "Enviando..." : "Enviar Feedback"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
