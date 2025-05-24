import React from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import TechnicianHeader from '../components/layout/TechnicianHeader';

export default function LayoutTechnician() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TechnicianHeader />
      <Box 
        component="main" 
        sx={{
          flexGrow: 1, 
          p: 3, 
          bgcolor: '#f4f6f8'
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}