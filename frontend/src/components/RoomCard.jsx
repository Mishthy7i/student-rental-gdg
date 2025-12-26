import React from 'react';
import { MapPin, Zap, Users, IndianRupee, Info } from 'lucide-react';

const RoomCard = ({ room, onOpenDetails }) => {
  if (!room) return null;

  return (
    <div 
      className="w-full h-full bg-white rounded-[32px] overflow-hidden shadow-xl border border-slate-100 flex flex-col group cursor-pointer relative"
      onClick={onOpenDetails} 
    >
      
      <div className="relative h-[65%] w-full bg-slate-200 overflow-hidden">
        <img 
          src={room.img} 
          alt={room.type} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
    
        <div className="absolute top-5 left-5 backdrop-blur-md bg-black/30 px-3 py-1.5 rounded-2xl flex items-center gap-2 border border-white/20">
          <Zap size={14} className="text-yellow-400 fill-yellow-400" />
          <span className="text-white text-[10px] font-black uppercase tracking-widest">
            {room.matchScore}% Match
          </span>
        </div>

        
        <div className="absolute top-5 right-5 p-2 bg-white/20 backdrop-blur-md rounded-full text-white border border-white/30">
          <Info size={18} />
        </div>

   
        <div className="absolute bottom-6 left-6 text-white drop-shadow-lg">
          <div className="flex items-center text-3xl font-black italic tracking-tighter leading-none">
            <IndianRupee size={24} strokeWidth={3} />
            {room.price}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90 mt-1 pl-1">Per Month</p>
        </div>

      
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
      </div>

      
      <div className="flex-1 p-6 flex flex-col justify-between bg-white relative">
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              {room.title || room.type}
            </h2>
            <div className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-lg">
              <Users size={12} className="text-indigo-600" />
              <span className="text-[10px] font-bold text-indigo-600 uppercase">Shared</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1.5 mt-3 text-slate-500">
            <MapPin size={16} className="text-indigo-500" />
            <span className="text-sm font-semibold italic">{room.distance} km from campus</span>
          </div>
        </div>

       
        <div className="flex flex-wrap gap-2 mt-4">
          {room.amenities?.slice(0, 3).map((tag) => (
            <span 
              key={tag} 
              className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 bg-slate-50 text-slate-500 rounded-xl border border-slate-100"
            >
              {tag}
            </span>
          ))}
          {room.amenities?.length > 3 && (
            <span className="text-[9px] font-black text-indigo-400 py-1.5">+ more</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;