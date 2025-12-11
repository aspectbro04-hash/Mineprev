import React, { useState } from 'react';
import { Menu, X, Box, User as UserIcon, Image, Shield, LogIn, LogOut, MessageCircle, Star, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'BOSH SAHIFA', path: '/', icon: <Box size={18} /> },
    { name: 'THUMBNAIL', path: '/editor', icon: <UserIcon size={18} /> },
    { name: 'GALEREYA', path: '/gallery', icon: <Image size={18} /> },
    { name: 'CHAT', path: '/chat', icon: <MessageCircle size={18} /> },
  ];

  if (user) {
    navLinks.push({ name: 'TANLOV', path: '/contest', icon: <Star size={18} /> });
    navLinks.push({ name: 'LICHKA', path: '/private', icon: <MessageSquare size={18} /> });
  }

  navLinks.push({ name: 'ADMIN', path: '/admin', icon: <Shield size={18} /> });

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b-4 border-black shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-mc-green border-2 border-black shadow-[4px_4px_0_#111] flex items-center justify-center group-hover:translate-y-[-2px] transition-transform">
                <Box className="text-black" size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-pixel tracking-wide text-white drop-shadow-md">MINE<span className="text-mc-green">PREV</span></span>
                <span className="text-[10px] text-gray-400 font-pixel uppercase tracking-widest -mt-1">Thumbnail Tool v2.0</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2 text-lg font-pixel transition-all duration-200 border-2 ${
                    isActive(link.path)
                      ? 'bg-mc-green text-black border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)] translate-y-[-2px]'
                      : 'border-transparent text-gray-300 hover:text-white hover:bg-white/5 hover:border-white/10'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              <div className="h-8 w-[2px] bg-white/10 mx-4"></div>
              
              {user ? (
                <div className="flex items-center gap-4 pl-2">
                  <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3 py-1 rounded">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                     <span className="text-lg text-mc-green font-pixel">@{user.username}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center w-10 h-10 bg-red-500/10 border-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0_#000]"
                    title="Chiqish"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className={`flex items-center gap-2 px-5 py-2 font-pixel text-lg uppercase tracking-wide border-2 transition-all ${
                    isActive('/login')
                      ? 'bg-mc-green text-black border-black shadow-[4px_4px_0_rgba(0,0,0,0.5)]'
                      : 'bg-zinc-800 text-white border-black hover:bg-zinc-700 shadow-[4px_4px_0_#111]'
                  }`}
                >
                  <LogIn size={18} />
                  Kirish
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="-mr-2 flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-3 rounded-none border-2 border-white/20 bg-black/50 text-gray-400 hover:text-white hover:bg-white/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-zinc-950 border-b-4 border-mc-green">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 block px-4 py-3 font-pixel text-xl uppercase ${
                  isActive(link.path)
                    ? 'bg-mc-green text-black'
                    : 'text-gray-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            <div className="border-t border-white/10 my-2 pt-2">
              {user ? (
                <div className="p-2 space-y-2">
                  <div className="px-4 py-2 text-mc-green font-pixel text-xl border border-white/10 bg-zinc-900">
                    @{user.username}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 font-pixel text-xl text-red-400 bg-red-900/20 hover:bg-red-900/40 uppercase"
                  >
                    <LogOut size={20} /> Chiqish
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 block px-4 py-3 font-pixel text-xl uppercase text-white bg-zinc-800 hover:bg-zinc-700 mx-2 mb-2 border-2 border-black"
                >
                  <LogIn size={20} /> Kirish
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;