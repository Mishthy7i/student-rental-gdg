import React, { useState, useEffect } from 'react';
import { 
  Box, Container, Typography, Button, LinearProgress, 
  Stack, TextField, Chip, Slider, Card, CardActionArea, Grid 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Reorder, motion, AnimatePresence } from "framer-motion"; 
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useApp } from '../context/AppContext'; // Import your context

const Onboarding = () => {
  const navigate = useNavigate();
  const { setUserData } = useApp(); // Access context to save data
  const [step, setStep] = useState(1);
  const [matchingProgress, setMatchingProgress] = useState(0);
  
  const [formData, setFormData] = useState({
    college: '',
    budget: [8000, 15000],
    roomTypes: [],
    priorities: [
      { id: 'dist', label: "Distance to college", icon: "📍" },
      { id: 'price', label: "Price range", icon: "💰" },
      { id: 'safe', label: "Safety & reviews", icon: "🛡️" },
      { id: 'amen', label: "Amenities (WiFi, AC)", icon: "📶" }
    ]
  });

  // Step 5: The "Smart" Calculation Simulation
  useEffect(() => {
    if (step === 5) {
      const interval = setInterval(() => {
        setMatchingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            
            // SAVE TO CONTEXT: This triggers the recommendation engine
            setUserData(prevUser => ({
              ...prevUser,
              preferences: {
                college: formData.college,
                budget: formData.budget[1], // Use max budget for calculation
                preferredType: formData.roomTypes[0] || 'Single Room',
                priorities: formData.priorities
              }
            }));

            setTimeout(() => navigate('/home'), 800);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [step, navigate, formData, setUserData]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const renderStep = () => {
    switch(step) {
      case 1: 
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="s1">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>Where's the campus? 🎓</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>We'll filter stays within your commute zone.</Typography>
            <TextField 
              fullWidth 
              size="small"
              placeholder="Type university name..." 
              value={formData.college}
              onChange={(e) => setFormData({...formData, college: e.target.value})}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
            />
            <Stack direction="row" flexWrap="wrap" gap={1.5}>
              {['IIT Delhi', 'NSUT', 'DTU', 'Amity'].map(uni => (
                <Chip 
                  key={uni} label={uni} 
                  onClick={() => setFormData({...formData, college: uni})}
                  sx={{ 
                    borderRadius: '12px', fontWeight: 700, px: 1, py: 2.5,
                    bgcolor: formData.college === uni ? '#6366f1' : '#fff',
                    color: formData.college === uni ? '#fff' : '#64748b',
                    border: '1px solid',
                    borderColor: formData.college === uni ? '#6366f1' : '#e2e8f0',
                    transition: '0.3s',
                    '&:hover': { bgcolor: '#818cf8', color: '#fff' }
                  }} 
                />
              ))}
            </Stack>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="s2">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>Set your budget 💸</Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 4 }}>Find the perfect balance of comfort and cost.</Typography>
            <Box sx={{ p: 4, bgcolor: '#f5f7ff', borderRadius: 6, textAlign: 'center', mb: 4, border: '1px solid #e0e7ff' }}>
              <Typography variant="h4" sx={{ fontWeight: 900, color: '#4f46e5' }}>
                ₹{formData.budget[0].toLocaleString()} - ₹{formData.budget[1].toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 800, letterSpacing: 2 }}>MONTHLY RANGE</Typography>
            </Box>
            <Slider
              value={formData.budget}
              onChange={(e, val) => setFormData({...formData, budget: val})}
              min={5000} max={35000} step={1000}
              sx={{ 
                color: '#6366f1', height: 8, 
                '& .MuiSlider-thumb': { width: 28, height: 28, bgcolor: '#fff', border: '4px solid #6366f1', boxShadow: '0 4px 10px rgba(99,102,241,0.3)' } 
              }}
            />
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="s3">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 3 }}>Room preference 🏠</Typography>
            <Grid container spacing={2}>
              {['Single Room', 'Shared PG', 'Private Flat'].map(type => {
                const selected = formData.roomTypes.includes(type);
                return (
                  <Grid item xs={12} key={type}>
                    <Card 
                      variant="outlined"
                      onClick={() => setFormData({...formData, roomTypes: [type]})} // Simplified to single choice
                      sx={{ 
                        borderRadius: 4, transition: '0.3s',
                        borderColor: selected ? '#6366f1' : '#e2e8f0', 
                        bgcolor: selected ? '#f5f7ff' : '#fff',
                        borderWidth: selected ? 2.5 : 1,
                        boxShadow: selected ? '0 8px 20px rgba(99,102,241,0.1)' : 'none'
                      }}
                    >
                      <CardActionArea sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: selected ? '#4f46e5' : '#1e293b' }}>{type}</Typography>
                        {selected && <CheckCircleIcon sx={{ color: '#6366f1' }} />}
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        );

      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="s4">
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>Priorities 📊</Typography>
            
            {/* INSTRUCTIONAL HINT */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, p: 2, bgcolor: '#eef2ff', borderRadius: 3, border: '1px dashed #6366f1' }}>
              <DragIndicatorIcon sx={{ color: '#6366f1' }} />
              <Typography variant="caption" sx={{ color: '#4f46e5', fontWeight: 800, lineHeight: 1.2 }}>
                DRAG TO REORDER: Move your top priority to the #1 spot.
              </Typography>
            </Box>

            <Reorder.Group axis="y" values={formData.priorities} onReorder={(val) => setFormData({...formData, priorities: val})}>
              {formData.priorities.map((item, index) => (
                <Reorder.Item key={item.id} value={item} style={{ listStyle: 'none', marginBottom: '12px' }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Box sx={{ 
                      p: 2, bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: 4, 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'grab'
                    }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 40, height: 40, bgcolor: '#f1f5f9', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                          {item.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#334155' }}>{item.label}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 900 }}>#{index + 1}</Typography>
                        <DragIndicatorIcon sx={{ color: '#cbd5e1' }} />
                      </Stack>
                    </Box>
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </motion.div>
        );

      case 5:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="s5">
            <Stack spacing={4} alignItems="center" sx={{ textAlign: 'center', pt: 12 }}>
              <Box sx={{ position: 'relative', width: 120, height: 120 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  style={{ width: '100%', height: '100%', border: '6px solid #f1f5f9', borderTop: '6px solid #6366f1', borderRadius: '50%' }}
                />
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#4f46e5' }}>{Math.round(matchingProgress)}%</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 900, mb: 1 }}>Analyzing Stays...</Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>Customizing your Smart Student Dashboard</Typography>
              </Box>
            </Stack>
          </motion.div>
        );

      default: return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fcfdfe', pb: 12 }}>
      <Container maxWidth="xs" sx={{ pt: 6 }}>
        {step < 5 && (
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 900, color: '#6366f1', letterSpacing: 1.5 }}>STEP {step} OF 4</Typography>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#cbd5e1' }}>SMART MATCH</Typography>
            </Stack>
            <LinearProgress 
              variant="determinate" 
              value={(step/4) * 100} 
              sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1', borderRadius: 3 } }} 
            />
          </Box>
        )}

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {step < 5 && (
          <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, p: 3, bgcolor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(15px)', borderTop: '1px solid #f1f5f9', zIndex: 1000 }}>
            <Container maxWidth="xs" sx={{ p: 0 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                {step > 1 && (
                  <Button 
                    onClick={prevStep} 
                    startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
                    sx={{ color: '#64748b', textTransform: 'none', fontWeight: 800, px: 2 }}
                  >
                    Back
                  </Button>
                )}
                
                <Button 
                  fullWidth
                  variant="contained" 
                  onClick={nextStep}
                  disableElevation
                  disabled={step === 1 && !formData.college}
                  sx={{ 
                    bgcolor: '#6366f1', color: '#fff', py: 2, borderRadius: 4,
                    textTransform: 'none', fontWeight: 900, fontSize: '1rem',
                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)',
                    '&:hover': { bgcolor: '#4f46e5' },
                    '&.Mui-disabled': { bgcolor: '#e2e8f0' }
                  }}
                >
                  {step === 4 ? "Find My Smart Home" : "Continue"}
                </Button>
              </Stack>
            </Container>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Onboarding;