
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
import "./App.css";
import { useEffect, useState } from "react";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  const [showLoading, setShowLoading] = useState(false);
  
  useEffect(() => {
    // Check if this is the first time the app is loaded
    const hasSeenLoading = localStorage.getItem('hasSeenLoading');
    if (!hasSeenLoading) {
      setShowLoading(true);
      localStorage.setItem('hasSeenLoading', 'true');
    }
  }, []);

  if (showLoading) {
    return <LoadingScreen onComplete={() => setShowLoading(false)} />;
  }

  return (
    <Router>
      <div className="bg-white min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
