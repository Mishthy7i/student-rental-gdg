import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Onboarding from '../pages/Onboarding';
import Home from '../pages/Home';
import Profile from "../components/Profile";

const AppRoutes = () => {
  const { user, hasOnboarded } = useAuth();

  return (
    <Routes>
      
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/login" element={!user ? <Login /> : (
        user.role === 'landlord' ? <Navigate to="/home" /> : <Navigate to="/onboarding" />
      )} />

     
      <Route 
        path="/onboarding" 
        element={user?.role === 'student' && !hasOnboarded ? <Onboarding /> : <Navigate to="/home" />} 
      />

      <Route 
        path="/home" 
        element={user ? <Home /> : <Navigate to="/login" />} 
      />

  
      <Route 
        path="/profile" 
        element={user ? <Profile /> : <Navigate to="/login" />} 
      />
      
     
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;