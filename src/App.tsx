
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Accessories from "@/pages/Accessories";
import Clothing from "@/pages/Clothing";
import "./App.css";

const AuthCheck = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();
  
  // Se estiver autenticado e tentando acessar login/register, redireciona para home
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/home" />;
  }
  
  // Se não estiver autenticado e tentando acessar uma rota protegida, redireciona para login
  if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  
  return null;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();
  
  return isAuthenticated ? 
    children : 
    <Navigate to="/login" state={{ from: location }} />;
};

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen">
        <AuthCheck />
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
            path="/help"
            element={
              <PrivateRoute>
                <Help />
              </PrivateRoute>
            }
          />
          <Route
            path="/accessories"
            element={
              <PrivateRoute>
                <Accessories />
              </PrivateRoute>
            }
          />
          <Route
            path="/clothing"
            element={
              <PrivateRoute>
                <Clothing />
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
