
import React, { useState, useEffect, useRef } from 'react';
import { 
  getGalleryItems, 
  addGalleryItem, 
  deleteGalleryItem,
  getUserSubmissions,
  updateUserSubmissionStars,
  deleteUserSubmission,
  getRewardRequests,
  completeRewardRequest,
  getActiveConversations,
  getPrivateMessages,
  sendPrivateMessage,
  compressImage
} from '../services/storage';
import { GalleryItem, UserSubmission, RewardRequest, ChatMessage } from '../types';
import { Trash2, Plus, Lock, LogOut, Upload, Link as LinkIcon, Image as ImageIcon, Star, Gift, Check, MessageSquare, Send, User } from 'lucide-react';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminLogin, setAdminLogin] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'contest' | 'rewards' | 'messages'>('gallery');
  
  // Gallery State
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadType, setUploadType] = useState<'url' | 'file'>('file');
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Contest State
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  
  // Rewards State
  const [rewards, setRewards] = useState<RewardRequest[]>([]);

  // Messages State
  const [conversations, setConversations] = useState<{userId: string, username: string, lastMessage: string}[]>([]);
  const [selectedChatUser, setSelectedChatUser] = useState<{id: string, username: string} | null>(null);
  const [adminMessage, setAdminMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      refreshAll();
      // Poll for messages if chat is open
      const interval = setInterval(() => {
        if (selectedChatUser) {
           setChatMessages(getPrivateMessages(selectedChatUser.id));
        }
        if (activeTab === 'messages') {
          setConversations(getActiveConversations());
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, selectedChatUser, activeTab]);

  const refreshAll = () => {
    setItems(getGalleryItems());
    setSubmissions(getUserSubmissions());
    setRewards(getRewardRequests());
    setConversations(getActiveConversations());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminLogin === 'Mineprevadmin' && password === 'Mineprev00979#') {
      setIsAuthenticated(true);
    } else {
      alert("Login yoki parol noto'g'ri!");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Fayl hajmi juda katta! 5MB dan kichik rasm yuklang.");
        e.target.value = '';
        return;
      }
      
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file, 800, 0.7);
        setImageUrl(compressed);
      } catch (err) {
        alert("Rasmni siqishda xatolik.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) {
      alert("Iltimos, sarlavha va rasmni kiriting/yuklang.");
      return;
    }
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      title,
      imageUrl,
      date: new Date().toLocaleDateString('uz-UZ')
    };
    try {
      addGalleryItem(newItem);
      refreshAll();
      setTitle('');
      setImageUrl('');
      alert("Thumbnail muvaffaqiyatli qo'shildi!");
    } catch (error) {
       // handled in storage
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("O'chirmoqchimisiz?")) {
      deleteGalleryItem(id);
      refreshAll();
    }
  };

  // Contest Actions
  const handleRateSubmission = (id: string, stars: number) => {
    const validStars = Math.max(0, Math.min(100, stars));
    updateUserSubmissionStars(id, validStars);
    refreshAll();
  };

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm("Foydalanuvchi ishini o'chirmoqchimisiz?")) {
      deleteUserSubmission(id);
      refreshAll();
    }
  };

  const handleCompleteReward = (id: string) => {
    if (window.confirm("Mukofot berildimi?")) {
      completeRewardRequest(id);
      refreshAll();
    }
  };

  const handleSelectChat = (userId: string, username: string) => {
    setSelectedChatUser({ id: userId, username });
    setChatMessages(getPrivateMessages(userId));
  };

  const handleSendAdminMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatUser || !adminMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: 'admin', // Admin ID
      username: 'Admin',
      text: adminMessage.trim(),
      timestamp: Date.now()
    };

    sendPrivateMessage(selectedChatUser.id, msg);
    setChatMessages(getPrivateMessages(selectedChatUser.id));
    setAdminMessage('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminLogin('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-zinc-950 p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-mc-green/10 rounded-full flex items-center justify-center text-mc-green">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-white mb-6">Admin Panelga Kirish</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Login</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={adminLogin}
                  onChange={(e) => setAdminLogin(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-mc-green transition-colors"
                  placeholder="Loginni kiriting"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Parol</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-mc-green transition-colors"
                  placeholder="Parolni kiriting"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full bg-mc-green hover:bg-mc-greenDark text-black font-bold py-3 rounded-lg transition-colors mt-2"
            >
              Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-white">Boshqaruv Paneli</h1>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
          >
            <LogOut size={18} /> Chiqish
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-white/10 pb-4 overflow-x-auto">
           <button 
             onClick={() => setActiveTab('gallery')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'gallery' ? 'bg-mc-green text-black' : 'text-gray-400 hover:text-white bg-zinc-800'}`}
           >
             <ImageIcon size={16} /> Asosiy Galereya
           </button>
           <button 
             onClick={() => setActiveTab('contest')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'contest' ? 'bg-mc-green text-black' : 'text-gray-400 hover:text-white bg-zinc-800'}`}
           >
             <Star size={16} /> Tanlov / Baholash
           </button>
           <button 
             onClick={() => setActiveTab('rewards')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'rewards' ? 'bg-mc-green text-black' : 'text-gray-400 hover:text-white bg-zinc-800'}`}
           >
             <Gift size={16} /> Mukofotlar ({rewards.filter(r => r.status === 'pending').length})
           </button>
           <button 
             onClick={() => setActiveTab('messages')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'messages' ? 'bg-mc-green text-black' : 'text-gray-400 hover:text-white bg-zinc-800'}`}
           >
             <MessageSquare size={16} /> Xabarlar (Lichka)
           </button>
        </div>

        {/* --- GALLERY TAB --- */}
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-zinc-950 p-6 rounded-xl border border-white/10 sticky top-24">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Plus size={20} className="text-mc-green" /> Yangi Thumbnail
                </h2>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Sarlavha</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-mc-green"
                      placeholder="Thumbnail nomi"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Yuklash turi</label>
                    <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                      <button
                        type="button"
                        onClick={() => { setUploadType('file'); setImageUrl(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                          uploadType === 'file' ? 'bg-zinc-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        <Upload size={16} /> Fayl
                      </button>
                      <button
                        type="button"
                        onClick={() => { setUploadType('url'); setImageUrl(''); }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${
                          uploadType === 'url' ? 'bg-zinc-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        <LinkIcon size={16} /> URL
                      </button>
                    </div>
                  </div>
                  <div className="min-h-[120px]">
                    {uploadType === 'file' ? (
                      <div className="relative group">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 hover:border-mc-green transition-all">
                          {isCompressing ? (
                            <span className="text-mc-green animate-pulse">Siqilmoqda...</span>
                          ) : (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-mc-green transition-colors" />
                              <p className="text-xs text-gray-400">{imageUrl ? "Rasm tanlandi" : "Rasm tanlash"}</p>
                            </div>
                          )}
                          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isCompressing} />
                        </label>
                      </div>
                    ) : (
                      <input 
                        type="url" 
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-mc-green"
                        placeholder="https://..."
                      />
                    )}
                  </div>
                  <button type="submit" className="w-full bg-mc-green hover:bg-mc-greenDark text-black font-bold py-3 rounded-lg transition-colors" disabled={isCompressing}>
                    Qo'shish
                  </button>
                </form>
              </div>
            </div>
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="bg-zinc-950 p-4 rounded-xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-md bg-zinc-900" />
                    <div>
                      <h4 className="text-white font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(item.id)} className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CONTEST TAB --- */}
        {activeTab === 'contest' && (
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Foydalanuvchilar Ishlari ({submissions.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {submissions.map((sub) => (
                   <div key={sub.id} className="bg-zinc-950 rounded-xl border border-white/10 overflow-hidden flex flex-col">
                      <div className="h-48 bg-zinc-900 relative">
                         <img src={sub.imageUrl} alt={sub.title} className="w-full h-full object-contain" />
                         <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                           {sub.username}
                         </div>
                      </div>
                      <div className="p-4 flex-grow">
                         <h3 className="text-white font-bold">{sub.title}</h3>
                         <p className="text-xs text-gray-400 mb-4">{sub.date}</p>
                         
                         <label className="text-xs text-gray-400 block mb-1">Yulduzlar (0-100)</label>
                         <div className="flex gap-2">
                           <input 
                             type="number" 
                             min="0" 
                             max="100"
                             defaultValue={sub.stars}
                             onBlur={(e) => handleRateSubmission(sub.id, parseInt(e.target.value))}
                             className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white text-sm"
                           />
                           <button 
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="bg-red-500/10 text-red-500 p-2 rounded hover:bg-red-500/20"
                           >
                             <Trash2 size={16} />
                           </button>
                         </div>
                      </div>
                   </div>
                 ))}
                 {submissions.length === 0 && (
                   <div className="col-span-full text-center text-gray-500 py-10">Ishlar yo'q</div>
                 )}
              </div>
           </div>
        )}

        {/* --- REWARDS TAB --- */}
        {activeTab === 'rewards' && (
           <div className="space-y-6">
              <h2 className="text-xl font-bold text-white">Mukofot So'rovlari</h2>
              <div className="space-y-4">
                 {rewards.map((req) => (
                   <div key={req.id} className={`bg-zinc-950 p-6 rounded-xl border ${req.status === 'completed' ? 'border-green-500/30 opacity-70' : 'border-yellow-500/50'}`}>
                      <div className="flex justify-between items-start mb-2">
                         <div>
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                              @{req.username} 
                              {req.status === 'pending' && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">Kutilmoqda</span>}
                              {req.status === 'completed' && <span className="text-xs bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full">Bajarildi</span>}
                            </h3>
                            <p className="text-xs text-gray-500">{req.date}</p>
                         </div>
                         {req.status === 'pending' && (
                           <button 
                             onClick={() => handleCompleteReward(req.id)}
                             className="bg-green-500 text-black px-4 py-2 rounded font-bold text-sm hover:bg-green-400 flex items-center gap-2"
                           >
                             <Check size={16} /> Bajarildi deb belgilash
                           </button>
                         )}
                      </div>
                      <div className="bg-zinc-900 p-4 rounded-lg mt-2 text-gray-300 text-sm">
                        "{req.message}"
                      </div>
                   </div>
                 ))}
                 {rewards.length === 0 && (
                   <div className="text-center text-gray-500 py-10">So'rovlar yo'q</div>
                 )}
              </div>
           </div>
        )}

        {/* --- MESSAGES (LICHKA) TAB --- */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* User List */}
            <div className="lg:col-span-1 bg-zinc-950 rounded-xl border border-white/10 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-white/10">
                <h3 className="font-bold text-white">Suhbatlar</h3>
              </div>
              <div className="flex-grow overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">Xabarlar yo'q</div>
                ) : (
                  conversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => handleSelectChat(conv.userId, conv.username)}
                      className={`w-full text-left p-4 border-b border-white/5 hover:bg-zinc-900 transition-colors flex items-center gap-3 ${
                        selectedChatUser?.id === conv.userId ? 'bg-zinc-800' : ''
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-mc-green/20 text-mc-green flex items-center justify-center font-bold">
                        {conv.username[0].toUpperCase()}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-white font-medium truncate">{conv.username}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.lastMessage}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Box */}
            <div className="lg:col-span-2 bg-zinc-950 rounded-xl border border-white/10 overflow-hidden flex flex-col">
               {selectedChatUser ? (
                 <>
                   <div className="p-4 border-b border-white/10 bg-zinc-900 flex justify-between items-center">
                     <span className="font-bold text-white">Chat: @{selectedChatUser.username}</span>
                     <button onClick={() => setSelectedChatUser(null)} className="text-xs text-gray-400 hover:text-white lg:hidden">Yopish</button>
                   </div>
                   
                   <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-zinc-900/50">
                      {chatMessages.map((msg) => {
                         const isAdmin = msg.userId === 'admin';
                         return (
                           <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] px-4 py-2 rounded-xl text-sm ${
                                isAdmin 
                                  ? 'bg-mc-green text-black rounded-tr-none' 
                                  : 'bg-zinc-800 text-white rounded-tl-none'
                              }`}>
                                <p>{msg.text}</p>
                                <p className={`text-[10px] mt-1 text-right ${isAdmin ? 'text-black/60' : 'text-gray-400'}`}>
                                   {new Date(msg.timestamp).toLocaleTimeString('uz-UZ', {hour:'2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                           </div>
                         );
                      })}
                      <div ref={chatEndRef}></div>
                   </div>

                   <div className="p-4 bg-zinc-950 border-t border-white/10">
                      <form onSubmit={handleSendAdminMessage} className="flex gap-2">
                        <input 
                          type="text" 
                          value={adminMessage}
                          onChange={(e) => setAdminMessage(e.target.value)}
                          placeholder="Javob yozing..."
                          className="flex-grow bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-mc-green"
                        />
                        <button type="submit" className="bg-mc-green text-black p-2 rounded-lg hover:bg-mc-greenDark">
                          <Send size={18} />
                        </button>
                      </form>
                   </div>
                 </>
               ) : (
                 <div className="flex items-center justify-center h-full text-gray-500 flex-col">
                    <MessageSquare size={48} className="mb-4 opacity-20" />
                    <p>Foydalanuvchini tanlang</p>
                 </div>
               )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
