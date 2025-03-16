
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Diary from "@/pages/Diary";
import SafeContact from "@/pages/SafeContact";
import SupportNetwork from "@/pages/SupportNetwork";
import { LoadingScreen } from "./components/LoadingScreen";
import Help from "@/pages/Help";
import FinancialManagement from "@/pages/FinancialManagement";
import { useEffect } from "react";
import { checkUsersInSupabase, supabase } from "@/integrations/supabase/client";
import "./App.css";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  useEffect(() => {
    // Verificar se há usuários no banco ao iniciar o app
    const checkUsers = async () => {
      console.log("Verificando usuários no Supabase...");
      
      try {
        // Test direct connection to Supabase
        const { data: connectionTest, error: connectionError } = await supabase.from('users').select('count').single();
        
        if (connectionError) {
          console.error('Erro na conexão básica com Supabase:', connectionError);
        } else {
          console.log('Conexão básica com Supabase funcionando:', connectionTest);
        }
        
        // Now check users with our function
        const result = await checkUsersInSupabase();
        if (result.success) {
          console.log(`Foram encontrados ${result.data.length} usuários no banco:`, result.data);
        } else {
          console.error('Erro ao verificar usuários:', result.error);
        }
      } catch (error) {
        console.error('Erro inesperado ao verificar usuários:', error);
      }
    };
    
    checkUsers();
  }, []);

  return (
    <Router>
      <div className="bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<LoadingScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Index />
              </PrivateRoute>
            }
          />
          <Route
            path="/diary"
            element={
              <PrivateRoute>
                <Diary />
              </PrivateRoute>
            }
          />
          <Route
            path="/safe-contact"
            element={
              <PrivateRoute>
                <SafeContact />
              </PrivateRoute>
            }
          />
          <Route
            path="/support-network"
            element={
              <PrivateRoute>
                <SupportNetwork />
              </PrivateRoute>
            }
          />
          <Route
            path="/financial-management"
            element={
              <PrivateRoute>
                <FinancialManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/help"
            element={
              <PrivateRoute>
                <Help />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
