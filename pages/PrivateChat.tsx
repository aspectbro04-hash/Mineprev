
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getPrivateMessages, sendPrivateMessage } from '../services/storage';
import { ChatMessage } from '../types';
import { Link } from 'react-router-dom';

const PrivateChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for new messages
  useEffect(() => {
    if (!user) return;
    
    // Initial load
    setMessages(getPrivateMessages(user.id));

    // Poll every 2 seconds
    const interval = setInterval(() => {
      setMessages(getPrivateMessages(user.id));
    }, 2000);

    return () => clearInterval(interval);
  }, [user]);

  // Auto-scroll
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

    sendPrivateMessage(user.id, msg);
    setMessages(getPrivateMessages(user.id));
    setNewMessage('');
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('uz-UZ', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4">
         <div className="text-center">
            <MessageSquare size={48} className="mx-auto text-gray-500 mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Shaxsiy Xabarlar (Lichka)</h1>
            <p className="text-gray-400 mb-6">Admin bilan bog'lanish uchun tizimga kiring.</p>
            <Link to="/login" className="px-6 py-3 bg-mc-green text-black font-bold rounded-lg">Kirish</Link>
         </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-zinc-900">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-white/10 p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500">
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">Admin bilan aloqa</h1>
            <p className="text-xs text-gray-400">Shaxsiy xabarlaringiz</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-zinc-900">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
             <ShieldCheck size={48} className="mb-4 opacity-20" />
             <p>Admin ga xabar yozing. Ular tez orada javob beradi.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === user.id;
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                 <div className={`flex items-end gap-2 max-w-[85%] md:max-w-[70%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${isMe ? 'bg-indigo-500 text-white' : 'bg-red-500 text-white'}`}>
                      {isMe ? user.username[0].toUpperCase() : 'A'}
                    </div>

                    <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-zinc-800 text-gray-200 rounded-tl-none border border-white/5'
                      }`}>
                        {!isMe && <p className="text-[10px] font-bold text-red-400 mb-1">Admin</p>}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-white/60' : 'text-gray-500'}`}>
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

      {/* Input */}
      <div className="bg-zinc-950 border-t border-white/10 p-4">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-grow bg-zinc-900 border border-zinc-700 rounded-full px-6 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrivateChat;
