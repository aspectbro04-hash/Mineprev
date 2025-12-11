import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Zap, Image as ImageIcon, Skull } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative min-h-[700px] flex items-center justify-center overflow-hidden border-b-4 border-black">
        {/* Scary Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110 animate-pulse-slow"
          style={{ 
            backgroundImage: 'url("https://wallpapers.com/images/hd/minecraft-nether-background-1920-x-1080-874v6e4w4a4j6w3e.jpg")',
            filter: 'brightness(0.6) contrast(1.2)'
          }} 
        ></div>
        
        {/* Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 z-0"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] z-0 opacity-80"></div>

        {/* Floating Mobs (Decorations) */}
        <img 
          src="https://www.pngmart.com/files/22/Minecraft-Creeper-PNG-Pic.png" 
          alt="Creeper"
          className="absolute bottom-0 right-[-50px] md:right-[5%] h-[200px] md:h-[400px] z-10 animate-float opacity-90 drop-shadow-[0_0_15px_rgba(0,255,0,0.5)]"
          style={{ animationDelay: '1s' }}
        />
        <img 
          src="https://static.wikia.nocookie.com/minecraft_gamepedia/images/b/b8/Warden.png" 
          alt="Warden"
          className="absolute top-[20%] left-[-100px] md:left-[5%] h-[300px] md:h-[500px] z-0 opacity-40 blur-[2px] animate-pulse-slow"
        />

        {/* Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-block px-6 py-2 rounded-none bg-black/60 border-2 border-mc-green text-mc-green font-pixel text-xl mb-6 shadow-[0_0_20px_rgba(85,255,85,0.2)]">
            NEW: THUMBNAIL MAKER v2.0
          </div>
          
          <h1 className="text-6xl md:text-9xl font-bold text-white mb-4 tracking-tight font-pixel text-shadow-lg drop-shadow-[0_5px_0_#000]">
            MINE<span className="text-mc-green">PREV</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-300 mb-10 max-w-3xl mx-auto font-pixel tracking-wide bg-black/40 p-4 rounded border border-white/10 backdrop-blur-sm">
            Professional Minecraft Thumbnail Tool. <br/>
            YouTube videolaringiz uchun <span className="text-mc-green">3D Thumbnail</span> yarating.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/editor" 
              className="group relative px-8 py-4 bg-mc-green text-black font-pixel text-2xl uppercase tracking-wider mc-btn-style hover:bg-white transition-colors"
            >
              <span className="relative z-10 flex items-center gap-3">
                 Thumbnail Yaratish <ArrowRight size={24} strokeWidth={3} />
              </span>
            </Link>
            
            <Link 
              to="/gallery" 
              className="group px-8 py-4 bg-zinc-800 text-white font-pixel text-2xl uppercase tracking-wider mc-btn-style hover:bg-zinc-700 border-2 border-gray-500"
            >
              Galereya
            </Link>
          </div>
        </div>
      </div>

      {/* Stats / Info Bar */}
      <div className="bg-mc-obsidian border-b-4 border-black py-8 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20"></div>
         <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-wrap justify-center gap-12 text-center">
            <div>
               <h3 className="text-4xl text-mc-diamond font-pixel mb-1">10K+</h3>
               <p className="text-gray-400 font-pixel text-lg uppercase">Thumbnaillar</p>
            </div>
            <div>
               <h3 className="text-4xl text-mc-gold font-pixel mb-1">500+</h3>
               <p className="text-gray-400 font-pixel text-lg uppercase">YouTuberlar</p>
            </div>
            <div>
               <h3 className="text-4xl text-mc-redstone font-pixel mb-1">100%</h3>
               <p className="text-gray-400 font-pixel text-lg uppercase">Bepul</p>
            </div>
         </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-[#0a0a0a] relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-pixel text-white mb-4 drop-shadow-md">IMKONIYATLAR</h2>
            <div className="h-1 w-24 bg-mc-green mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-1 bg-zinc-800 rounded-none border-4 border-black shadow-[8px_8px_0_#111] hover:translate-y-[-5px] hover:shadow-[12px_12px_0_#55FF55] transition-all duration-300 group">
              <div className="bg-zinc-900 p-8 h-full border border-white/5">
                <div className="w-16 h-16 bg-blue-900/30 border-2 border-blue-500 flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-black transition-colors">
                  <Layers className="text-blue-400 group-hover:text-black" size={32} />
                </div>
                <h3 className="text-2xl font-pixel text-white mb-3">3D THUMBNAIL</h3>
                <p className="text-gray-400 leading-relaxed font-sans text-sm">
                  YouTube videolaringiz uchun 3D skinlar bilan ajoyib thumbnaillar yarating. Pozalarni o'zgartiring.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-1 bg-zinc-800 rounded-none border-4 border-black shadow-[8px_8px_0_#111] hover:translate-y-[-5px] hover:shadow-[12px_12px_0_#55FF55] transition-all duration-300 group">
              <div className="bg-zinc-900 p-8 h-full border border-white/5">
                <div className="w-16 h-16 bg-green-900/30 border-2 border-mc-green flex items-center justify-center mb-6 group-hover:bg-mc-green group-hover:text-black transition-colors">
                  <Zap className="text-mc-green group-hover:text-black" size={32} />
                </div>
                <h3 className="text-2xl font-pixel text-white mb-3">TEZKOR YUKLASH</h3>
                <p className="text-gray-400 leading-relaxed font-sans text-sm">
                  4K formatdagi yuqori sifatli PNG rasmlarni bir zumda yuklab oling va Photoshopda ishlating.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-1 bg-zinc-800 rounded-none border-4 border-black shadow-[8px_8px_0_#111] hover:translate-y-[-5px] hover:shadow-[12px_12px_0_#55FF55] transition-all duration-300 group">
              <div className="bg-zinc-900 p-8 h-full border border-white/5">
                <div className="w-16 h-16 bg-purple-900/30 border-2 border-purple-500 flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-black transition-colors">
                  <ImageIcon className="text-purple-400 group-hover:text-black" size={32} />
                </div>
                <h3 className="text-2xl font-pixel text-white mb-3">GALEREYA & CHAT</h3>
                <p className="text-gray-400 leading-relaxed font-sans text-sm">
                  O'z thumbnaillaringizni bo'lishing va boshqa YouTuberlar bilan fikr almashing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;