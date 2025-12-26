import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, X, Heart, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import RoomCard from './RoomCard';

const SwipeInterface = ({ onLike, onOpenDetails }) => {
  const { properties } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentRoom = properties[currentIndex];

  const handleAction = (e, type) => {
    e.stopPropagation(); 
    if (!currentRoom) return;
    if (type === 'like' && onLike) onLike(currentRoom);
    setCurrentIndex((prev) => prev + 1);
  };

  if (!currentRoom || currentIndex >= properties.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center p-8 bg-white rounded-[40px] border border-dashed border-slate-200 mx-auto max-w-sm">
        <Home className="text-indigo-600 w-12 h-12 mb-4 opacity-20" />
        <h2 className="text-2xl font-black text-slate-900">All Caught Up!</h2>
        <button 
          onClick={() => setCurrentIndex(0)} 
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest"
        >
          <RotateCcw size={16} /> Refresh Feed
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div className="relative w-full h-[520px] sm:h-[580px]">
        {/* Decorative background stack */}
        <div className="absolute top-6 left-[10%] w-[80%] h-[90%] bg-slate-100 rounded-[32px] -z-20 opacity-40" />
        <div className="absolute top-3 left-[5%] w-[90%] h-[95%] bg-white rounded-[32px] -z-10 opacity-80 border border-slate-100 shadow-sm" />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoom.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ x: 500, opacity: 0, rotate: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="absolute inset-0 w-full h-full"
          >
           
            <RoomCard 
              room={currentRoom} 
              onOpenDetails={() => onOpenDetails(currentRoom)} 
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-8 mt-10">
        <button 
          onClick={(e) => handleAction(e, 'dislike')}
          className="w-16 h-16 rounded-full bg-white border border-slate-100 flex items-center justify-center text-rose-500 shadow-xl active:scale-90 transition-transform"
        >
          <X size={28} strokeWidth={3} />
        </button>
        
        <button 
          onClick={(e) => handleAction(e, 'like')}
          className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-2xl active:scale-90 transition-transform shadow-indigo-200"
        >
          <Heart size={36} fill="white" strokeWidth={0} />
        </button>
      </div>
    </div>
  );
};

export default SwipeInterface;