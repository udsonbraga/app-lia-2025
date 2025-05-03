
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Página Inicial</h1>
        <p>Bem-vindo ao SafeLady. Use a navegação para acessar os diferentes recursos do app.</p>
      </main>
    </div>
  );
};

export default Home;
