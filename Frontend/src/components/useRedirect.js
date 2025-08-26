// useRedirect.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const useRedirect = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else if (role) {
      navigate('/user/dashboard');
    }
  }, [role, navigate]);
};