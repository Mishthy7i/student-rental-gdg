import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Divider,
  CircularProgress,
  Stack,
  Card,
  CardActionArea,
  CardContent
} from '@mui/material';
import { Google as GoogleIcon, Email as EmailIcon, Lock as LockIcon, School as SchoolIcon, Home as HomeIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, signInWithEmail, signUpWithEmail, user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState('role'); // 'role' or 'auth'
  const [selectedRole, setSelectedRole] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated and onboarded
  useEffect(() => {
    if (!authLoading && user) {
      if (user.is_onboarded) {
        navigate('/home');
      } else {
        // Redirect to appropriate onboarding
        const onboardingPath = user.role === 'landlord' ? '/onboarding/landlord' : '/onboarding/student';
        navigate(onboardingPath);
      }
    }
  }, [user, authLoading, navigate]);

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // For sign-up, always require selected role
      if (isSignUp && !selectedRole) {
        showToast('Please select a role first', 'warning');
        setLoading(false);
        return;
      }
      
      // For sign-in, pass null for role (will be fetched from Firestore)
      // For sign-up, pass the selected role
      const role = isSignUp ? selectedRole : null;
      await loginWithGoogle(role, isSignUp);
      // Navigation will be handled by auth state change and onboarding check
    } catch (error) {
      showToast(error.message || 'Failed to sign in with Google', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      showToast('Please fill in all required fields', 'warning');
      setLoading(false);
      return;
    }

    if (isSignUp && !displayName) {
      showToast('Please enter your name', 'warning');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        if (!selectedRole) {
          showToast('Please select a role first', 'warning');
          setLoading(false);
          return;
        }
        await signUpWithEmail(email, password, displayName, selectedRole);
        showToast('Account created successfully!', 'success');
      } else {
        await signInWithEmail(email, password);
        showToast('Signed in successfully!', 'success');
      }
      // Navigation will be handled by auth state change and onboarding check
    } catch (error) {
      let errorMessage = 'Authentication failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.message) {
        errorMessage = error.message;
      }
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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

  // Role selection step
  if (step === 'role') {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 4
          }}
        >
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Welcome!
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Choose how you want to continue
            </Typography>

            <Stack spacing={2}>
              <Card
                variant="outlined"
                sx={{
                  border: selectedRole === 'student' ? 2 : 1,
                  borderColor: selectedRole === 'student' ? 'primary.main' : 'divider',
                  bgcolor: selectedRole === 'student' ? 'primary.50' : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              >
                <CardActionArea
                  onClick={() => setSelectedRole('student')}
                  sx={{ p: 3 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: selectedRole === 'student' ? 'primary.main' : 'primary.100',
                        color: selectedRole === 'student' ? 'white' : 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <SchoolIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Continue as Student
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Find your perfect rental accommodation
                      </Typography>
                    </Box>
                  </Stack>
                </CardActionArea>
              </Card>

              <Card
                variant="outlined"
                sx={{
                  border: selectedRole === 'landlord' ? 2 : 1,
                  borderColor: selectedRole === 'landlord' ? 'primary.main' : 'divider',
                  bgcolor: selectedRole === 'landlord' ? 'primary.50' : 'background.paper',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: 2
                  }
                }}
              >
                <CardActionArea
                  onClick={() => setSelectedRole('landlord')}
                  sx={{ p: 3 }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: selectedRole === 'landlord' ? 'primary.main' : 'primary.100',
                        color: selectedRole === 'landlord' ? 'white' : 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <HomeIcon sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Continue as Landlord
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        List your properties and connect with students
                      </Typography>
                    </Box>
                  </Stack>
                </CardActionArea>
              </Card>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  if (selectedRole) {
                    setStep('auth');
                    setIsSignUp(true);
                  }
                }}
                disabled={!selectedRole}
                sx={{ py: 1.5, mt: 2 }}
              >
                Continue
              </Button>

              <Box textAlign="center" sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setStep('auth');
                      setIsSignUp(false);
                      setSelectedRole(null); // Clear role selection for sign-in
                    }}
                  >
                    Sign In
                  </Button>
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Container>
    );
  }

  // Authentication step
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          {isSignUp && selectedRole && (
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                setStep('role');
                setEmail('');
                setPassword('');
                setDisplayName('');
              }}
              sx={{ mb: 2, textTransform: 'none' }}
            >
              Change Role
            </Button>
          )}

          <Typography variant="h4" component="h1" gutterBottom align="center">
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
            {isSignUp 
              ? `Create your ${selectedRole === 'student' ? 'student' : 'landlord'} account` 
              : 'Welcome back! Please sign in to continue'}
          </Typography>

          {isSignUp && selectedRole && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'primary.50',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              {selectedRole === 'student' ? (
                <SchoolIcon color="primary" />
              ) : (
                <HomeIcon color="primary" />
              )}
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Signing up as {selectedRole === 'student' ? 'Student' : 'Landlord'}
              </Typography>
            </Box>
          )}

          <Stack spacing={2}>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleAuth}
              disabled={loading || (isSignUp && !selectedRole)}
              sx={{ py: 1.5 }}
            >
              {isSignUp ? 'Sign up with Google' : 'Sign in with Google'}
            </Button>

            <Divider>or</Divider>

            <Box component="form" onSubmit={handleEmailAuth}>
              <Stack spacing={2}>
                {isSignUp && (
                  <TextField
                    label="Full Name"
                    type="text"
                    fullWidth
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={loading}
                    required
                  />
                )}

                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />

                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  InputProps={{
                    startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={loading || (isSignUp && !selectedRole)}
                  sx={{ py: 1.5, mt: 2 }}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    isSignUp ? 'Sign Up' : 'Sign In'
                  )}
                </Button>
              </Stack>
            </Box>

            <Box textAlign="center" sx={{ mt: 2 }}>
              <Typography variant="body2">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setEmail('');
                    setPassword('');
                    setDisplayName('');
                    if (!isSignUp) {
                      // If switching to sign-up, go back to role selection
                      setStep('role');
                      setSelectedRole(null);
                    } else {
                      // If switching to sign-in, clear role selection
                      setSelectedRole(null);
                    }
                  }}
                  disabled={loading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </Button>
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;

