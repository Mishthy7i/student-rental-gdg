import React from 'react';
import { motion } from 'framer-motion';
import { Home, Heart, MessageSquare, User, PlusCircle } from 'lucide-react';

const BottomNav = ({ value, setValue, userRole }) => {
  const navItems = [
    { id: 'home', label: 'Explore', icon: <Home size={22} />, show: userRole === 'student' },
    { id: 'liked', label: 'Liked', icon: <Heart size={22} />, show: userRole === 'student' },
    { id: 'add', label: 'Listings', icon: <PlusCircle size={22} />, show: userRole === 'landlord' },
    { id: 'chat', label: 'Chat', icon: <MessageSquare size={22} />, show: true },
    { id: 'profile', label: 'Profile', icon: <User size={22} />, show: true },
  ].filter(item => item.show);

  return (
    
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4">
      <div className="w-[92%] max-w-md">
     
        <nav className="relative flex items-center justify-around bg-white/90 backdrop-blur-xl border border-slate-200/50 h-18 rounded-[28px] px-2 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          
          {navItems.map((item) => {
            const isActive = value === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setValue(item.id)}
                className="relative flex flex-col items-center justify-center flex-1 h-full outline-none transition-all"
              >
           
                {isActive && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-y-2 inset-x-1 bg-indigo-50 rounded-[20px] -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}

                {/* Icon */}
                <div className={`${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {item.icon}
                </div>

            
                <span 
                  className={`text-[9px] font-black uppercase tracking-tighter mt-1 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>

            
                {isActive && (
                  <motion.div 
                    layoutId="activeDot"
                    className="absolute bottom-1.5 w-1 h-1 bg-indigo-600 rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;