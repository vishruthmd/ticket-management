import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CoordinatorHeader from '../components/CoordinatorHeader';
import CoordinatorSidebar from '../components/CoordinatorSidebar';

export default function LayoutCoordinator({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CoordinatorHeader>
        <IconButton
          color="primary"
          aria-label="open sidebar"
          edge="start"
          onClick={() => setSidebarOpen(true)}
          sx={{ mr: 2, display: { sm: 'block' } }}
        >
          <MenuIcon />
        </IconButton>
      </CoordinatorHeader>
      <CoordinatorSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children ? children : <Outlet />}
      </Box>
    </Box>
  );
}

