import { useNavigate } from "react-router-dom";
import { ArrowLeft, Info, Shield, Users, Book } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Help = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-safelady-light to-white">
      <div className="fixed top-0 left-0 right-0 h-14 bg-white shadow-sm z-50">
        <div className="container mx-auto h-full">
          <div className="flex items-center justify-between h-full px-4">
            <button
              onClick={() => navigate('/home')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <h1 className="text-xl font-semibold">Ajuda</h1>
            <div className="w-8" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-20 pb-20">
        <div className="max-w-3xl mx-auto">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="about" className="flex gap-2 items-center">
                <Users className="h-4 w-4" />
                Quem Somos
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex gap-2 items-center">
                <Shield className="h-4 w-4" />
                Política de Privacidade
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Book className="h-8 w-8 text-safelady" />
                <h2 className="text-xl font-bold text-gray-900">Quem Somos</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  O <strong>Safe Lady</strong> é uma iniciativa criada com um propósito claro: oferecer ferramentas de proteção e segurança para mulheres em situação de vulnerabilidade ou risco.
                </p>
                
                <p>
                  Fundado em 2025 pelos estudantes Udson Braga de Miranda e Marco Duarte do curso técnico de Desenvolvimento de Software na Fundação Desembargador Paulo Feitosa FPF Tech, nosso aplicativo combina tecnologia e conscientização para criar uma rede de apoio eficiente.
                </p>
                
                <p>
                  Nossa missão é proporcionar um conjunto de ferramentas digitais que possam:
                </p>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li>Facilitar o pedido de ajuda em situações de emergência</li>
                  <li>Documentar ocorrências de forma segura e discreta</li>
                  <li>Conectar mulheres a redes de apoio e órgãos oficiais</li>
                  <li>Disponibilizar informações sobre direitos e recursos disponíveis</li>
                  <li>Oferecer um espaço seguro para registro de experiências</li>
                </ul>
                
                <p>
                  Acreditamos que a tecnologia, quando bem aplicada, pode ser uma aliada poderosa na proteção de vidas. O Safe Lady foi desenvolvido com base em pesquisas sobre as necessidades reais de mulheres em situação de vulnerabilidade, contando com a colaboração de especialistas em segurança, psicologia e direito.
                </p>
                
                <p>
                  Trabalhamos continuamente para melhorar nossas funcionalidades, mantendo sempre o foco na facilidade de uso, discrição e eficácia das ferramentas oferecidas.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-safelady" />
                <h2 className="text-xl font-bold text-gray-900">Política de Privacidade</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  <strong>Última atualização:</strong> Fevereiro de 2025
                </p>
                
                <p>
                  O Safe Lady tem como prioridade máxima a proteção dos seus dados e da sua privacidade. Compreendemos a sensibilidade das informações compartilhadas em nosso aplicativo e assumimos o compromisso de protegê-las com os mais altos padrões de segurança digital.
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Informações que coletamos</h3>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Dados de cadastro:</strong> Nome, e-mail e telefone para criação da sua conta.</li>
                  <li><strong>Contatos de emergência:</strong> Informações dos contatos que você cadastrar para receber alertas.</li>
                  <li><strong>Registros do diário:</strong> Textos, datas e anexos que você incluir no seu diário seguro.</li>
                  <li><strong>Dados de localização:</strong> Utilizados apenas para envio de alertas de emergência, quando autorizados.</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Como usamos seus dados</h3>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li>Para enviar alertas de emergência aos contatos cadastrados.</li>
                  <li>Para armazenar seus registros pessoais no diário de forma segura.</li>
                  <li>Para permitir que você acesse seus dados em diferentes dispositivos.</li>
                  <li>Para melhorar a experiência e funcionalidades do aplicativo.</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Segurança dos dados</h3>
                
                <p>
                  Todos os dados são criptografados utilizando protocolos avançados de segurança. Ninguém, nem mesmo nossa equipe, pode acessar o conteúdo dos seus registros sem sua autorização.
                </p>
                
                <p>
                  O modo disfarce do aplicativo adiciona uma camada extra de proteção, permitindo que você utilize o Safe Lady de forma discreta e segura.
                </p>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Compartilhamento de informações</h3>
                
                <p>
                  Não compartilhamos seus dados com terceiros, exceto:
                </p>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li>Com os contatos de emergência cadastrados, apenas em caso de acionamento do alerta.</li>
                  <li>Por determinação legal, mediante ordem judicial.</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-2">Seus direitos</h3>
                
                <p>
                  Você tem direito a:
                </p>
                
                <ul className="list-disc pl-5 space-y-2">
                  <li>Acessar todos os seus dados armazenados.</li>
                  <li>Solicitar a exclusão da sua conta e de todos os dados associados.</li>
                  <li>Exportar seus registros em formato PDF.</li>
                  <li>Atualizar ou corrigir suas informações pessoais.</li>
                </ul>
                
                <p className="mt-6">
                  Para mais informações ou dúvidas sobre nossa política de privacidade, entre em contato conosco pelo email: privacidade@safelady.com
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Help;
