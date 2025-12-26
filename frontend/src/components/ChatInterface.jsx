import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ChevronLeft, MoreVertical, ShieldCheck } from 'lucide-react';

const ChatInterface = ({ isOpen, onClose, room }) => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, text: `Hey! I saw the ${room?.title}. Is it available?`, sender: 'user', time: '10:00 AM' },
    { id: 2, text: `Hello! Yes, it is. When would you like to come see it?`, sender: 'landlord', time: '10:02 AM' }
  ]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const newMsg = {
      id: Date.now(),
      text: text,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMsg]);
    setText("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 bg-white z-[2000] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <ChevronLeft size={24} className="text-slate-900" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 overflow-hidden border border-slate-200">
                  <img src={room?.img} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 leading-none">{room?.landlordName || "Landlord"}</h4>
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Now</span>
                </div>
              </div>
            </div>
            <MoreVertical size={20} className="text-slate-300" />
          </div>

          {/* Secure Message Banner */}
          <div className="bg-slate-50 p-2 flex items-center justify-center gap-2">
            <ShieldCheck size={12} className="text-slate-400" />
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">End-to-End Encrypted</p>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-[24px] shadow-sm ${
                  m.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-700 rounded-bl-none border border-slate-100'
                }`}>
                  <p className="text-sm font-medium">{m.text}</p>
                  <p className={`text-[9px] mt-1 font-bold opacity-50 ${m.sender === 'user' ? 'text-white' : 'text-slate-400'}`}>
                    {m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

       
          <form onSubmit={sendMessage} className="p-6 bg-white border-t border-slate-100 flex items-center gap-3">
            <input 
              type="text" 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Message..."
              className="flex-1 bg-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
            />
            <button type="submit" className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-200 active:scale-90 transition-transform">
              <Send size={20} fill="white" />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatInterface;