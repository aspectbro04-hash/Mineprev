import React, { useEffect, useState } from 'react';
import { getGalleryItems, getComments, addComment } from '../services/storage';
import { GalleryItem, Comment } from '../types';
import { X, ZoomIn, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  
  const { user } = useAuth();

  useEffect(() => {
    setItems(getGalleryItems());
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setComments(getComments(selectedItem.id));
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedItem]);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedItem || !newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      galleryItemId: selectedItem.id,
      userId: user.id,
      username: user.username,
      text: newComment,
      date: new Date().toLocaleDateString('uz-UZ')
    };

    addComment(comment);
    setComments([comment, ...comments]); // Optimistic update
    setNewComment('');
  };

  return (
    <div className="min-h-screen bg-zinc-900 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Galereya</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Admin va foydalanuvchilar tomonidan yaratilgan eng yaxshi thumbnaillar.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-zinc-950 rounded-xl border border-dashed border-zinc-800">
            Hozircha thumbnaillar yo'q. Admin panel orqali qo'shing.
          </div>
        ) : (
          /* Masonry Layout via CSS Columns to respect Aspect Ratios */
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="group break-inside-avoid relative bg-zinc-950 rounded-xl overflow-hidden border border-white/5 shadow-lg hover:shadow-mc-green/10 transition-all duration-300 hover:-translate-y-1 cursor-pointer mb-6"
                onClick={() => setSelectedItem(item)}
              >
                {/* Removed aspect ratio forcing, added w-full h-auto */}
                <div className="w-full">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="w-full h-auto object-contain block"
                  />
                </div>
                
                {/* Overlay only appears on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-bold text-white">{item.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-mc-green">{item.date}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MessageSquare size={14} /> Sharhlar
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/10 p-2 rounded-full backdrop-blur-sm">
                    <ZoomIn className="text-white" size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal with Comments */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-fade-in overflow-y-auto">
          <button 
            className="fixed top-6 right-6 text-white hover:text-mc-green transition-colors z-50 bg-black/50 p-2 rounded-full"
            onClick={() => setSelectedItem(null)}
          >
            <X size={28} />
          </button>
          
          <div className="max-w-6xl w-full bg-zinc-950 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row max-h-[90vh]">
             
             {/* Image Section */}
             <div className="lg:w-2/3 bg-black/50 flex items-center justify-center p-4 lg:p-10 border-b lg:border-b-0 lg:border-r border-white/10 relative">
               <img 
                src={selectedItem.imageUrl} 
                alt={selectedItem.title} 
                className="max-h-[50vh] lg:max-h-[80vh] w-auto object-contain rounded-lg shadow-lg"
               />
             </div>

             {/* Comments Sidebar */}
             <div className="lg:w-1/3 flex flex-col h-[500px] lg:h-auto">
               <div className="p-6 border-b border-white/10">
                 <h2 className="text-2xl font-bold text-white">{selectedItem.title}</h2>
                 <p className="text-gray-400 text-sm mt-1">Yuklangan sana: {selectedItem.date}</p>
               </div>

               {/* Comment List */}
               <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-zinc-900/50">
                 {comments.length === 0 ? (
                   <div className="text-center text-gray-500 py-10">
                     <MessageSquare className="mx-auto mb-2 opacity-50" size={32} />
                     <p>Hozircha sharhlar yo'q. Birinchi bo'lib yozing!</p>
                   </div>
                 ) : (
                   comments.map((comment) => (
                     <div key={comment.id} className="bg-zinc-950 p-4 rounded-xl border border-white/5">
                       <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-mc-green text-sm">@{comment.username}</span>
                         <span className="text-xs text-gray-600">{comment.date}</span>
                       </div>
                       <p className="text-gray-300 text-sm">{comment.text}</p>
                     </div>
                   ))
                 )}
               </div>

               {/* Comment Input */}
               <div className="p-4 border-t border-white/10 bg-zinc-950">
                 {user ? (
                   <form onSubmit={handlePostComment} className="relative">
                     <input
                       type="text"
                       value={newComment}
                       onChange={(e) => setNewComment(e.target.value)}
                       placeholder="Sharh yozing..."
                       className="w-full bg-zinc-900 border border-zinc-700 rounded-full pl-5 pr-12 py-3 text-white focus:outline-none focus:border-mc-green transition-colors text-sm"
                     />
                     <button 
                       type="submit"
                       disabled={!newComment.trim()}
                       className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-mc-green text-black rounded-full hover:bg-mc-greenDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                     >
                       <Send size={16} />
                     </button>
                   </form>
                 ) : (
                   <div className="text-center">
                     <p className="text-sm text-gray-500 mb-2">Sharh yozish uchun kiring</p>
                     <Link to="/login" className="inline-block text-sm font-medium text-mc-green hover:underline">
                       Kirish yoki Ro'yxatdan o'tish
                     </Link>
                   </div>
                 )}
               </div>
             </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;