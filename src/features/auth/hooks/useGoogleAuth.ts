
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useGoogleAuth = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    
    try {
      // Simulate Google auth since we're using Django backend now
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "Login com Google será implementado em breve.",
        variant: "destructive",
      });
      
      return { data: null, error: new Error("Not implemented") };
    } catch (error) {
      console.error('Google auth error:', error);
      return { data: null, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading
  };
};
