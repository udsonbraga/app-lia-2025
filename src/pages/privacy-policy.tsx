
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy: FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Política de Privacidade</h1>
      <div className="prose max-w-none">
        {/* Privacy Policy content */}
        <p>Esta Política de Privacidade descreve como suas informações pessoais são coletadas, usadas e compartilhadas quando você utiliza o SafeLady.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Informações que coletamos</h2>
        <p>Coletamos informações que você nos fornece diretamente, como seu nome, endereço de e-mail, senha e outros dados de perfil.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Como usamos suas informações</h2>
        <p>Usamos suas informações para fornecer, manter e melhorar nossos serviços, bem como para desenvolver novos serviços.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Compartilhamento de informações</h2>
        <p>Não compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta política de privacidade.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Segurança</h2>
        <p>Tomamos medidas para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Alterações nesta política</h2>
        <p>Esta política pode ser atualizada de tempos em tempos. Notificaremos sobre quaisquer alterações publicando a nova política de privacidade nesta página.</p>
        
        <h2 className="text-xl font-semibold mt-6 mb-2">Contato</h2>
        <p>Se você tiver dúvidas sobre esta política de privacidade, entre em contato conosco em contato@safelady.com.</p>
      </div>
      
      <div className="mt-8">
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
