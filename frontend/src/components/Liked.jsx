import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap, HeartOff } from 'lucide-react';

const Liked = ({ rooms = [] }) => {
  if (rooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-8">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <HeartOff className="text-slate-300" size={32} />
        </div>
        <h2 className="text-xl font-black text-slate-900">No Liked PGs yet</h2>
        <p className="text-slate-500 text-sm mt-2">Swipe right on rooms you love to see them here.</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex items-center justify-between mb-6 px-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Saved Places</h2>
        <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
          {rooms.length} Units
        </span>
      </div>

    
      <div className="grid grid-cols-2 gap-4">
        {rooms.map((room, index) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white rounded-[24px] overflow-hidden border border-slate-100 shadow-sm active:scale-95 transition-transform"
          >
         
            <div className="relative h-32 w-full bg-slate-100">
              <img 
                src={room.img} 
                className="w-full h-full object-cover" 
                alt={room.type} 
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm">
                <Zap size={10} className="text-yellow-500 fill-yellow-500" />
              </div>
            </div>

       
            <div className="p-3">
              <div className="flex flex-col">
                <span className="text-indigo-600 font-black text-sm tracking-tighter italic">₹{room.price}</span>
                <h3 className="text-slate-800 font-bold text-[13px] leading-tight truncate mt-0.5">
                  {room.type}
                </h3>
              </div>
              
              <div className="flex items-center gap-1 mt-2 text-slate-400">
                <MapPin size={10} />
                <span className="text-[10px] font-medium">{room.distance}km</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Liked;