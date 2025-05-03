
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useDisguiseMode = () => {
  const [isDisguiseActive, setIsDisguiseActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if disguise mode was active when page was closed/refreshed
    const savedMode = localStorage.getItem('disguiseMode');
    if (savedMode === 'active') {
      setIsDisguiseActive(true);
      navigate('/disguise');
    }
  }, [navigate]);

  const toggleDisguiseMode = () => {
    const newMode = !isDisguiseActive;
    setIsDisguiseActive(newMode);
    
    if (newMode) {
      localStorage.setItem('disguiseMode', 'active');
      navigate('/disguise');
    } else {
      localStorage.setItem('disguiseMode', 'inactive');
      navigate('/home');
    }
  };

  const exitDisguiseMode = () => {
    setIsDisguiseActive(false);
    localStorage.setItem('disguiseMode', 'inactive');
    navigate('/home');
  };

  return { isDisguiseActive, toggleDisguiseMode, exitDisguiseMode };
};
