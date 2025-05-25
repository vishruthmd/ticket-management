import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import logo from '../../assets/rvce.png';
import { alpha } from '@mui/material/styles';

export default function TechnicianHeader({ children }) {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, #ffffff 100%)',
        borderBottom: '1px solid',
        borderColor: (theme) => alpha(theme.palette.grey[200], 0.8),
        backdropFilter: 'blur(8px)',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar 
        sx={{ 
          minHeight: { xs: 56, md: 64 },
          px: { xs: 2, md: 3 },
        }}
      >
        {children}
        <Box 
          display="flex" 
          alignItems="center" 
          gap={2}
          sx={{
            position: 'relative',
            '&:after': {
              content: '""',
              position: 'absolute',
              right: -16,
              height: '50%',
              width: 1,
            }
          }}
        >
          <img 
            src={logo} 
            alt="IT Call Log App Logo" 
            style={{ 
              height: 38,
              transition: 'all 0.2s ease',
            }} 
          />
          <Box sx={{ backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>
            <Typography 
              variant="subtitle1" 
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                color: (theme) => theme.palette.grey[900],
                letterSpacing: '0.01em',
                lineHeight: 1.2,
              }}
            >
              IT Call Log App
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: (theme) => theme.palette.grey[600],
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                display: 'block',
              }}
            >
              Technician Portal
            </Typography>
          </Box>
        </Box>

        <Box flexGrow={1} />

        {authUser && (
          <Box 
            display="flex" 
            alignItems="center" 
            gap={2}
          >
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                padding: '4px 12px',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36,
                  height: 36,
                  bgcolor: (theme) => theme.palette.primary.main,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 0 0 3px rgba(255,255,255,0.8), 0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                {authUser.name ? authUser.name[0].toUpperCase() : 'T'}
              </Avatar>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 600,
                    color: (theme) => theme.palette.grey[900],
                    lineHeight: 1.2,
                  }}
                >
                  {authUser.name}
                </Typography>
                <Typography 
                  component="span" 
                  sx={{ 
                    fontSize: '0.65rem',
                    color: (theme) => theme.palette.primary.main,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '1px 6px',
                    borderRadius: '3px',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  }}
                >
                  Technician
                </Typography>
              </Box>
            </Box>

            <Button
                variant="outlined"
                color="primary"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  borderWidth: 2,
                  borderColor: '#2563eb',
                  color: '#2563eb',
                  background: 'white',
                  fontWeight: 600,
                  transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    borderColor: '#1d4ed8',
                    transform: 'scale(1.05)',
                    boxShadow: '0 2px 8px 0 rgba(37,99,235,0.08)',
                  },
                  '&:active': {
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    borderColor: '#1e40af',
                    transform: 'scale(0.98)',
                  },
                }}
              >
                Logout
              </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}