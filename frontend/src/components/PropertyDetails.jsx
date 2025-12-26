import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, IndianRupee, Zap, MessageCircle, Sparkles } from 'lucide-react';

const PropertyDetails = ({ isOpen, onClose, room, onOpenChat }) => {
  if (!room) return null;

  
  const handleMessageClick = () => {
    onClose(); 
    if (onOpenChat) {
      onOpenChat(room); 
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose} 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[1001]"
          />

          <motion.div
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-[1002] max-h-[92vh] overflow-y-auto shadow-2xl"
          >
            
            <div className="flex justify-center pt-4 pb-2 sticky top-0 bg-white z-10">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="px-6 pb-10">
             
              <div className="relative h-72 rounded-[32px] overflow-hidden mb-6 shadow-xl">
                <img src={room.img} className="w-full h-full object-cover" alt="room" />
                <button 
                  onClick={onClose} 
                  className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white border border-white/20 hover:bg-black/40 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

         
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {room.title || room.type}
                  </h2>
                  <div className="flex items-center gap-1 text-slate-500 font-bold text-sm mt-1">
                    <MapPin size={14} className="text-indigo-500" />
                    {room.location} • {room.distance}km from Campus
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600 flex items-center justify-end">
                    <IndianRupee size={20} strokeWidth={3} />
                    {room.price}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">per month</span>
                </div>
              </div>

             
              <div className="mb-8 p-6 bg-indigo-50/50 rounded-[32px] border border-indigo-100">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-indigo-600" />
                  <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest">
                    Why it's a {room.matchScore}% Match
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Budget Alignment", val: room.price < 12000 ? 95 : 75 },
                    { label: "Location Priority", val: room.distance < 1.5 ? 98 : 70 },
                    { label: "Lifestyle & Amenities", val: 90 }
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-600">{stat.label}</span>
                        <span className="text-[11px] font-black text-indigo-600">{stat.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${stat.val}%` }} 
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-indigo-500 rounded-full" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="mb-8">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Amenities</h3>
                <div className="grid grid-cols-3 gap-3">
                  {room.amenities?.map((item) => (
                    <div key={item} className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-indigo-200 group">
                      <Zap size={18} className="text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-slate-600 text-center">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleMessageClick}
                  className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-indigo-600"
                >
                  <MessageCircle size={18} />
                  Send Message
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PropertyDetails;