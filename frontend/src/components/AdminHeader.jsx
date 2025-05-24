import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import logo from '../assets/logo.png';

export default function AdminHeader({ children }) {
  return (
    <AppBar position="fixed" color="inherit" elevation={1} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        {children}
        <Box display="flex" alignItems="center" gap={2}>
          <img src={logo} alt="IT Call Log App Logo" style={{ height: 40 }} />
          <Typography variant="h6" color="primary" fontWeight={700}>
            IT Call Log App
          </Typography>
        </Box>
        <Box flexGrow={1} />
        {/* Placeholder for user actions (profile/logout) */}
      </Toolbar>
    </AppBar>
  );
} 