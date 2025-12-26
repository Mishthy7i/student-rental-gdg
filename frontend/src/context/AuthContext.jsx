import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Google Auth Provider
  const googleProvider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get Firebase ID token
        const idToken = await user.getIdToken();
        setToken(idToken);
        setUser({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          role: 'student' // Default role, can be updated after onboarding
        });
        
        // Check onboarding status
        try {
          const response = await fetch('http://localhost:8000/onboard/status', {
            headers: {
              'Authorization': `Bearer ${idToken}`
            }
          });
          const data = await response.json();
          setHasOnboarded(data.is_onboarded);
          
          if (data.user_data?.role) {
            setUser(prev => ({ ...prev, role: data.user_data.role }));
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
        }
      } else {
        setUser(null);
        setToken(null);
        setHasOnboarded(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
  };

  const getAuthToken = async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginWithGoogle, 
      logout, 
      hasOnboarded, 
      completeOnboarding,
      loading,
      token,
      getAuthToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);