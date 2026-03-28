import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signIn, signUp } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { GraduationCap, LogIn } from 'lucide-react';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'admin' | 'profesor'>('profesor');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const data = await signIn(email, password);
        const userResponse = await fetch(`https://${(await import('/utils/supabase/info')).projectId}.supabase.co/functions/v1/make-server-34a21b05/me`, {
          headers: {
            'Authorization': `Bearer ${data.session.access_token}`,
          },
        });
        const { user } = await userResponse.json();
        setUser({ ...user, access_token: data.session.access_token });
        
        toast.success('¡Bienvenido!');
        
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/scanner');
        }
      } else {
        await signUp(email, password, name, role);
        toast.success('Usuario creado exitosamente. Por favor inicia sesión.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Error al autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#001f3f] to-[#003d7a] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#001f3f] text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-4">
                <GraduationCap className="w-12 h-12 text-[#001f3f]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">QR-School-Admin</h1>
            <p className="text-blue-200">Sistema de Control Escolar</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none"
                    placeholder="Juan Pérez"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rol
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'profesor')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#001f3f] focus:border-transparent outline-none"
                  >
                    <option value="profesor">Profesor/Monitor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#001f3f] text-white py-3 rounded-lg font-semibold hover:bg-[#003366] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#001f3f] hover:underline font-medium"
              >
                {isLogin
                  ? '¿No tienes cuenta? Regístrate'
                  : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-white text-sm">
          <p>Primera vez: Crea una cuenta de Administrador</p>
          <p className="mt-1 text-blue-200">Los profesores pueden ser creados después</p>
        </div>
      </div>
    </div>
  );
}
