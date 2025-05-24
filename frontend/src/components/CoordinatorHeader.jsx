import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import logo from '../assets/rvce.png';

export default function CoordinatorHeader({ children }) {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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
        <Box display="flex" alignItems="center" gap={2}>
          {authUser && (
            <>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {authUser.name ? authUser.name[0].toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="subtitle1" color="text.primary">
                {authUser.name}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                Logout
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 