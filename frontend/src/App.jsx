import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProviderWrapper } from './context/ThemeContext';
import { AppProvider } from './context/AppContext'; 
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProviderWrapper>
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProviderWrapper>
  );
}

export default App;