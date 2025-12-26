import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, MessageSquareOff, Zap, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ChatDetail from './ChatDetail'; 

const Messages = () => {
  const { userData, chats = [] } = useApp();
  const [selectedChat, setSelectedChat] = useState(null);
  

  const userRole = userData?.role || 'student';


  const localChats = chats.filter(chat => chat.targetRole === userRole);

  const uiContent = {
    landlord: {
      title: "Inquiries",
      subTitle: "Potential Tenants",
      searchPlaceholder: "Search student names...",
      emptyState: "Once a student swipes right, they'll appear here.",
      badgeLabel: "Unit:"
    },
    student: {
      title: "Messages",
      subTitle: "Property Managers",
      searchPlaceholder: "Search properties...",
      emptyState: "Swipe on properties to start a conversation!",
      badgeLabel: "Property:"
    }
  };

  const content = uiContent[userRole];

  return (
    <div className="relative min-h-screen bg-white">
     
      <div className={`pb-32 px-4 pt-6 transition-all ${selectedChat ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        
       
        <div className="flex justify-between items-end mb-10 px-2">
          <div>
            <h2 className="text-4xl font-black text-slate-900 italic tracking-tighter">
              {content.title}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mt-2">
              {localChats.length} Active {content.subTitle}
            </p>
          </div>
          <button className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform">
            <Filter size={20} />
          </button>
        </div>

   
        <div className="relative mb-10 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder={content.searchPlaceholder} 
            className="w-full bg-slate-100/60 border-2 border-transparent rounded-[24px] py-5 pl-14 pr-6 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none"
          />
        </div>

      
        <div className="space-y-4">
          {localChats.length === 0 ? (
            <div className="text-center py-20">
              <MessageSquareOff className="mx-auto text-slate-200 mb-6" size={48} />
              <p className="text-slate-400 font-bold italic">{content.emptyState}</p>
            </div>
          ) : (
            localChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className="bg-white p-5 rounded-[36px] border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
              >
                <div className="w-16 h-16 rounded-[26px] bg-indigo-50 overflow-hidden relative border border-slate-50">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.name}`} alt="avatar" />
                  {userRole === 'landlord' && chat.score && (
                    <div className="absolute top-0 left-0 bg-amber-400 text-white p-1 rounded-br-xl border-r border-b border-white">
                      <Zap size={10} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-black text-slate-900 truncate">{chat.name}</h3>
                    <span className="text-[10px] font-black text-slate-300 uppercase">{chat.time}</span>
                  </div>
                  
                 
                  <div className="inline-block bg-slate-50 px-2 py-0.5 rounded-md mb-1.5 border border-slate-100">
                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-wider">
                      {content.badgeLabel} {chat.propertyInterestedIn}
                    </p>
                  </div>
                  <p className={`text-xs truncate ${chat.unread ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                    {chat.msg}
                  </p>
                </div>
                <ChevronRight size={20} className="text-slate-200" />
              </div>
            ))
          )}
        </div>
      </div>

      
      <AnimatePresence>
        {selectedChat && (
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-0 z-50">
            <ChatDetail chat={selectedChat} onBack={() => setSelectedChat(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Messages;