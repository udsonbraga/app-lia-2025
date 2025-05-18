
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PrivacyPolicy = () => {
  const router = useRouter();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  
  const handleAccept = () => {
    if (acceptedTerms) {
      setShowConfirmationDialog(true);
    }
  };
  
  const handleConfirmation = () => {
    setShowConfirmationDialog(false);
    router.push('/login');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Voltar
        </Button>
        
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-center mb-6">Política de Privacidade</h1>
          
          <div className="prose prose-pink max-w-none">
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Informações que coletamos</h2>
            <p className="mb-4">
              Nós coletamos informações pessoais que você nos fornece diretamente, como nome, endereço de e-mail, número de telefone e outras informações que você escolhe compartilhar conosco quando usa nosso aplicativo SafeLady.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Como usamos suas informações</h2>
            <p className="mb-4">
              Utilizamos suas informações para fornecer, manter e melhorar nossos serviços, incluindo:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Criar e gerenciar sua conta</li>
              <li>Processar suas solicitações e transações</li>
              <li>Personalizar sua experiência</li>
              <li>Comunicar-nos com você sobre atualizações e novos recursos</li>
              <li>Proteger a segurança e integridade do aplicativo</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Compartilhamento de informações</h2>
            <p className="mb-4">
              Não vendemos suas informações pessoais para terceiros. Podemos compartilhar suas informações com:
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li>Prestadores de serviço que nos ajudam a operar nosso aplicativo</li>
              <li>Autoridades quando exigido por lei ou para proteger nossos direitos</li>
              <li>Seus contatos de emergência (apenas quando você ativar recursos de segurança)</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Segurança de dados</h2>
            <p className="mb-4">
              Implementamos medidas técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, perda ou alteração. No entanto, nenhum sistema é completamente seguro, e não podemos garantir a segurança absoluta de suas informações.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Seus direitos</h2>
            <p className="mb-4">
              Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Também pode solicitar a limitação do processamento de suas informações ou opor-se a determinados usos.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Alterações nesta política</h2>
            <p className="mb-4">
              Podemos atualizar esta política periodicamente para refletir mudanças em nossas práticas ou por outros motivos operacionais, legais ou regulatórios. Notificaremos você sobre alterações significativas.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Contato</h2>
            <p className="mb-4">
              Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre como tratamos suas informações, entre em contato conosco pelo e-mail: contato@safelady.com
            </p>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center space-x-2 mb-6">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                className="border-gray-400"
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Li e concordo com a Política de Privacidade
              </label>
            </div>
            
            <Button 
              onClick={handleAccept}
              className={`w-full bg-[#FF84C6] hover:bg-[#FF5AA9] text-white ${!acceptedTerms ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={!acceptedTerms}
            >
              Confirmar Leitura e Voltar
            </Button>
          </div>
        </div>
      </div>
      
      <Dialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-[#FF84C6]">Termos Aceitos</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="rounded-full bg-green-100 p-3 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-500" />
                </div>
                <p className="text-center mb-4">
                  Obrigado por aceitar nossa Política de Privacidade. Você será redirecionado para a página de login.
                </p>
                <Button 
                  onClick={handleConfirmation}
                  className="bg-[#FF84C6] hover:bg-[#FF5AA9] text-white w-full"
                >
                  Continuar
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrivacyPolicy;
