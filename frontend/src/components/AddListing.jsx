import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, IndianRupee, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

const AddListing = () => {
  const { addNewListing } = useApp();
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    type: 'Single',
    amenities: [],
    contact: ''
  });

  const amenitiesList = [
    { name: 'WiFi', icon: '📶' }, { name: 'Meals', icon: '🍲' },
    { name: 'AC', icon: '❄️' }, { name: 'Laundry', icon: '🧺' }
  ];

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
   
    const newProperty = {
      ...formData,
      id: Date.now(),
      rent: formData.price, 
      image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", 
      rating: "New",
      distance: "Just Added",
    };

    addNewListing(newProperty);
    setIsSubmitted(true);
    
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ title: '', price: '', location: '', type: 'Single', amenities: [], contact: '' });
    }, 3000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-200">
          <CheckCircle2 size={40} />
        </motion.div>
        <h2 className="text-3xl font-black text-slate-900">Listing Live!</h2>
        <p className="text-slate-500 mt-2">Available in student feeds now.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto pb-32 pt-6 px-4">
      <header className="mb-10">
        <div className="p-2.5 bg-indigo-600 w-fit text-white rounded-2xl mb-4 shadow-lg shadow-indigo-100">
          <Building2 size={24} />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Post Property</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Title</label>
          <input 
            className="w-full bg-slate-50 rounded-2xl py-4 px-5 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none"
            placeholder="Ex: Modern Studio"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
          />
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Rent</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-4 text-slate-300" size={16}/>
                <input 
                  type="number"
                  className="w-full bg-slate-50 rounded-2xl py-4 pl-10 px-5 text-sm font-bold outline-none"
                  placeholder="8500"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-slate-300" size={16}/>
                <input 
                  className="w-full bg-slate-50 rounded-2xl py-4 pl-10 px-5 text-sm font-bold outline-none"
                  placeholder="Sector 12"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 border border-slate-200/60">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {amenitiesList.map(a => (
              <button 
                key={a.name} type="button"
                onClick={() => handleAmenityChange(a.name)}
                className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-all ${formData.amenities.includes(a.name) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-100'}`}
              >
                {a.icon} {a.name}
              </button>
            ))}
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl"
        >
          Launch Listing
        </motion.button>
      </form>
    </div>
  );
};

export default AddListing;