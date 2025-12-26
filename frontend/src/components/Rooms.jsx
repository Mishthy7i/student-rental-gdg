import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import RoomCard from './RoomCard';

const Rooms = ({ onLike }) => {
  const [rooms, setRooms] = useState([
    { id: 1, price: "12,000", distance: "0.2 km", matchScore: "98% Match", image: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=400" },
    { id: 2, price: "8,500", distance: "0.8 km", matchScore: "92% Match", image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=400" },
  ]);

  const removeRoom = (id, room, isLike) => {
    if (isLike) onLike(room);
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="800" sx={{ mb: 2 }}>Top Matches</Typography>
      <AnimatePresence mode="popLayout">
        {rooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            onLike={() => removeRoom(room.id, room, true)} 
            onDiscard={() => removeRoom(room.id, room, false)} 
          />
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default Rooms;