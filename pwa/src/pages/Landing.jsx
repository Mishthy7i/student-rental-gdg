import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Button,
    Stack,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip
} from '@mui/material';
import {
    Home as HomeIcon,
    SwipeRight as SwipeIcon,
    LocationOn as LocationIcon,
    Security as SecurityIcon,
    Speed as SpeedIcon,
    Favorite as FavoriteIcon,
    Business as BusinessIcon,
    School as SchoolIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        // Redirect if already logged in
        if (!loading && user) {
            navigate('/home');
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [user, loading, navigate]);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    const features = [
        {
            icon: <SwipeIcon sx={{ fontSize: 40 }} />,
            title: 'Tinder-Style Swiping',
            description: 'Swipe right to like, left to pass. Find your perfect room in seconds.',
            color: '#ec4899'
        },
        {
            icon: <LocationIcon sx={{ fontSize: 40 }} />,
            title: 'Near MITS Gwalior',
            description: 'All listings are within commuting distance from your college.',
            color: '#8b5cf6'
        },
        {
            icon: <SpeedIcon sx={{ fontSize: 40 }} />,
            title: 'Smart Recommendations',
            description: 'AI-powered matching based on your budget, preferences, and priorities.',
            color: '#3b82f6'
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 40 }} />,
            title: 'Verified Listings',
            description: 'All landlords are verified. Contact details provided for direct communication.',
            color: '#10b981'
        }
    ];

    const stats = [
        { value: '500+', label: 'Students' },
        { value: '200+', label: 'Rooms Listed' },
        { value: '50+', label: 'Landlords' },
        { value: '4.8★', label: 'Rating' }
    ];

    if (loading) {
        return null;
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Hero Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    pt: 8,
                    pb: 12,
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Animated Background Elements */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: -50,
                        right: -50,
                        width: 300,
                        height: 300,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        animation: 'float 6s ease-in-out infinite'
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: -100,
                        left: -100,
                        width: 400,
                        height: 400,
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        animation: 'float 8s ease-in-out infinite reverse'
                    }}
                />

                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                    <Box textAlign="center" sx={{ mb: 6 }}>
                        <Box
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                px: 3,
                                py: 1,
                                borderRadius: 8,
                                mb: 3,
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <HomeIcon />
                            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                                RoomSwipe
                            </Typography>
                        </Box>

                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                mb: 2,
                                fontSize: { xs: '2.5rem', md: '3.5rem' }
                            }}
                        >
                            Find Your Perfect Room
                        </Typography>
                        <Typography
                            variant="h5"
                            sx={{
                                mb: 4,
                                opacity: 0.9,
                                fontWeight: 400,
                                fontSize: { xs: '1.2rem', md: '1.5rem' }
                            }}
                        >
                            Student housing made simple for MITS Gwalior
                        </Typography>

                        <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            spacing={2}
                            justifyContent="center"
                            sx={{ mb: 4 }}
                        >
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => navigate('/login')}
                                sx={{
                                    bgcolor: 'white',
                                    color: 'primary.main',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 900,
                                    fontSize: '1.1rem',
                                    textTransform: 'none',
                                    boxShadow: 4,
                                    '&:hover': {
                                        bgcolor: 'grey.100',
                                        transform: 'translateY(-2px)',
                                        boxShadow: 6
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                Get Started
                            </Button>
                            {isInstallable && (
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={handleInstall}
                                    sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 3,
                                        fontWeight: 700,
                                        fontSize: '1.1rem',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: 'white',
                                            bgcolor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Install App
                                </Button>
                            )}
                        </Stack>

                        {/* Stats */}
                        <Grid container spacing={3} sx={{ mt: 4 }}>
                            {stats.map((stat, idx) => (
                                <Grid item xs={6} sm={3} key={idx}>
                                    <Box>
                                        <Typography variant="h4" sx={{ fontWeight: 900 }}>
                                            {stat.value}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            {stat.label}
                                        </Typography>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Container>
            </Box>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Box textAlign="center" sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                        Why Choose RoomSwipe?
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        The smartest way to find student accommodation
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {features.map((feature, idx) => (
                        <Grid item xs={12} sm={6} md={3} key={idx}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 4,
                                    boxShadow: 3,
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: '50%',
                                            bgcolor: `${feature.color}15`,
                                            color: feature.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            mx: 'auto',
                                            mb: 2
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* How It Works */}
            <Box sx={{ bgcolor: 'grey.50', py: 8 }}>
                <Container maxWidth="lg">
                    <Box textAlign="center" sx={{ mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                            How It Works
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Card sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                                        <SchoolIcon />
                                    </Avatar>
                                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                        For Students
                                    </Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    <Box>
                                        <Chip label="1" color="success" size="small" sx={{ mr: 1, fontWeight: 700 }} />
                                        <Typography variant="body1" component="span">
                                            Sign up and set your preferences
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Chip label="2" color="success" size="small" sx={{ mr: 1, fontWeight: 700 }} />
                                        <Typography variant="body1" component="span">
                                            Swipe through personalized room recommendations
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Chip label="3" color="success" size="small" sx={{ mr: 1, fontWeight: 700 }} />
                                        <Typography variant="body1" component="span">
                                            View details and contact landlords directly
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Card sx={{ p: 4, borderRadius: 4, height: '100%' }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                        <BusinessIcon />
                                    </Avatar>
                                    <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                        For Landlords
                                    </Typography>
                                </Stack>
                                <Stack spacing={2}>
                                    <Box>
                                        <Chip label="1" color="primary" size="small" sx={{ mr: 1, fontWeight: 700 }} />
                                        <Typography variant="body1" component="span">
                                            Create an account as a landlord
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Chip label="2" color="primary" size="small" sx={{ mr: 1, fontWeight: 700 }} />
                                        <Typography variant="body1" component="span">
                                            List your property with photos and details
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Chip label="3" color="primary" size="small" sx={{ mr: 1, fontWeight: 700 }} />
                                        <Typography variant="body1" component="span">
                                            Manage listings and connect with students
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    py: 8,
                    textAlign: 'center'
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                        Ready to Find Your Room?
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                        Join hundreds of MITS students already using RoomSwipe
                    </Typography>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => navigate('/login')}
                        sx={{
                            bgcolor: 'white',
                            color: 'primary.main',
                            px: 5,
                            py: 2,
                            borderRadius: 3,
                            fontWeight: 900,
                            fontSize: '1.2rem',
                            textTransform: 'none',
                            boxShadow: 4,
                            '&:hover': {
                                bgcolor: 'grey.100',
                                transform: 'translateY(-2px)',
                                boxShadow: 6
                            }
                        }}
                    >
                        Get Started Now
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: 'grey.900', color: 'white', py: 4, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ opacity: 0.7 }}>
                    © 2025 RoomSwipe. Made for MITS Gwalior Students.
                </Typography>
            </Box>

            {/* Keyframes for animations */}
            <style>
                {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}
            </style>
        </Box>
    );
};

export default Landing;
