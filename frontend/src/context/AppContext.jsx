import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [properties] = useState([
    {
      id: 1,
      title: "Premium Studio Apartment",
      price: "15000",
      location: "North Campus",
      type: "Single Room",
      amenities: ["WiFi", "AC", "Laundry"],
      img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      matchScore: 95,
      distance: "0.2"
    },
    {
      id: 2,
      title: "Modern Shared Suite",
      price: "8500",
      location: "East Wing",
      type: "Double Sharing",
      amenities: ["Meals", "WiFi", "Cleaning"],
      img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      matchScore: 88,
      distance: "0.5"
    }
  ]);

  
  const [userData, setUserData] = useState({
    name: "Aryan Sharma",
    college: "IIT Delhi",
    year: "Class of '26",
    role: "student", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan"
  });

  
  const toggleRole = () => {
    setUserData(prev => ({
      ...prev,
      role: prev.role === 'landlord' ? 'student' : 'landlord'
    }));
  };

  
  const [chats] = useState([
   
    {
      id: 1,
      name: "Skyview Heights",
      msg: "Your application for the Studio was approved!",
      time: "2m ago",
      unread: true,
      score: 98,
      targetRole: "student", 
      propertyInterestedIn: "Premium Studio"
    },
    {
      id: 101,
      name: "East Wing Manager",
      msg: "When would you like to come for a tour?",
      time: "5h ago",
      unread: false,
      targetRole: "student", //
      propertyInterestedIn: "Modern Shared Suite"
    },

   
    {
      id: 2,
      name: "Ishita Gupta",
      msg: "When can I move in? I'm ready to pay the deposit.",
      time: "15m ago",
      unread: true,
      score: 92,
      targetRole: "landlord", 
      propertyInterestedIn: "Unit 402-A"
    },
    {
      id: 3,
      name: "Rahul Verma",
      msg: "Is the security deposit refundable after 6 months?",
      time: "1h ago",
      unread: false,
      score: 85,
      targetRole: "landlord", 
      propertyInterestedIn: "Unit 104"
    },
    {
      id: 4,
      name: "Sneha Kapoor",
      msg: "Interested in the Modern Shared Suite!",
      time: "3h ago",
      unread: false,
      score: 78,
      targetRole: "landlord", 
      propertyInterestedIn: "Unit 202-B"
    }
  ]);


  const [userPriorities, setUserPriorities] = useState([
    { id: 'dist', label: "Distance", icon: "📍" },
    { id: 'price', label: "Price", icon: "💰" }
  ]);

  return (
    <AppContext.Provider value={{ 
      properties, 
      userData, 
      setUserData, 
      toggleRole, 
      chats, 
      userPriorities, 
      setUserPriorities 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};