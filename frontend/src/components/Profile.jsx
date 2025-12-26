import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { 
  User, ShieldCheck, Bell, HelpCircle, LogOut, 
  Settings, ChevronRight, GripVertical, Plus, CreditCard,
  MapPin, Mail, Lock, EyeOff, Building2, Star, TrendingUp
} from 'lucide-react';

const Profile = () => {
  const { userPriorities, userData } = useApp();
  const { logout, user } = useAuth();
  
  
  const isLandlord = user?.role === 'landlord';
  
  const [notifications, setNotifications] = useState(true);
  const [incognito, setIncognito] = useState(false);

  const initials = userData?.name
    ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : "US";

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans antialiased text-slate-900">
      
  
      <div className="bg-white px-6 pt-14 pb-8 border-b border-slate-200/60 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="relative">
           
            <div className={`w-20 h-20 rounded-[28px] flex items-center justify-center shadow-xl ring-4 ring-slate-50 bg-gradient-to-br ${isLandlord ? 'from-emerald-600 to-teal-700' : 'from-indigo-600 to-violet-700'}`}>
              <span className="text-2xl font-black text-white tracking-tighter">{initials}</span>
            </div>
            <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-4 border-white shadow-md ${isLandlord ? 'bg-amber-500' : 'bg-emerald-500'}`}>
              {isLandlord ? <Star size={14} className="text-white" fill="currentColor" /> : <ShieldCheck size={14} className="text-white" strokeWidth={3} />}
            </div>
          </div>
          <button className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors">
            <Settings size={22} />
          </button>
        </div>
        
        <div className="mt-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">{userData.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className={`px-2.5 py-0.5 rounded-md border ${isLandlord ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest">
                {isLandlord ? 'Verified Owner' : 'Verified Student'}
              </p>
            </div>
            <p className="text-xs text-slate-400 font-bold">
              • {isLandlord ? 'Property Manager' : `${userData.college} '${userData.year?.slice(-2) || '25'}`}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-6 mt-8 space-y-8">
        
     
        {isLandlord && (
          <section className="grid grid-cols-2 gap-3">
             <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors">
                <div className="p-2 bg-emerald-50 text-emerald-600 w-fit rounded-xl mb-3"><TrendingUp size={18}/></div>
                <p className="text-2xl font-black text-slate-900">42</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Leads</p>
             </div>
             <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 transition-colors">
                <div className="p-2 bg-blue-50 text-blue-600 w-fit rounded-xl mb-3"><Building2 size={18}/></div>
                <p className="text-2xl font-black text-slate-900">3</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active PGs</p>
             </div>
          </section>
        )}

        <section>
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-[11px] font-black text-slate-400 tracking-[1.5px] uppercase">
              {isLandlord ? 'My Listings' : 'Matching Priorities'}
            </h3>
            <button className="text-xs font-bold text-indigo-600 flex items-center gap-1">
              <Plus size={14} /> {isLandlord ? 'Add PG' : 'Edit'}
            </button>
          </div>
          
          <div className="space-y-2.5">
            {isLandlord ? (
              // Landlord Property Cards
              ['Skyline Residency', 'Greenwood Villa'].map((pg, i) => (
                <div key={i} className="group flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/50 shadow-sm hover:border-emerald-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden ring-1 ring-slate-100">
                       <img src={`https://picsum.photos/seed/${pg}/100`} alt="pg" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 block">{pg}</span>
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Active Listing</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                </div>
              ))
            ) : (
             
              userPriorities.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/50 shadow-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Rank {index + 1}</span>
                    <GripVertical size={16} className="text-slate-200" />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[11px] font-black text-slate-400 tracking-[1.5px] uppercase px-1">Settings</h3>
          <div className="bg-white rounded-[24px] border border-slate-200/60 overflow-hidden shadow-sm">
            <SettingRow icon={Mail} label="Email Address" value={user?.email || userData.email} />
            <Divider />
            <SettingRow icon={isLandlord ? Building2 : MapPin} label={isLandlord ? "Business Name" : "Preferred Location"} value={isLandlord ? "Aryan Realty Group" : "South Delhi"} isLast />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-[11px] font-black text-slate-400 tracking-[1.5px] uppercase px-1">App Privacy</h3>
          <div className="bg-white rounded-[24px] border border-slate-200/60 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Bell size={18}/></div>
                <span className="text-sm font-bold text-slate-700">Notifications</span>
              </div>
              <Toggle active={notifications} onClick={() => setNotifications(!notifications)} />
            </div>
            {!isLandlord && (
              <>
                <Divider />
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><EyeOff size={18}/></div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">Ghost Mode</span>
                      <span className="text-[10px] text-slate-400 font-medium italic">Hide activity from owners</span>
                    </div>
                  </div>
                  <Toggle active={incognito} onClick={() => setIncognito(!incognito)} />
                </div>
              </>
            )}
          </div>
        </section>


        <section className="space-y-3">
          <div className="bg-white rounded-[24px] border border-slate-200/60 overflow-hidden shadow-sm">
            <SettingRow icon={HelpCircle} label="Help Center" />
            <Divider />
            <SettingRow icon={Lock} label="Security & Password" isLast />
          </div>

          <button 
            onClick={logout}
            className="w-full mt-6 group flex items-center justify-between p-5 rounded-2xl bg-white border border-rose-100 shadow-sm active:scale-95 transition-all hover:bg-rose-50"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <LogOut size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-black text-slate-900">Sign Out</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Smart Stay Secure</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </section>

        <div className="py-8 text-center">
          <p className="text-[9px] font-black text-slate-300 tracking-[4px] uppercase italic">
            Smart Stay 
          </p>
        </div>
      </div>
    </div>
  );
};

const SettingRow = ({ icon: Icon, label, value, isLast }) => (
  <button className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors ${isLast ? 'rounded-b-[24px]' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="p-2 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-white"><Icon size={18}/></div>
      <div className="flex flex-col text-left">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
        {value && <span className="text-sm font-bold text-slate-700">{value}</span>}
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-300" />
  </button>
);

const Toggle = ({ active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-11 h-6 rounded-full transition-all flex items-center px-1 ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}
  >
    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const Divider = () => <div className="mx-6 border-t border-slate-50" />;

export default Profile;