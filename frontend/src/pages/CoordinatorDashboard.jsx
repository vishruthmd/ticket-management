import React, { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { FaClipboardList, FaExclamationTriangle, FaClock } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../libs/axios.libs.js';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { useAuthStore } from '../store/useAuthStore';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const statCardsConfig = [
  {
    title: 'Open Tickets',
    icon: <FaClipboardList className="h-6 w-6 text-blue-600" />, 
    color: 'bg-blue-50 text-blue-600',
    statKey: 'openTickets',
  },
  {
    title: 'In Progress Tickets',
    icon: <FaClipboardList className="h-6 w-6 text-yellow-600" />, 
    color: 'bg-yellow-50 text-yellow-600',
    statKey: 'inProgressTickets',
  },
  {
    title: 'High Priority Tickets',
    icon: <FaExclamationTriangle className="h-6 w-6 text-red-600" />, 
    color: 'bg-red-50 text-red-600',
    statKey: 'highPriorityTickets',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const getStatusChipProps = (status) => {
  const normalized = (status || '').toUpperCase();
  switch (normalized) {
    case 'OPEN':
      return { label: 'OPEN', sx: { bgcolor: '#dbeafe', color: '#1d4ed8', fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    case 'IN_PROGRESS':
      return { label: 'IN PROGRESS', sx: { bgcolor: '#fef9c3', color: '#b45309', fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    case 'CLOSED':
      return { label: 'CLOSED', sx: { bgcolor: '#dcfce7', color: '#15803d', fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    default:
      return { label: status, sx: { fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
  }
};

const getPriorityChipProps = (priority) => {
  const normalized = (priority || '').toUpperCase();
  switch (normalized) {
    case 'HIGH':
      return { label: 'HIGH', sx: { bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    case 'MEDIUM':
      return { label: 'MEDIUM', sx: { bgcolor: '#fef9c3', color: '#b45309', fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    case 'LOW':
      return { label: 'LOW', sx: { bgcolor: '#dcfce7', color: '#15803d', fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    default:
      return { label: priority, sx: { fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
  }
};

const CoordinatorDashboard = () => {
  const { authUser } = useAuthStore();
  const [stats, setStats] = useState({
    openTickets: 0,
    inProgressTickets: 0,
    highPriorityTickets: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTickets, setModalTickets] = useState([]);
  const [modalTech, setModalTech] = useState(null);
  const [allTickets, setAllTickets] = useState([]);
  const [avgCloseTime, setAvgCloseTime] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/tickets/coordinator-tickets');
        const tickets = res.data.tickets || [];
        setAllTickets(tickets);
        const openTickets = tickets.filter(t => t.status === 'OPEN').length;
        const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;
        const highPriorityTickets = tickets.filter(t => t.priority === 'HIGH').length;
        setStats({ openTickets, inProgressTickets, highPriorityTickets });
        setRecentTickets(
          tickets
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        );
        const uniqueTechs = [];
        const seen = new Set();
        tickets.forEach(t => {
          if (t.technician && t.technician.id && !seen.has(t.technician.id)) {
            uniqueTechs.push(t.technician);
            seen.add(t.technician.id);
          }
        });
        setTechnicians(uniqueTechs);
        // Calculate average close time (in hours)
        const closedTickets = tickets.filter(t => t.status === 'CLOSED' && t.createdAt && t.resolvedAt);
        if (closedTickets.length > 0) {
          const totalMs = closedTickets.reduce((sum, t) => sum + (new Date(t.resolvedAt) - new Date(t.createdAt)), 0);
          const avgMs = totalMs / closedTickets.length;
          setAvgCloseTime((avgMs / (1000 * 60 * 60)).toFixed(1));
        } else {
          setAvgCloseTime(null);
        }
      } catch (e) {
        setStats({ openTickets: 0, inProgressTickets: 0, highPriorityTickets: 0 });
        setRecentTickets([]);
        setTechnicians([]);
        setAllTickets([]);
        setAvgCloseTime(null);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [authUser]);

  return (
    <div>
      <PageHeader 
        title="Coordinator Dashboard" 
        description="Overview of your tickets and activity" 
      />
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {statCardsConfig.map((card, index) => (
          <motion.div key={index} variants={item}>
            <Card className="flex items-start cursor-pointer">
              <div className={`p-3 rounded-full mr-4 ${card.color}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? <span className="animate-pulse">...</span> : stats[card.statKey]}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
        {/* Avg. Close Time Card */}
        <motion.div variants={item}>
          <Card className="flex items-start cursor-pointer">
            <div className="p-3 rounded-full mr-4 bg-gray-100 text-gray-700">
              <FaClock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Avg. Close Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? <span className="animate-pulse">...</span> : avgCloseTime !== null ? `${avgCloseTime}h` : '--'}
              </p>
            </div>
          </Card>
        </motion.div>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-7">
          <h2 className="text-lg font-semibold mb-4">Recent Tickets</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200 text-sm" style={{ width: '100%', fontSize: '13px' }}>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-3 animate-pulse">Loading...</td></tr>
                ) : recentTickets.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-3 text-gray-500">No recent tickets</td></tr>
                ) : recentTickets.map((ticket, idx) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 cursor-pointer">
                    <td className="px-2 py-2 whitespace-nowrap text-sm font-medium text-blue-600">{idx + 1}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900" style={{ maxWidth: 105, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm text-gray-900">{ticket.location}</td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm">
                      <Chip {...getPriorityChipProps(ticket.priority)} size="small" />
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-sm">
                      <Chip {...getStatusChipProps(ticket.status)} size="small" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="md:col-span-5">
          <h2 className="text-lg font-semibold mb-4">Assigned Technicians</h2>
          <Card>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4 animate-pulse">Loading...</div>
              ) : technicians.length === 0 ? (
                <div className="text-center py-4 text-gray-500">No technicians assigned</div>
              ) : (
                technicians.map((tech) => {
                  const inProgressTickets = allTickets
                    .filter(t => t.technician && t.technician.id === tech.id && t.status === 'IN_PROGRESS');
                  const showTickets = inProgressTickets.slice(0, 2);
                  return (
                    <div key={tech.id} className="p-3 border rounded-lg flex flex-col h-full text-[15px] hover:bg-gray-50 transition-transform duration-200 hover:scale-105" style={{ fontFamily: 'GeistMono, monospace' }}>
                      <div className="flex justify-between items-center">
                        <span className="text-base font-bold text-blue-600">{tech.name}</span>
                        <span className="text-sm text-gray-500">{tech.email}</span>
                      </div>
                      {inProgressTickets.length > 0 && (
                        <>
                          <ul className="mt-2 ml-2 list-disc text-sm text-gray-700 space-y-1">
                            {showTickets.map(ticket => (
                              <li key={ticket.id}>{ticket.title}</li>
                            ))}
                          </ul>
                          <div className="flex-1 flex items-end justify-end">
                            <button
                              className="mt-2 text-sm text-blue-600 hover:underline focus:outline-none self-end cursor-pointer"
                              onClick={() => { setModalOpen(true); setModalTickets(inProgressTickets); setModalTech(tech); }}
                            >
                              +View all assigned tickets
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </Card>
        </div>
      </div>
      {/* Modal for showing all in-progress tickets for a technician */}
      <AnimatePresence>
        {modalOpen && (
          <Dialog 
            open={modalOpen} 
            onClose={() => setModalOpen(false)} 
            maxWidth="sm" 
            fullWidth
            PaperComponent={motion.div} // Use motion.div for animations
            PaperProps={{
              initial: { opacity: 0, y: 50, scale: 0.9 },
              animate: { opacity: 1, y: 0, scale: 1 },
              exit: { opacity: 0, y: 30, scale: 0.95 },
              transition: { duration: 0 }, // Make animation instantaneous
              sx: {
                borderRadius: 6, // Even more rounded corners
                p: 0, // Remove default padding, handle manually
                background: 'linear-gradient(145deg, rgba(255,255,255,0.97), rgba(240,245,255,0.95))', // Subtle gradient
                backdropFilter: 'blur(8px)', // Glassmorphic effect
                boxShadow: '0 16px 70px rgba(0,0,0,0.15)', // Softer, larger shadow
                overflow: 'hidden' // Clip content to rounded corners
              }
            }}
            BackdropProps={{
              sx: {
                backgroundColor: 'rgba(30, 40, 60, 0.3)', // Darker, less opaque backdrop
                backdropFilter: 'blur(3px)', // Blur for the backdrop itself
              }
            }}
          >
            <DialogTitle sx={{ 
              m: 0, 
              p: 3, 
              pb: 2,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(0,0,0,0.08)' // Subtle separator
            }}>
              <Typography variant="h5" component="div" sx={{ 
                fontWeight: 700, 
                color: '#1e3a8a', // Darker blue for title
              }}>
                Tickets for {modalTech?.name}
              </Typography>
              <IconButton 
                aria-label="close" 
                onClick={() => setModalOpen(false)} 
                sx={{ 
                  color: (theme) => theme.palette.grey[600],
                  bgcolor: (theme) => theme.palette.grey[100],
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.grey[200],
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3, maxHeight: '60vh' }}>
              {modalTickets.length > 0 ? (
                <ul className="space-y-3">
                  {modalTickets.map(ticket => (
                    <li 
                      key={ticket.id} 
                      className="py-2.5 px-3.5 rounded-lg bg-white/70 shadow-sm hover:bg-blue-50 hover:shadow-md transition-all duration-200 cursor-default"
                    >
                      <Typography variant="body1" sx={{ color: '#334155', fontWeight: 500 }}>
                        {ticket.title}
                      </Typography>
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography sx={{ textAlign: 'center', color: '#64748b', py: 4}}>No tickets assigned yet.</Typography>
              )}
            </DialogContent>
            <DialogActions sx={{ 
              p: 3, 
              pt: 2, 
              borderTop: '1px solid rgba(0,0,0,0.08)', // Subtle separator
              justifyContent: 'flex-end'
            }}>
              <Button 
                onClick={() => setModalOpen(false)} 
                variant="outlined" // Less prominent close button
                color="primary"
                sx={{ borderRadius: 2, fontWeight: 600, fontSize: 15, px: 3, textTransform: 'none' }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoordinatorDashboard; 