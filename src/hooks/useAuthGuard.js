import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';

export function useAuthGuard() {
  const navigate = useNavigate();
  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/login');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) navigate('/login');
    });
    return () => listener.subscription.unsubscribe();
  }, [navigate]);
}

export function useRedirectIfAuthenticated() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/admin');
    });
  }, [navigate]);
}
