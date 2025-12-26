import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

import LandingPage from '../pages/LandingPage';
import Login from '../pages/Login';
import Onboarding from '../pages/Onboarding';
import Home from '../pages/Home';
import Profile from "../components/Profile";

const AppRoutes = () => {
  const { user, hasOnboarded, loading } = useAuth();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<LandingPage />} />
      
      <Route path="/login" element={!user ? <Login /> : (
        hasOnboarded ? <Navigate to="/home" /> : <Navigate to="/onboarding" />
      )} />

      {/* Protected routes */}
      <Route 
        path="/onboarding" 
        element={user && !hasOnboarded ? <Onboarding /> : (
          user ? <Navigate to="/home" /> : <Navigate to="/login" />
        )} 
      />

      <Route 
        path="/home" 
        element={user ? (
          hasOnboarded ? <Home /> : <Navigate to="/onboarding" />
        ) : <Navigate to="/login" />} 
      />

      <Route 
        path="/profile" 
        element={user ? <Profile /> : <Navigate to="/login" />} 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;