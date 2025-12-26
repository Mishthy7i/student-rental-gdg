import React, { useState } from 'react';
import { Box, Button, Typography, Container, TextField, Divider, IconButton, Stack, InputAdornment, Alert } from '@mui/material';
import { Google as GoogleIcon, ArrowBackIosNew as ArrowBackIcon, MailOutline, LockOutlined, PersonOutline } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithGoogle, user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const intendedRole = location.state?.role || 'student';

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      await loginWithGoogle();
      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        // Create account
        const result = await createUserWithEmailAndPassword(auth, email, password);
        // Update profile with display name
        await updateProfile(result.user, {
          displayName: fullName
        });
      } else {
        // Sign in
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pt: 2, pb: 4 }}>
     
      <Box sx={{ position: 'fixed', top: -100, left: -100, w: 300, h: 300, bgcolor: 'primary.main', opacity: 0.05, filter: 'blur(100px)', borderRadius: '50%', zIndex: -1 }} />

     
      <Box sx={{ mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/')} 
          sx={{ 
            bgcolor: 'white', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'grey.100',
            '&:hover': { bgcolor: 'grey.50' }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 18, ml: 0.5 }} />
        </IconButton>
      </Box>


      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.03em', mb: 1 }}>
          {isSignUp ? "Create Account" : "Welcome back!"}
        </Typography>
        <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
          Experience smart housing as a <Box component="span" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>{intendedRole}</Box>
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Stack spacing={2.5}>
        
        <Button
          fullWidth
          variant="contained"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleAuth}
          disabled={loading}
          sx={{
            py: 2,
            borderRadius: 4,
            bgcolor: 'white',
            color: 'text.primary',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            border: '1px solid',
            borderColor: 'grey.200',
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 700,
            '&:hover': { bgcolor: 'grey.50', boxShadow: '0 6px 24px rgba(0,0,0,0.08)' }
          }}
        >
          {isSignUp ? "Join with Google" : "Continue with Google"}
        </Button>

        <Divider sx={{ my: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>or</Typography>
        </Divider>

        {/* Email Form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? 'signup' : 'login'}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <form onSubmit={handleEmailAuth}>
              <Stack spacing={2}>
                {isSignUp && (
                  <TextField 
                    fullWidth 
                    placeholder="Full Name" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><PersonOutline sx={{ color: 'text.disabled' }} /></InputAdornment>,
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'grey.50', border: 'none' } }} 
                  />
                )}
                
                <TextField 
                  fullWidth 
                  type="email"
                  placeholder="College Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><MailOutline sx={{ color: 'text.disabled' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'grey.50' } }} 
                />
                
                <TextField 
                  fullWidth 
                  placeholder="Password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: 'text.disabled' }} /></InputAdornment>,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: 'grey.50' } }} 
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  disabled={loading}
                  sx={{ 
                    py: 2, 
                    borderRadius: 4, 
                    textTransform: 'none', 
                    fontWeight: 900, 
                    fontSize: '1rem',
                    boxShadow: '0 12px 24px rgba(99, 102, 241, 0.25)',
                    mt: 1
                  }}
                >
                  {loading ? 'Please wait...' : (isSignUp ? "Create My Account" : "Sign In")}
                </Button>
              </Stack>
            </form>
          </motion.div>
        </AnimatePresence>

       
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            {isSignUp ? "Already a member?" : "New to SmartStay?"}{" "}
            <Button 
              variant="text" 
              onClick={() => setIsSignUp(!isSignUp)}
              sx={{ 
                textTransform: 'none', 
                fontWeight: 800, 
                color: 'primary.main',
                p: 0, 
                minWidth: 0, 
                ml: 0.5,
                '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
              }}
            >
              {isSignUp ? "Sign in" : "Create account"}
            </Button>
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default Login;