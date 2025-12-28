import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  LinearProgress,
  Stack,
  Card,
  CardActionArea,
  Grid,
  CircularProgress,
  Slider,
  Grow,
  Fade,
  Chip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  CurrencyRupee as RupeeIcon,
  Home as HomeIcon,
  Sort as SortIcon,
  DragIndicator as DragIndicatorIcon
} from '@mui/icons-material';
import { Reorder, useDragControls } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

// Draggable priority item component
const PriorityItem = ({ item, index }) => {
  const dragControls = useDragControls();

  return (
    <Reorder.Item 
      value={item} 
      dragListener={false}
      dragControls={dragControls}
      style={{ 
        listStyle: 'none',
        cursor: 'grab'
      }}
      whileDrag={{ 
        scale: 1.03, 
        boxShadow: '0 10px 30px rgba(79, 70, 229, 0.2)',
        cursor: 'grabbing'
      }}
    >
      <Card
        variant="outlined"
        sx={{
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderRadius: '16px', 
          border: '1px solid #E2E8F0',
          bgcolor: 'white',
          transition: 'border-color 0.2s ease',
          '&:hover': { borderColor: '#4F46E5' }
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <Box 
            onPointerDown={(e) => dragControls.start(e)}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'grab',
              color: '#94A3B8',
              touchAction: 'none',
              '&:hover': { color: '#4F46E5' },
              '&:active': { cursor: 'grabbing' }
            }}
          >
            <DragIndicatorIcon />
          </Box>
          <Box sx={{ fontSize: '1.5rem', bgcolor: '#F1F5F9', p: 1, borderRadius: '12px' }}>{item.icon}</Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B' }}>
            {item.label}
          </Typography>
        </Stack>
        <Chip 
          label={`#${index + 1}`} 
          size="small" 
          sx={{ 
            fontWeight: 700, 
            bgcolor: index === 0 ? '#4F46E5' : '#F1F5F9',
            color: index === 0 ? 'white' : '#64748B'
          }} 
        />
      </Card>
    </Reorder.Item>
  );
};

const StudentOnboarding = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [user, authLoading, navigate]);

  const [formData, setFormData] = useState({
    college: 'Madhav Institute of Technology and Science, Gwalior',
    budget: [6000, 12000],
    roomTypes: [],
    priorities: [
      { id: 'dist', label: 'Distance to college', icon: '📍' },
      { id: 'price', label: 'Price range', icon: '💰' },
      { id: 'safe', label: 'Safety & reviews', icon: '🛡️' },
      { id: 'amen', label: 'Amenities (WiFi, AC)', icon: '📶' }
    ]
  });

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
      showToast('Profile setup complete!', 'success');
      setTimeout(() => navigate('/home'), 500);
    } catch (error) {
      console.error('Onboarding error:', error);
      showToast(error.message || 'Failed to complete onboarding', 'error');
      setSubmitting(false);
    }
  };

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
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Fade in={true} timeout={400}>
            <Box>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Box sx={{
                  width: 60, height: 60, borderRadius: '50%', bg: '#EEF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2, bgcolor: '#EEF2FF', color: '#4F46E5'
                }}>
                  <SchoolIcon fontSize="large" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>
                  Confirm Your College
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B' }}>
                  We'll show you rooms closest to your campus.
                </Typography>
              </Box>

              <Card
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: 'white',
                  borderRadius: '16px',
                  border: '2px solid #4F46E5',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.1)',
                  position: 'relative',
                  overflow: 'visible'
                }}
              >
                <Box sx={{
                  position: 'absolute', top: -12, right: 20,
                  bgcolor: '#4F46E5', color: 'white', px: 1.5, py: 0.5,
                  borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700
                }}>
                  DETECTED
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                  Madhav Institute of Technology and Science
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Gwalior, Madhya Pradesh
                </Typography>
              </Card>
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true} timeout={400}>
            <Box>
              <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Box sx={{
                  width: 60, height: 60, borderRadius: '50%', bg: '#EEF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mx: 'auto', mb: 2, bgcolor: '#ECFDF5', color: '#10B981'
                }}>
                  <RupeeIcon fontSize="large" />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>
                  Set Your Budget
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B' }}>
                  How much are you planning to spend monthly?
                </Typography>
              </Box>

              <Box sx={{
                p: 4,
                bgcolor: 'white',
                borderRadius: '24px',
                textAlign: 'center',
                mb: 6,
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: '#1E293B', mb: 0.5 }}>
                  ₹{formData.budget[0].toLocaleString()} - ₹{formData.budget[1].toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>
                  Monthly Rent
                </Typography>
              </Box>

              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.budget}
                  onChange={(e, val) => setFormData({ ...formData, budget: val })}
                  min={3000}
                  max={25000}
                  step={500}
                  valueLabelDisplay="auto"
                  disableSwap
                  sx={{
                    color: '#4F46E5',
                    height: 8,
                    '& .MuiSlider-thumb': {
                      height: 28, width: 28, backgroundColor: 'white', border: '2px solid #4F46E5',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      '&:hover, &.Mui-focusVisible': { boxShadow: '0 0 0 8px rgba(79, 70, 229, 0.16)' }
                    },
                    '& .MuiSlider-track': { border: 'none', bgcolor: '#4F46E5' },
                    '& .MuiSlider-rail': { opacity: 1, backgroundColor: '#E2E8F0' }
                  }}
                />
                <Stack direction="row" justifyContent="space-between" mt={1}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#94A3B8' }}>₹3k</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#94A3B8' }}>₹25k+</Typography>
                </Stack>
              </Box>
            </Box>
          </Fade>
        );

      case 3:
        return (
          <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{
                width: 60, height: 60, borderRadius: '50%', bg: '#EEF2FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2, bgcolor: '#EEF2FF', color: '#4F46E5'
              }}>
                <HomeIcon fontSize="large" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>
                Room Preference
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748B' }}>
                Select the type of accommodation you prefer.
              </Typography>
            </Box>

            <Stack spacing={2}>
              {['Single Room', 'Shared PG', 'Private Flat'].map((type, index) => {
                const selected = formData.roomTypes.includes(type);
                return (
                  <Grow key={type} in={true} timeout={300 + (index * 100)}>
                    <Card
                      variant="outlined"
                      onClick={() => setFormData({ ...formData, roomTypes: [type] })}
                      sx={{
                        borderColor: selected ? '#4F46E5' : '#E2E8F0',
                        bgcolor: selected ? '#EEF2FF' : 'white',
                        color: selected ? '#4F46E5' : '#1E293B',
                        borderWidth: selected ? 2 : 1,
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#4F46E5', transform: 'translateY(-2px)' }
                      }}
                    >
                      <CardActionArea sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {type}
                        </Typography>
                        {selected ?
                          <CheckCircleIcon sx={{ color: '#4F46E5' }} /> :
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #CBD5E1' }} />
                        }
                      </CardActionArea>
                    </Card>
                  </Grow>
                );
              })}
            </Stack>
          </Box>
        );

      case 4:
        return (
          <Box>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Box sx={{
                width: 60, height: 60, borderRadius: '50%', bg: '#EEF2FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2, bgcolor: '#FFF7ED', color: '#F97316'
              }}>
                <SortIcon fontSize="large" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1E293B', mb: 1 }}>
                What matters most?
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748B' }}>
                Drag to reorder your priorities.
              </Typography>
            </Box>

            <Reorder.Group 
              axis="y" 
              values={formData.priorities} 
              onReorder={(newOrder) => setFormData({ ...formData, priorities: newOrder })}
              style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {formData.priorities.map((item, index) => (
                <PriorityItem key={item.id} item={item} index={index} />
              ))}
            </Reorder.Group>
          </Box>
        );

      case 5:
        return (
          <Fade in={true} timeout={500}>
            <Box sx={{ textAlign: 'center', pt: 8 }}>
              <Box sx={{ position: 'relative', width: 140, height: 140, mx: 'auto', mb: 6 }}>
                <CircularProgress
                  variant="determinate"
                  value={matchingProgress}
                  size={140} thickness={4}
                  sx={{ color: '#4F46E5', strokeLinecap: 'round' }}
                />
                <Box sx={{ position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1E293B' }}>{Math.round(matchingProgress)}%</Typography>
                </Box>
              </Box>
              <Typography variant="h5" sx={{ color: '#1E293B', fontWeight: 800, mb: 1 }}>
                Personalizing Feed...
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748B' }}>
                We're finding the best college rooms for you.
              </Typography>
            </Box>
          </Fade>
        );

      default: return null;
    }
  };

  if (authLoading || !user) return <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh"><CircularProgress /></Box>;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 12, fontFamily: 'Inter' }}>
      {/* Header */}
      <Box sx={{ py: 2, borderBottom: '1px solid #E2E8F0', bgcolor: 'white' }}>
        <Container maxWidth="xs" sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#4F46E5' }}>SmartStay</Typography>
        </Container>
      </Box>

      <Container maxWidth="xs" sx={{ pt: 4 }}>
        {step < 5 && (
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                STEP {step} OF 4
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#4F46E5' }}>
                {step === 1 ? 'COLLEGE' : step === 2 ? 'BUDGET' : step === 3 ? 'TYPE' : 'PRIORITY'}
              </Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={(step / 4) * 100}
              sx={{
                height: 6, borderRadius: 3, bgcolor: '#E2E8F0',
                '& .MuiLinearProgress-bar': { bgcolor: '#4F46E5', borderRadius: 3 }
              }}
            />
          </Box>
        )}

        {renderStep()}

        {step < 5 && (
          <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'white', borderTop: '1px solid #E2E8F0', zIndex: 100 }}>
            <Container maxWidth="xs" sx={{ p: 0 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {step > 1 && (
                  <Button
                    onClick={prevStep}
                    startIcon={<ArrowBackIcon />}
                    sx={{
                      textTransform: 'none', fontWeight: 600, color: '#64748B',
                      px: 3, '&:hover': { bgcolor: '#F1F5F9', color: '#1E293B' }
                    }}
                  >
                    Back
                  </Button>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={nextStep}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.5, borderRadius: '12px',
                    textTransform: 'none', fontWeight: 600, fontSize: '1rem',
                    bgcolor: '#4F46E5', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
                    '&:hover': { bgcolor: '#4338CA', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)' }
                  }}
                >
                  {step === 4 ? 'Find Matches' : 'Continue'}
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
