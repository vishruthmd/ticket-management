import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import logo from '../assets/logo.png';

const drawerWidth = 260;

const navItems = [
  { text: 'Dashboard', icon: <HomeFilledIcon />, path: '/coordinator/dashboard' },
  { text: 'Create Ticket', icon: <AddCircleIcon />, path: '/coordinator/create-ticket' },
  { text: 'View Tickets', icon: <ListAltIcon />, path: '/coordinator/tickets' },
];

const sidebarVariants = {
  hidden: { x: -drawerWidth, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 700, damping: 18, mass: 0.6 } },
  exit: { x: -drawerWidth, opacity: 0, transition: { duration: 0.18 } },
};

export default function CoordinatorSidebar({ open, onClose }) {
  const location = useLocation();
  
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Sidebar */}
          <motion.aside
            className="fixed top-0 left-0 z-50 h-full"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            style={{ width: drawerWidth }}
          >
            <div className="h-full flex flex-col bg-white/90 backdrop-blur-xl shadow-2xl rounded-r-3xl border-r border-gray-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
                <img src={logo} alt="IT Call Log App Logo" className="h-10 w-10 rounded-xl shadow" />
                <span className="font-bold text-xl text-blue-700 tracking-tight">IT Call Log App</span>
              </div>
              <nav className="flex-1 overflow-y-auto py-4 px-2">
                {navItems.map((item) => (
                  <motion.div
                    key={item.text}
                    whileHover={{ scale: 1.07 }}
                    transition={{ type: 'spring', stiffness: 600, damping: 18, mass: 0.5 }}
                    style={{ borderRadius: '0.75rem' }}
                  >
                    <Link
                      key={item.text}
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center gap-4 px-4 py-3 my-1 rounded-xl transition-all font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-800 outline-none ${location.pathname === item.path ? 'bg-blue-100 text-blue-800 font-semibold shadow' : ''}`}
                    >
                      <span className="text-lg opacity-80">{item.icon}</span>
                      <span className="text-base">{item.text}</span>
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
} 