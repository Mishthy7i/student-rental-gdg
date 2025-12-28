import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Stack
} from '@mui/material';
import {
  Home as HomeIcon,
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import RoomCard from './RoomCard';

const SwipeInterface = ({ rooms, onLike, onDislike, onOpenDetails, onRefresh }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const currentRoom = rooms[currentIndex];

  const handleAction = async (e, type) => {
    e.stopPropagation();
    if (!currentRoom || swiping) return;

    try {
      setSwiping(true);

      // Handle callbacks
      if (type === 'like' && onLike) {
        await onLike(currentRoom, false, 75); // Simplified - you can add match logic
      } else if (type === 'dislike' && onDislike) {
        await onDislike(currentRoom);
      }

      // Move to next room
      setCurrentIndex((prev) => prev + 1);

      // If we're running low on rooms, trigger refresh
      if (currentIndex >= rooms.length - 3 && onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
      // Still move to next room even if API fails
      setCurrentIndex((prev) => prev + 1);
    } finally {
      setSwiping(false);
    }
  };

  if (!currentRoom || currentIndex >= rooms.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 500,
          textAlign: 'center',
          p: 4,
          bgcolor: 'white',
          borderRadius: 5,
          border: '2px dashed',
          borderColor: 'grey.200',
          mx: 'auto',
          maxWidth: 400
        }}
      >
        <HomeIcon sx={{ fontSize: 48, color: 'primary.main', opacity: 0.2, mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          All Caught Up!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          No more rooms to show right now
        </Typography>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => setCurrentIndex(0)}
          sx={{
            bgcolor: 'grey.900',
            color: 'white',
            borderRadius: 3,
            px: 3,
            py: 1.5,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 2,
            fontSize: '10px',
            '&:hover': {
              bgcolor: 'grey.800'
            }
          }}
        >
          Refresh Feed
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
        mx: 'auto'
      }}
    >
      {/* Card Container with Stack Effect */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 520, sm: 580 },
          mb: 2.5
        }}
      >
        {/* Decorative background stack */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: '10%',
            width: '80%',
            height: '90%',
            bgcolor: 'grey.100',
            borderRadius: 4,
            zIndex: -2,
            opacity: 0.4
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: '5%',
            width: '90%',
            height: '95%',
            bgcolor: 'white',
            borderRadius: 4,
            zIndex: -1,
            opacity: 0.8,
            border: '1px solid',
            borderColor: 'grey.100',
            boxShadow: 1
          }}
        />

        {/* Animated Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoom.room_id || currentRoom.id}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ x: 500, opacity: 0, rotate: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%'
            }}
          >
            <RoomCard
              room={currentRoom}
              onOpenDetails={() => onOpenDetails(currentRoom)}
            />
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Control Buttons */}
      <Stack direction="row" spacing={4} sx={{ mt: 2.5 }}>
        <Button
          onClick={(e) => handleAction(e, 'dislike')}
          disabled={swiping}
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: 'white',
            border: '1px solid',
            borderColor: 'grey.100',
            color: 'error.main',
            boxShadow: 4,
            minWidth: 64,
            '&:hover': {
              bgcolor: 'error.50',
              transform: 'scale(0.9)'
            },
            '&:active': {
              transform: 'scale(0.9)'
            },
            '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed'
            },
            transition: 'all 0.2s'
          }}
        >
          {swiping ? (
            <CircularProgress size={28} color="error" />
          ) : (
            <CloseIcon sx={{ fontSize: 28 }} />
          )}
        </Button>

        <Button
          onClick={(e) => handleAction(e, 'like')}
          disabled={swiping}
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'white',
            boxShadow: 6,
            minWidth: 80,
            '&:hover': {
              bgcolor: 'primary.dark',
              transform: 'scale(0.9)'
            },
            '&:active': {
              transform: 'scale(0.9)'
            },
            '&:disabled': {
              opacity: 0.5,
              cursor: 'not-allowed'
            },
            transition: 'all 0.2s'
          }}
        >
          {swiping ? (
            <CircularProgress size={36} color="inherit" />
          ) : (
            <FavoriteIcon sx={{ fontSize: 36 }} />
          )}
        </Button>
      </Stack>
    </Box>
  );
};

export default SwipeInterface;

