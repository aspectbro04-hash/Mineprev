import React from 'react';
import { Github, Twitter, Mail, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t-4 border-black py-16 relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mc-green/0 via-mc-green/50 to-mc-green/0"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="md:col-span-2">
            <h3 className="text-3xl font-pixel text-white mb-6 flex items-center gap-2">
              <Box className="text-mc-green" size={28} />
              MINE<span className="text-mc-green">PREV</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-sans mb-6">
              YouTube videolaringiz uchun Professional Minecraft Thumbnaillar yaratish platformasi. 
              3D Skin renderlash va bepul dizayn vositalari.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-gray-400 hover:bg-mc-green hover:text-black hover:border-black transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black hover:border-black transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-zinc-900 border border-zinc-700 flex items-center justify-center text-gray-400 hover:bg-red-500 hover:text-white hover:border-black transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-pixel text-xl mb-6 tracking-wide border-b-2 border-zinc-800 inline-block pb-1">SAHIFALAR</h4>
            <ul className="space-y-3 font-pixel text-lg text-gray-400">
              <li><Link to="/" className="hover:text-mc-green hover:pl-2 transition-all">BOSH SAHIFA</Link></li>
              <li><Link to="/editor" className="hover:text-mc-green hover:pl-2 transition-all">THUMBNAIL YARATISH</Link></li>
              <li><Link to="/gallery" className="hover:text-mc-green hover:pl-2 transition-all">GALEREYA</Link></li>
              <li><Link to="/contact" className="hover:text-mc-green hover:pl-2 transition-all">ALOQA</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-pixel text-xl mb-6 tracking-wide border-b-2 border-zinc-800 inline-block pb-1">HUQUQIY</h4>
            <ul className="space-y-3 font-pixel text-lg text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Maxfiylik Siyosati</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Foydalanish Shartlari</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Sozlamalari</a></li>
            </ul>
            <div className="mt-8 text-xs text-zinc-600 font-sans">
              &copy; {new Date().getFullYear()} MinePrev. <br/>
              Not affiliated with Mojang Studios.
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;