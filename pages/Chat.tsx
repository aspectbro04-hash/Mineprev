
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getChatMessages, addChatMessage } from '../services/storage';
import { ChatMessage } from '../types';
import { Link } from 'react-router-dom';

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load messages and setup poller for "real-time" effect in localStorage
  useEffect(() => {
    // Initial load
    setMessages(getChatMessages());

    // Poll for new messages every 2 seconds (simulating realtime backend)
    const interval = setInterval(() => {
      setMessages(getChatMessages());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      text: newMessage.trim(),
      timestamp: Date.now(),
    };

    addChatMessage(msg);
    setMessages(getChatMessages()); // Update state immediately
    setNewMessage('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-zinc-900">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-white/10 p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-mc-green/10 rounded-full flex items-center justify-center text-mc-green">
            <MessageCircle size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Umumiy Chat</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Jonli efir
            </p>
          </div>
        </div>
        {!user && (
          <div className="text-xs text-red-400 flex items-center gap-1 bg-red-500/10 px-3 py-1 rounded-full">
            <AlertTriangle size={12} /> Faqat o'qish rejimi
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 bg-zinc-900 scroll-smooth"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #333 1px, transparent 0)', backgroundSize: '40px 40px' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
             <MessageCircle size={48} className="mb-4 opacity-20" />
             <p>Hozircha xabarlar yo'q. Suhbatni boshlang!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = user?.id === msg.userId;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar Placeholder */}
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${isMe ? 'bg-mc-green text-black' : 'bg-zinc-700 text-gray-300'}`}>
                    {msg.username.substring(0, 1).toUpperCase()}
                  </div>
                  
                  <div className={`relative px-4 py-3 rounded-2xl shadow-sm ${
                    isMe 
                      ? 'bg-mc-green text-black rounded-tr-none' 
                      : 'bg-zinc-800 text-gray-200 rounded-tl-none border border-white/5'
                  }`}>
                    {!isMe && (
                      <p className="text-[10px] font-bold text-mc-green mb-1 opacity-80">{msg.username}</p>
                    )}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-black/60' : 'text-gray-500'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-zinc-950 border-t border-white/10 p-4">
        {user ? (
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Xabar yozing..."
              className="flex-grow bg-zinc-900 border border-zinc-700 rounded-full px-6 py-3 text-white focus:outline-none focus:border-mc-green focus:ring-1 focus:ring-mc-green transition-all placeholder-gray-500"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-mc-green text-black p-3 rounded-full hover:bg-mc-greenDark disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 shadow-lg shadow-mc-green/20"
            >
              <Send size={20} />
            </button>
          </form>
        ) : (
          <div className="text-center py-2">
            <p className="text-gray-400 mb-2 text-sm">Suhbatlashish uchun tizimga kiring</p>
            <Link 
              to="/login" 
              className="inline-block px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-full transition-colors border border-white/10"
            >
              Kirish yoki Ro'yxatdan o'tish
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
