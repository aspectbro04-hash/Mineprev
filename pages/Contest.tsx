import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getUserSubmissions, 
  addUserSubmission, 
  getUserTotalStars, 
  addRewardRequest,
  getRewardRequests,
  compressImage
} from '../services/storage';
import { UserSubmission, RewardRequest } from '../types';
import { Star, Upload, Lock, Gift, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contest: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [myTotalStars, setMyTotalStars] = useState(0);
  
  // Upload State
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  
  // Reward State
  const [rewardMessage, setRewardMessage] = useState('');
  const [rewardSent, setRewardSent] = useState(false);
  const [hasActiveReward, setHasActiveReward] = useState(false);

  useEffect(() => {
    refreshData();
  }, [user]);

  const refreshData = () => {
    const all = getUserSubmissions();
    // Sort: My submissions first, then by stars high to low
    setSubmissions(all.sort((a, b) => b.stars - a.stars));
    
    if (user) {
      setMyTotalStars(getUserTotalStars(user.id));
      const myRewards = getRewardRequests().filter(r => r.userId === user.id && r.status === 'pending');
      setHasActiveReward(myRewards.length > 0);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Fayl hajmi 5MB dan katta bo'lmasligi kerak.");
        return;
      }
      
      setIsCompressing(true);
      try {
        // Compress image to ensure it fits in localStorage
        const compressedBase64 = await compressImage(file, 800, 0.7);
        setImageUrl(compressedBase64);
      } catch (err) {
        console.error(err);
        alert("Rasmni qayta ishlashda xatolik yuz berdi.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !imageUrl) return;

    const submission: UserSubmission = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      title,
      imageUrl,
      stars: 0,
      date: new Date().toLocaleDateString('uz-UZ'),
      status: 'pending'
    };

    try {
      addUserSubmission(submission);
      setTitle('');
      setImageUrl('');
      refreshData();
      alert("Thumbnail muvaffaqiyatli yuborildi! Admin tez orada baholaydi.");
    } catch (e) {
      // Storage error is handled in add function, but we clear form anyway
      console.error(e);
    }
  };

  const handleClaimReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const request: RewardRequest = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      message: rewardMessage,
      date: new Date().toLocaleString('uz-UZ'),
      status: 'pending'
    };

    addRewardRequest(request);
    setRewardSent(true);
    setHasActiveReward(true);
    setRewardMessage('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Lock size={48} className="mx-auto text-gray-500 mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Tanlovda qatnashish uchun kiring</h1>
          <p className="text-gray-400 mb-6">Yulduzlarni yig'ish uchun avval ro'yxatdan o'ting.</p>
          <Link to="/login" className="px-6 py-3 bg-mc-green text-black font-bold rounded-lg hover:bg-mc-greenDark transition-colors">
            Kirish
          </Link>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.min((myTotalStars / 100) * 100, 100);

  return (
    <div className="min-h-screen bg-zinc-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Star className="text-yellow-400 fill-yellow-400" size={32} />
            Yulduz Yig'ish
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Eng yaxshi Thumbnaillaringizni yuklang. Admin tomonidan yulduzlarni qo'lga kiriting.
            <br />
            <span className="text-mc-green font-bold">100 Yulduz</span> yig'sangiz, professional thumbnail mutlaqo bepul!
          </p>
        </div>

        {/* Progress Section */}
        <div className="bg-zinc-950 p-8 rounded-2xl border border-white/10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mc-green/20 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
             <div className="flex-1 w-full">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xl font-bold text-white">Sizning Yulduzlaringiz</span>
                  <span className="text-3xl font-bold text-yellow-400">{myTotalStars} / 100</span>
                </div>
                <div className="w-full h-6 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Yana {Math.max(0, 100 - myTotalStars)} ta yulduz kerak.
                </p>
             </div>

             {/* Reward Box */}
             <div className="w-full md:w-1/3">
               {myTotalStars >= 100 ? (
                 <div className="bg-gradient-to-br from-green-900/50 to-zinc-900 p-6 rounded-xl border border-green-500/50">
                    <div className="flex items-center gap-2 text-mc-green font-bold mb-2">
                      <Gift size={24} /> MUKOFOT OCHILDI!
                    </div>
                    
                    {hasActiveReward || rewardSent ? (
                      <div className="text-center py-4 bg-green-500/10 rounded-lg border border-green-500/20">
                        <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
                        <p className="text-white font-medium">So'rov yuborildi!</p>
                        <p className="text-xs text-gray-400">Admin tez orada siz bilan bog'lanadi.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleClaimReward}>
                        <p className="text-sm text-gray-300 mb-3">
                          Tabriklaymiz! Sizga bepul thumbnail yasab beramiz. Istagingizni yozing:
                        </p>
                        <textarea 
                          value={rewardMessage}
                          onChange={(e) => setRewardMessage(e.target.value)}
                          className="w-full bg-zinc-900 border border-green-500/30 rounded-lg p-2 text-sm text-white mb-3 focus:outline-none focus:border-green-500"
                          placeholder="Qanday thumbnail xohlaysiz? (mavzu, ranglar...)"
                          rows={2}
                          required
                        />
                        <button type="submit" className="w-full bg-mc-green text-black font-bold py-2 rounded-lg hover:bg-mc-greenDark transition-colors">
                          YUBORISH
                        </button>
                      </form>
                    )}
                 </div>
               ) : (
                 <div className="bg-zinc-900 p-6 rounded-xl border border-white/5 flex flex-col items-center justify-center text-center h-full opacity-60 grayscale">
                    <Lock size={24} className="mb-2 text-gray-500" />
                    <h3 className="font-bold text-white">Mukofot Qulfda</h3>
                    <p className="text-xs text-gray-500">100 yulduz yig'ing</p>
                 </div>
               )}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Form */}
          <div className="lg:col-span-1">
             <div className="bg-zinc-950 p-6 rounded-xl border border-white/10 sticky top-24">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Upload size={20} className="text-mc-green" /> Thumbnail Yuklash
                </h3>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Sarlavha</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-mc-green"
                      placeholder="Thumbnail nomi..."
                      required
                    />
                  </div>
                  
                  <div className="relative group">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer bg-zinc-900 hover:bg-zinc-800 hover:border-mc-green transition-all">
                        {isCompressing ? (
                          <div className="text-mc-green animate-pulse">Siqilmoqda...</div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-400 group-hover:text-mc-green transition-colors" />
                            <p className="text-xs text-gray-400">
                              {imageUrl ? "Rasm tanlandi" : "Thumbnail yuklash"}
                            </p>
                            <p className="text-[10px] text-gray-600 mt-1">PNG, JPG (max 5MB)</p>
                          </div>
                        )}
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange} 
                          disabled={isCompressing}
                        />
                      </label>
                  </div>

                  {imageUrl && (
                    <div className="h-24 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-700 flex justify-center">
                       <img src={imageUrl} alt="Preview" className="h-full object-contain" />
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isCompressing || !imageUrl}
                    className="w-full bg-mc-green hover:bg-mc-greenDark text-black font-bold py-3 rounded-lg transition-colors shadow-lg shadow-mc-green/10 disabled:opacity-50"
                  >
                    Yuborish
                  </button>
                </form>
             </div>
          </div>

          {/* Submissions Gallery */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-6">Barcha Ishtirokchilar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {submissions.map((sub) => (
                 <div key={sub.id} className="bg-zinc-950 rounded-xl border border-white/5 overflow-hidden group hover:border-mc-green/30 transition-all">
                    <div className="h-48 bg-zinc-900 overflow-hidden relative">
                       <img 
                        src={sub.imageUrl} 
                        alt={sub.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                       />
                       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                         <h4 className="text-white font-bold">{sub.title}</h4>
                         <p className="text-xs text-gray-300">by @{sub.username}</p>
                       </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                       <div className="flex items-center gap-1 text-yellow-400">
                          <Star size={18} fill={sub.stars > 0 ? "currentColor" : "none"} />
                          <span className="font-bold text-lg">{sub.stars}</span>
                       </div>
                       <div className="text-xs text-gray-500">
                         {sub.status === 'pending' ? 'Baholanmoqda...' : 'Baholandi'}
                       </div>
                    </div>
                 </div>
               ))}
               {submissions.length === 0 && (
                 <div className="col-span-full text-center py-10 text-gray-500 border border-dashed border-zinc-800 rounded-xl">
                   Hozircha thumbnaillar yo'q. Birinchi bo'lib yuklang!
                 </div>
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contest;