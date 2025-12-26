import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Target, 
  Layers, 
  Zap, 
  ShieldCheck, 
  ChevronDown,
  MessageSquare,
  Sparkles
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleStart = (role = "student") => {
    navigate("/login", { state: { role } });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-slate-900 selection:bg-indigo-100">
      
      {/* 1. HEADER - Mobile App Style */}
      <header className="px-6 py-5 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
            <Zap size={18} className="text-white fill-current" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            SmartStay
          </h1>
        </div>
        <button
          onClick={() => handleStart("landlord")}
          className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 py-1.5 border border-slate-100 rounded-full hover:border-indigo-600 hover:text-indigo-600 transition-all"
        >
          Are you a Landlord?
        </button>
      </header>

      {/* 2. HERO SECTION */}
      <main className="px-6 pt-16 pb-20 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-8">
          <Sparkles size={12} /> 100% Student-First Platform
        </div>
        
        <h2 className="text-5xl font-black leading-[1.05] tracking-tighter text-slate-900 mb-6">
          Find Your Room <br />
          <span className="text-indigo-600 italic">By Priority.</span>
        </h2>

        <p className="text-lg text-slate-600 font-medium leading-relaxed max-w-xs mb-10">
          The first housing app that ranks rooms based on your commute, budget, and lifestyle.
        </p>

        <button
          onClick={() => handleStart("student")}
          className="w-full max-w-sm bg-slate-900 text-white font-black text-lg py-5 rounded-2xl shadow-xl shadow-slate-200 active:scale-95 transition-transform flex items-center justify-center gap-3"
        >
          Get Started <ArrowRight size={22} />
        </button>

        <button 
          onClick={() => document.getElementById('benefits').scrollIntoView({ behavior: 'smooth' })}
          className="mt-8 flex flex-col items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]"
        >
          Explore More
          <ChevronDown size={16} className="animate-bounce" />
        </button>
      </main>

      {/* 3. BENEFITS SECTION - The "Why" (Now Above the Process) */}
      <section id="benefits" className="px-6 py-24 bg-slate-50 rounded-t-[48px]">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-2">
              The Advantage
            </h3>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">
              Built for the modern <br/> student struggle.
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Verified Safety</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Every listing is physically verified. No fake photos or ghost locations.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Save 20+ Hours</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Our priority engine filters out the noise automatically based on your needs.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-[32px] bg-white border border-slate-100 shadow-sm">
              <div className="flex items-start gap-5">
                <div className="shrink-0 w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 mb-1">Zero Brokerage</h4>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Talk directly to owners. No middleman, no commission, no hidden fees.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS SECTION - The Process */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-md mx-auto">
          <div className="mb-16 text-center md:text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">
              The Process
            </h3>
            <h2 className="text-3xl font-black tracking-tighter">
              Simple 3-step <br /> matching.
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100" />

            <div className="relative flex gap-6 mb-12">
              <div className="relative z-10 w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-sm font-black text-slate-900">01</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Set Your Priorities</h4>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                  Rank distance, budget, and amenities. We build your profile instantly.
                </p>
              </div>
            </div>

            <div className="relative flex gap-6 mb-12">
              <div className="relative z-10 w-12 h-12 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                <span className="text-sm font-black text-slate-900">02</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Swipe Through Matches</h4>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                  View high-match rooms first. Swipe right to save your favorites.
                </p>
              </div>
            </div>

            <div className="relative flex gap-6">
              <div className="relative z-10 w-12 h-12 bg-indigo-600 border-2 border-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-100">
                <span className="text-sm font-black text-white">03</span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Move In Faster</h4>
                <p className="text-sm text-slate-500 font-medium mt-1 leading-relaxed">
                  Connect with landlords directly and close your stay in minutes.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-20 p-8 bg-slate-900 rounded-[40px] text-center shadow-2xl shadow-slate-300">
              <p className="text-indigo-300 font-black text-[10px] uppercase tracking-[0.2em] mb-4">Start your journey</p>
              <h3 className="text-white text-2xl font-black italic tracking-tighter mb-8">Ready to find home?</h3>
              <button 
                onClick={() => handleStart()}
                className="w-full bg-white text-slate-900 font-black py-4 rounded-2xl active:scale-95 transition-transform"
              >
                Join Now
              </button>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-12 px-6 text-center border-t border-slate-50">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">
          SmartStay © 2025. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;