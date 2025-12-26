import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext'; 
import { mockRooms as initialRooms } from '../data/mockRooms';

import SwipeInterface from '../components/SwipeInterface';
import Liked from '../components/Liked';
import AddListing from '../components/AddListing';
import Messages from '../components/Messages';
import Profile from '../components/Profile';
import BottomNav from '../components/BottomNav';
import MatchModal from '../components/MatchModal';
import PropertyDetails from '../components/PropertyDetails';
import ChatInterface from '../components/ChatInterface';
 
import { Bell, Sparkles } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const { userData } = useApp(); 
  
  
  const [activeTab, setActiveTab] = useState(user?.role === 'landlord' ? 'add' : 'home');
  const [allRooms, setAllRooms] = useState(initialRooms); 
  const [likedRooms, setLikedRooms] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
 
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [recentMatchedRoom, setRecentMatchedRoom] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Chat State
  const [chatState, setChatState] = useState({
    isOpen: false,
    activeRoom: null
  });

  const handleOpenChat = (room) => {
    setChatState({ isOpen: true, activeRoom: room });
  };

  const handleOpenDetails = (room) => {
    setSelectedRoom(room);
    setIsDetailsOpen(true);
  };

  const handleLike = (room) => {
    if (!likedRooms.find((r) => r.id === room.id)) {
      setLikedRooms((prev) => [...prev, room]);
      setRecentMatchedRoom(room);
      setShowMatchModal(true);

      const newNotification = {
        id: Date.now(),
        name: room.landlordName || "Property Manager",
        msg: `Match Found! You're a ${room.matchScore}% fit.`,
        time: "Just now",
        unread: true
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const addNewListing = (newRoom) => {
    const roomWithMetadata = {
      ...newRoom,
      id: Date.now(),
      matchScore: 95,
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=2070",
      landlordName: userData.name,
      distance: "0.8"
    };
    setAllRooms([roomWithMetadata, ...allRooms]);
    setActiveTab('profile');
  };

  
  const initials = userData?.name 
    ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() 
    : user?.displayName?.charAt(0) || 'U';

  const renderView = () => {
    const role = user?.role || 'student';
    const views = {
      landlord: {
        add: <AddListing onAdd={addNewListing} />,
        chat: <Messages localChats={notifications} userRole="landlord" />,
        profile: <Profile />
      },
      student: {
        home: <SwipeInterface 
                rooms={allRooms} 
                onLike={handleLike} 
                onOpenDetails={handleOpenDetails} 
              />,
        liked: <Liked rooms={likedRooms} />,
        chat: <Messages localChats={notifications} userRole="student" />,
        profile: <Profile />
      }
    };
    const roleViews = views[role];
    return roleViews[activeTab] || roleViews[Object.keys(roleViews)[0]];
  };

  return (
    <div className="min-h-screen bg-[#FDFDFF] flex flex-col font-sans antialiased text-slate-900 selection:bg-indigo-100 relative">
      
    
      <MatchModal 
        isOpen={showMatchModal} 
        onClose={() => setShowMatchModal(false)} 
        room={recentMatchedRoom}
        user={user}
        onOpenChat={handleOpenChat} 
      />

      <PropertyDetails 
        isOpen={isDetailsOpen} 
        onClose={() => setIsDetailsOpen(false)} 
        room={selectedRoom} 
        onOpenChat={handleOpenChat}
      />

      <ChatInterface 
        isOpen={chatState.isOpen}
        onClose={() => setChatState({ ...chatState, isOpen: false })}
        room={chatState.activeRoom}
      />

      
      <div className="fixed inset-0 bg-[radial-gradient(at_top_right,rgba(99,102,241,0.03),transparent_50%),radial-gradient(at_top_left,rgba(59,130,246,0.03),transparent_50%)] pointer-events-none" />
   
      <header className="sticky top-0 z-[100] px-6 py-4 flex justify-between items-center bg-white/70 backdrop-blur-xl border-b border-slate-100/80">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Sparkles size={20} className="text-white fill-white" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">SmartStay</h1>
          </div>
          <span className="text-[10px] font-black tracking-[0.2em] text-indigo-500 uppercase mt-1 pl-1">
            {user?.role === 'landlord' ? 'Owner Portal' : 'Smart Student Housing'}
          </span>
        </div>

        <div className="flex items-center gap-3">
       
          <button 
            onClick={() => setActiveTab('chat')}
            className="p-2.5 bg-white border border-slate-100 shadow-sm rounded-2xl text-slate-500 relative hover:text-indigo-600 transition-all active:scale-90"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>
          
         
          <button 
            onClick={() => setActiveTab('profile')}
            className="group p-0.5 rounded-2xl bg-gradient-to-tr from-slate-200 to-white shadow-sm active:scale-95 transition-all"
          >
            <div className="w-10 h-10 rounded-[14px] bg-indigo-600 border border-white flex items-center justify-center overflow-hidden shadow-inner group-hover:rotate-3 transition-transform">
               {user?.photoURL ? (
                 <img src={user.photoURL} alt="profile" className="w-full h-full object-cover" />
               ) : (
                 <span className="font-black text-white text-sm tracking-tighter">{initials}</span>
               )}
            </div>
          </button>
        </div>
      </header>

  
      <main className="flex-1 relative z-10 px-4 pb-32 pt-4 flex justify-center w-full">
        <div className="w-full max-w-md">
          {renderView()}
        </div>
      </main>

 
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-48px)] max-w-sm">
         <div className="bg-slate-900/95 backdrop-blur-2xl rounded-[32px] p-2.5 shadow-2xl shadow-slate-900/40 border border-white/10">
            <BottomNav 
              value={activeTab} 
              setValue={setActiveTab} 
              userRole={user?.role} 
            />
         </div>
      </nav>
    </div>
  );
};

export default Home;