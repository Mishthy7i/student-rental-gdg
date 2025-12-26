import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);

  const login = (role) => {
  
    setUser({ 
      name: role === 'landlord' ? "Landlord Partner" : "XYZ", 
      email: role === 'landlord' ? "owner@rentals.com" : "student@college.edu",
      photo: "https://via.placeholder.com/150",
      role: role 
    });
  };

  const logout = () => {
    setUser(null);
    setHasOnboarded(false);
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasOnboarded, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);