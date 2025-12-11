import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(email, password);
      if (success) {
        navigate('/gallery');
      } else {
        setError('Email yoki parol noto\'g\'ri!');
      }
    } else {
      if (!username || !email || !password) {
        setError('Barcha maydonlarni to\'ldiring!');
        return;
      }
      const success = register(username, email, password);
      if (success) {
        navigate('/gallery');
      } else {
        setError('Bu email allaqachon ro\'yxatdan o\'tgan.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-zinc-950 p-8 rounded-2xl border border-white/10 shadow-2xl animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-mc-green/10 rounded-full flex items-center justify-center text-mc-green mx-auto mb-4">
            {isLogin ? <LogIn size={32} /> : <UserPlus size={32} />}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Xush Kelibsiz' : 'Ro\'yxatdan O\'tish'}
          </h2>
          <p className="text-gray-400">
            {isLogin 
              ? 'MinePrev hisobingizga kiring' 
              : 'Yangi hisob yarating va sharh qoldiring'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm text-gray-400 mb-2">Foydalanuvchi nomi</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mc-green transition-colors"
                placeholder="Minecraft nickingiz"
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mc-green transition-colors"
              placeholder="example@mail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Parol</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mc-green transition-colors"
              placeholder="********"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-mc-green hover:bg-mc-greenDark text-black font-bold py-3 rounded-lg transition-colors mt-6"
          >
            {isLogin ? 'Kirish' : 'Ro\'yxatdan O\'tish'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setPassword('');
            }}
            className="text-sm text-gray-400 hover:text-mc-green transition-colors"
          >
            {isLogin 
              ? "Hisobingiz yo'qmi? Ro'yxatdan o'ting" 
              : "Allaqachon hisobingiz bormi? Kiring"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;