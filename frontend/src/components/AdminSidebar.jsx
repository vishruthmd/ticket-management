import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import GroupIcon from '@mui/icons-material/Group';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import logo from '../assets/logo.png';

const drawerWidth = 260;

const navItems = [
  { text: 'Dashboard', icon: <HomeFilledIcon />, path: '/admin/dashboard' },
  { text: 'Create User', icon: <AddCircleIcon />, path: '/admin/create-user' },
  { text: 'Assign Technician', icon: <AssignmentIndIcon />, path: '/admin/assign-technician' },
  { text: 'View Technicians', icon: <PeopleIcon />, path: '/admin/view-technicians' },
  { text: 'View Coordinators', icon: <GroupIcon />, path: '/admin/view-coordinators' },
  { text: 'View Tickets', icon: <ListAltIcon />, path: '/admin/view-tickets-admin' },
];

const sidebarVariants = {
  hidden: { x: -drawerWidth, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 32 } },
  exit: { x: -drawerWidth, opacity: 0, transition: { duration: 0.18 } },
};

export default function AdminSidebar({ open, onClose }) {
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
                  <Link
                    key={item.text}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center gap-4 px-4 py-3 my-1 rounded-xl transition-all font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-800 outline-none ${location.pathname === item.path ? 'bg-blue-100 text-blue-800 font-semibold shadow' : ''}`}
                  >
                    <span className="text-lg opacity-80">{item.icon}</span>
                    <span className="text-base">{item.text}</span>
                  </Link>
                ))}
              </nav>
              <div className="mt-auto py-4 px-6 text-xs text-gray-400">&copy; {new Date().getFullYear()} IT Call Log App</div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
} 