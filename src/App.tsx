
import React from 'react';
import './App.css';
import Index from "./pages/Index";
import Home from "./pages/Home";
import Diary from "./pages/Diary";
import SafeContactPage from "./pages/SafeContact";
import SupportNetwork from "./pages/SupportNetwork";
import Customize from "./pages/Customize";
import Help from "./pages/Help";
import Accessibility from "./pages/Accessibility";
import NotFound from "./pages/NotFound";
import DisguiseModePage from "./pages/DisguiseMode"; // Import the DisguiseMode page
import { LoadingScreen } from './components/LoadingScreen';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ResetPasswordPage from './pages/ResetPassword';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  // Ainda carregando, mostra uma tela de carregamento
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  // Não autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Autenticado, mostra o conteúdo protegido
  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  // Define o estado para controlar se o modo de disfarce está ativado
  const [disguiseMode, setDisguiseMode] = useState(false);

  // Função para alternar o modo de disfarce
  const toggleDisguiseMode = () => {
    setDisguiseMode(!disguiseMode);
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Index />} />
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/home" replace /> : <RegisterPage />} />
      <Route path="/reset-password" element={user ? <Navigate to="/home" replace /> : <ResetPasswordPage />} />
      
      {/* Rotas protegidas */}
      <Route path="/home" element={
        <RequireAuth>
          <Home />
        </RequireAuth>
      } />
      <Route path="/diary" element={
        <RequireAuth>
          <Diary />
        </RequireAuth>
      } />
      <Route path="/safe-contact" element={
        <RequireAuth>
          <SafeContactPage />
        </RequireAuth>
      } />
      <Route path="/support-network" element={
        <RequireAuth>
          <SupportNetwork />
        </RequireAuth>
      } />
      <Route path="/customize" element={
        <RequireAuth>
          <Customize />
        </RequireAuth>
      } />
      <Route path="/help" element={
        <RequireAuth>
          <Help />
        </RequireAuth>
      } />
      <Route path="/accessibility" element={
        <RequireAuth>
          <Accessibility />
        </RequireAuth>
      } />
      {/* Adicionar rota de disfarce */}
      <Route path="/disguise" element={
        <RequireAuth>
          <DisguiseModePage />
        </RequireAuth>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
