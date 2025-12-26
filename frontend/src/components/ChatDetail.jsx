import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Phone, MoreVertical, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ChatDetail = ({ chat, onBack }) => {
  const { userData } = useApp();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  const isLandlord = userData?.role === 'landlord';

  const portalConfig = {
    landlord: {
      label: "Student Applicant",
      firstMsg: `Hi! I'm interested in ${chat.propertyInterestedIn || 'your property'}. Is it still available?`,
      inputPlaceholder: `Reply to ${chat.name}...`
    },
    student: {
      label: "Property Manager",
      firstMsg: `Hello! Thanks for your interest in ${chat.name}. I'm the manager here—how can I help?`,
      inputPlaceholder: `Message host...`
    }
  };

  const currentPortal = isLandlord ? portalConfig.landlord : portalConfig.student;

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: currentPortal.firstMsg,
      sender: 'other', 
      time: '10:00 AM'
    },
    {
      id: 2,
      text: chat.msg,
      sender: 'other',
      time: chat.time || '10:02 AM'
    }
  ]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessage = {
      id: Date.now(),
      text: input,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    
    <div className="fixed inset-0 bg-white z-[100] flex flex-col shadow-2xl">

      <div className="px-4 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-[110]">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack} 
            className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-90"
          >
            <ChevronLeft size={24} className="text-slate-900" />
          </button>
          
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 overflow-hidden border border-slate-100 shadow-sm">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} 
                alt="avatar" 
              />
            </div>
          
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div>
            <h3 className="font-black text-slate-900 text-[15px] tracking-tight leading-none mb-1">
              {chat.name}
            </h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.15em]">
                {currentPortal.label}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!isLandlord && (
            <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
              <Phone size={20} />
            </button>
          )}
          <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-xl transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

  
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-slate-50/50 to-white">
        <div className="flex justify-center my-4">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-100/50 px-4 py-1.5 rounded-full border border-slate-200/50">
            {new Date().toLocaleDateString([], { month: 'long', day: 'numeric' })}
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] px-5 py-3.5 rounded-[22px] shadow-sm ${
                m.sender === 'me' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-100' 
                : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
              }`}>
                <p className="text-[14px] font-medium leading-relaxed">{m.text}</p>
                <div className={`flex items-center gap-1 mt-1.5 ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                   <p className={`text-[8px] font-black uppercase tracking-tighter ${
                    m.sender === 'me' ? 'text-indigo-200' : 'text-slate-300'
                  }`}>
                    {m.time}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

 
      <div className="p-4 pb-10 bg-white border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-50 rounded-[24px] p-1.5 border border-slate-200/60 focus-within:bg-white focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all duration-300">
          <button className="p-2.5 text-indigo-600 hover:bg-white rounded-full transition-all shadow-sm active:scale-90">
            <Plus size={20} />
          </button>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={currentPortal.inputPlaceholder}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] font-bold text-slate-900 placeholder:text-slate-400 py-2"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className={`p-3 rounded-full transition-all duration-300 ${
              input.trim() 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 active:scale-95' 
              : 'bg-slate-200 text-slate-400'
            }`}
          >
            <Send size={18} fill={input.trim() ? "white" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDetail;