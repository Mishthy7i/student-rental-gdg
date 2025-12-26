import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const MatchModal = ({ isOpen, onClose, room, user, onOpenChat }) => {
  

  useEffect(() => {
    if (isOpen) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: 0.2, y: 0.5 } });
        confetti({ ...defaults, particleCount, origin: { x: 0.8, y: 0.5 } });
      }, 250);
    }
  }, [isOpen]);

  
  const handleStartChat = () => {
    onClose(); 
    if (onOpenChat) {
      onOpenChat(room); 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
        
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl"
          >
            <div className="p-8 text-center">
              {/* Avatar Match Display */}
              <div className="flex justify-center -space-x-4 mb-6">
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-indigo-100 flex items-center justify-center">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.displayName || 'User'}`} alt="User" />
                </div>
                <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden bg-emerald-100 flex items-center justify-center relative border border-slate-100">
                   <img src={room?.img} className="w-full h-full object-cover" alt="Room" />
                   <div className="absolute inset-0 bg-emerald-600/20 flex items-center justify-center">
                      <Heart size={24} className="text-white fill-white animate-pulse" />
                   </div>
                </div>
              </div>

              <h2 className="text-3xl font-black text-slate-900 leading-tight mb-2">
                It's a Match!
              </h2>
              <p className="text-slate-500 font-medium px-4">
                You and <span className="text-indigo-600 font-bold">{room?.landlordName || 'the owner'}</span> are a great fit.
              </p>

             
              <div className="mt-8 space-y-3">
               
                <button 
                  onClick={handleStartChat}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-indigo-700"
                >
                  <MessageCircle size={18} /> Send Message
                </button>

             
                <button 
                  onClick={onClose}
                  className="w-full bg-slate-50 text-slate-400 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-colors"
                >
                  Keep Swiping
                </button>
              </div>
            </div>

   
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MatchModal;