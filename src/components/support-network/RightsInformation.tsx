
const RightsInformation = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Seus Direitos</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-800">Lei Maria da Penha</h3>
          <p className="text-sm text-gray-600 mt-1">
            A Lei Maria da Penha (Lei nº 11.340/2006) cria mecanismos para prevenir e coibir a violência doméstica e familiar contra a mulher.
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800">Tipos de Violência</h3>
          <ul className="text-sm text-gray-600 mt-1 list-disc pl-5 space-y-1">
            <li>Violência física</li>
            <li>Violência psicológica</li>
            <li>Violência sexual</li>
            <li>Violência patrimonial</li>
            <li>Violência moral</li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800">Como Buscar Ajuda</h3>
          <p className="text-sm text-gray-600 mt-1">
            Ligue para o 180 - Central de Atendimento à Mulher, um serviço gratuito e confidencial.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Procure uma delegacia da mulher mais próxima ou, em caso de emergência, ligue para o 190.
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-800">Medidas Protetivas</h3>
          <p className="text-sm text-gray-600 mt-1">
            Você tem direito a solicitar medidas protetivas de urgência, como o afastamento do agressor do lar e proibição de aproximação.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RightsInformation;
