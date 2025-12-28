import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  LinearProgress,
  Stack,
  TextField,
  Chip,
  Slider,
  Card,
  CardActionArea,
  Grid,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  const [formData, setFormData] = useState({
    college: 'Madhav Institute of Technology and Science, Gwalior',
    budget: [8000, 15000],
    roomTypes: [],
    priorities: [
      { id: 'dist', label: 'Distance to college', icon: '📍' },
      { id: 'price', label: 'Price range', icon: '💰' },
      { id: 'safe', label: 'Safety & reviews', icon: '🛡️' },
      { id: 'amen', label: 'Amenities (WiFi, AC)', icon: '📶' }
    ]
  });

  // Function to submit onboarding data
  const submitOnboarding = async () => {
    if (!user) return;

    setSubmitting(true);

    try {
      const onboardingData = {
        college: formData.college,
        min_budget: formData.budget[0],
        max_budget: formData.budget[1],
        preferred_room_types: formData.roomTypes,
        priorities: formData.priorities.map(p => ({ id: p.id, label: p.label })),
        max_distance_km: 10.0
      };

      await completeOnboarding(onboardingData);
      showToast('Onboarding completed successfully!', 'success');
      setTimeout(() => navigate('/home'), 800);
    } catch (error) {
      console.error('Onboarding error:', error);
      showToast(error.message || 'Failed to complete onboarding', 'error');
      setSubmitting(false);
    }
  };

  // Step 5: The "Smart" Calculation Simulation
  useEffect(() => {
    if (step === 5) {
      const interval = setInterval(() => {
        setMatchingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            submitOnboarding();
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Box key="s1">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              Your College 🎓
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              This app is exclusively for MITS Gwalior students
            </Typography>
            <Box
              sx={{
                p: 3,
                bgcolor: 'primary.50',
                borderRadius: 3,
                border: '2px solid',
                borderColor: 'primary.main',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main', mb: 1 }}>
                Madhav Institute of Technology and Science
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Gwalior, Madhya Pradesh, India
              </Typography>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box key="s2">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              Set your budget 💸
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>
              Find the perfect balance of comfort and cost.
            </Typography>
            <Box sx={{ p: 4, bgcolor: 'primary.50', borderRadius: 3, textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
                ₹{formData.budget[0].toLocaleString()} - ₹{formData.budget[1].toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800 }}>
                MONTHLY RANGE
              </Typography>
            </Box>
            <Slider
              value={formData.budget}
              onChange={(e, val) => setFormData({ ...formData, budget: val })}
              min={5000}
              max={35000}
              step={1000}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
            />
          </Box>
        );

      case 3:
        return (
          <Box key="s3">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 3 }}>
              Room preference 🏠
            </Typography>
            <Grid container spacing={2}>
              {['Single Room', 'Shared PG', 'Private Flat'].map(type => {
                const selected = formData.roomTypes.includes(type);
                return (
                  <Grid item xs={12} key={type}>
                    <Card
                      variant="outlined"
                      onClick={() => setFormData({ ...formData, roomTypes: [type] })}
                      sx={{
                        borderColor: selected ? 'primary.main' : 'divider',
                        bgcolor: selected ? 'primary.50' : 'background.paper',
                        borderWidth: selected ? 2 : 1,
                        cursor: 'pointer',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                    >
                      <CardActionArea sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" sx={{ fontWeight: 800 }}>
                          {type}
                        </Typography>
                        {selected && <CheckCircleIcon color="primary" />}
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        );

      case 4:
        return (
          <Box key="s4">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
              Priorities 📊
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              Drag to reorder your priorities (top priority first)
            </Typography>
            <Stack spacing={2}>
              {formData.priorities.map((item, index) => (
                <Card
                  key={item.id}
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' }
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ fontSize: '1.5rem' }}>{item.icon}</Box>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>
                      {item.label}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 900 }}>
                    #{index + 1}
                  </Typography>
                </Card>
              ))}
            </Stack>
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 2 }}>
              <Typography variant="caption" color="info.dark">
                Note: Priority reordering will be available in a future update. Current order will be used.
              </Typography>
            </Box>
          </Box>
        );

      case 5:
        return (
          <Box key="s5" sx={{ textAlign: 'center', pt: 8 }}>
            <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mb: 4 }}>
              <CircularProgress
                variant="determinate"
                value={matchingProgress}
                size={120}
                thickness={4}
                sx={{ position: 'absolute' }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  {Math.round(matchingProgress)}%
                </Typography>
              </Box>
            </Box>
            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 900, mb: 1 }}>
              Analyzing Stays...
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              Customizing your Smart Student Dashboard
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  if (authLoading || !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fcfdfe', pb: 12 }}>
      <Container maxWidth="xs" sx={{ pt: 6 }}>
        {step < 5 && (
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: 'primary.main' }}>
                STEP {step} OF 4
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                SMART MATCH
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(step / 4) * 100}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}

        {renderStep()}

        {step < 5 && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              p: 3,
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
              zIndex: 1000
            }}
          >
            <Container maxWidth="xs" sx={{ p: 0 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {step > 1 && (
                  <Button
                    onClick={prevStep}
                    startIcon={<ArrowBackIcon />}
                    sx={{ textTransform: 'none', fontWeight: 800 }}
                  >
                    Back
                  </Button>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  onClick={nextStep}
                  sx={{
                    py: 2,
                    borderRadius: 4,
                    textTransform: 'none',
                    fontWeight: 900,
                    fontSize: '1rem'
                  }}
                >
                  {step === 4 ? 'Find My Smart Home' : 'Continue'}
                </Button>
              </Stack>
            </Container>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StudentOnboarding;

