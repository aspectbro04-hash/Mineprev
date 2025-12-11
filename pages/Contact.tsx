import React from 'react';
import { Mail, MapPin, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-900 pt-12 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Aloqa</h1>
          <p className="text-gray-400">
             Savollaringiz bormi? Biz bilan bog'laning.
          </p>
        </div>

        <div className="bg-zinc-950 rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl">
          
          {/* Info Side */}
          <div className="bg-zinc-900 p-10 md:w-2/5 flex flex-col justify-between border-r border-white/5">
            <div>
              <h3 className="text-xl font-bold text-white mb-6">Ma'lumot</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mc-green/10 rounded-lg text-mc-green">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium">contact@mineprev.uz</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-mc-green/10 rounded-lg text-mc-green">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Joylashuv</p>
                    <p className="text-white font-medium">Tashkent, Uzbekistan</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-10">
              <p className="text-gray-500 text-sm">
                Biz odatda 24 soat ichida javob beramiz.
              </p>
            </div>
          </div>

          {/* Form Side */}
          <div className="p-10 md:w-3/5">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Ismingiz</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mc-green transition-colors"
                  placeholder="Ism kiriting"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input 
                  type="email" 
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mc-green transition-colors"
                  placeholder="example@mail.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Xabar</label>
                <textarea 
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-mc-green transition-colors"
                  placeholder="Xabaringizni yozing..."
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-mc-green hover:bg-mc-greenDark text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} /> Yuborish
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;