
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import LoginInput from './LoginInput';
import LoginButton from './LoginButton';
import LoginCheckbox from './LoginCheckbox';
import LoginFooter from './LoginFooter';
import { Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user || null);
      if (data?.session?.user) navigate('/admin');
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) navigate('/admin');
    });
    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 px-8 py-10 flex flex-col items-center">
          {/* Branding */}
          <div className="mb-6 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-tr from-blue-600 to-purple-500 mb-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M4 7.5A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v9A3.5 3.5 0 0 1 16.5 20h-9A3.5 3.5 0 0 1 4 16.5v-9Z" stroke="#fff" strokeWidth="2"/><path d="M8 12h8M8 16h5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900" style={{ fontFamily: 'Inter, Montserrat, sans-serif' }}>NewsAdmin</span>
          </div>
          {/* Título y subtítulo */}
          <h2 className="text-2xl font-semibold text-slate-900 mb-1 w-full text-left">¡Bienvenido de nuevo!</h2>
          <p className="text-slate-500 mb-6 w-full text-left">Ingresa tus credenciales para continuar</p>
          {/* Formulario */}
          <form className="w-full" onSubmit={handleLogin} autoComplete="on" aria-label="Formulario de inicio de sesión">
            <LoginInput
              type="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Correo Electrónico"
              icon={<Mail className="w-5 h-5 text-slate-400" />}
              autoComplete="email"
              required
            />
            <LoginInput
              type="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Contraseña"
              icon={<Lock className="w-5 h-5 text-slate-400" />}
              autoComplete="current-password"
              required
            />
            {/* Opciones */}
            <div className="flex items-center justify-between mb-6 mt-2">
              <LoginCheckbox
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                label="Recordarme"
                id="remember"
              />
              <a href="#" className="text-blue-600 text-sm hover:underline font-medium focus:outline-none focus:underline">¿Olvidaste tu contraseña?</a>
            </div>
            {error && <div className="text-red-500 mb-4 text-sm" role="alert">{error}</div>}
            <LoginButton type="submit" loading={loading}>
              Ingresar
            </LoginButton>
          </form>
          {/* Footer */}
          <LoginFooter />
        </div>
      </div>
    </div>
  );
}
