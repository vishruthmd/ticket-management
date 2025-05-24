import React, { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import { FaUsers, FaUserTie, FaClipboardList, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { axiosInstance } from '../libs/axios.libs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';

const statCardsConfig = [
  {
    title: 'Open Tickets',
    icon: <FaClipboardList className="h-6 w-6 text-blue-600" />, 
    color: 'bg-blue-50 text-blue-600',
    statKey: 'openTickets',
    path: '/view-tickets-admin',
  },
  {
    title: 'In Progress Tickets',
    icon: <FaClipboardList className="h-6 w-6 text-yellow-600" />, 
    color: 'bg-yellow-50 text-yellow-600',
    statKey: 'inProgressTickets',
    path: '/view-tickets-admin',
  },
  {
    title: 'Urgent Tickets',
    icon: <FaExclamationTriangle className="h-6 w-6 text-accent-600" />, 
    color: 'bg-accent-50 text-accent-600',
    statKey: 'urgentTickets',
    path: '/view-tickets-admin',
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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2, ease: 'easeIn' } },
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

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    openTickets: 0,
    inProgressTickets: 0,
    urgentTickets: 0,
  });
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        const [openRes, inProgressRes, ticketRes] = await Promise.all([
          axiosInstance.get('/tickets/open-tickets'),
          axiosInstance.get('/tickets/in-progress-tickets'),
          axiosInstance.get('/tickets/get-all-tickets'),
        ]);
        const openTickets = openRes.data.tickets?.length || 0;
        const inProgressTickets = inProgressRes.data.tickets?.length || 0;
        const tickets = ticketRes.data.tickets || [];
        const urgentTickets = tickets.filter(t => t.priority === 'HIGH' && t.status !== 'CLOSED').length;
        setStats({ openTickets, inProgressTickets, urgentTickets });
        setRecentTickets(
          tickets
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
            .map(t => ({
              id: t.id,
              issue: t.title,
              priority: t.priority || 'Low',
              status: t.status,
              assignedTo: t.technician?.name || 'Unassigned',
              createdAt: new Date(t.createdAt).toLocaleString(),
              department: t.department || '',
              location: t.location || '',
              description: t.description || '',
              coordinator: t.coordinator || null,
              technician: t.technician || null,
            }))
        );
      } catch (e) {
        setStats({ openTickets: 0, inProgressTickets: 0, urgentTickets: 0 });
        setRecentTickets([]);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div>
      <PageHeader 
        title="Admin Dashboard" 
        description="Overview of the IT support system" 
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
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Tickets</h2>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-4 animate-pulse">Loading...</td></tr>
                ) : recentTickets.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4 text-gray-500">No recent tickets</td></tr>
                ) : recentTickets.map((ticket, idx) => (
                  <React.Fragment key={ticket.id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600">{idx + 1}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{ticket.issue}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{ticket.department}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{ticket.location}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Chip {...getPriorityChipProps(ticket.priority)} size="small" />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Chip {...getStatusChipProps(ticket.status)} size="small" />
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Unassigned Tickets</h2>
          <Card>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4 animate-pulse">Loading...</div>
              ) : recentTickets.filter(ticket => ticket.assignedTo === 'Unassigned').length === 0 ? (
                <div className="text-center py-4 text-gray-500">No unassigned tickets</div>
              ) : recentTickets
                .filter(ticket => ticket.assignedTo === 'Unassigned')
                .map((ticket) => (
                  <div key={ticket.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-blue-600">{ticket.issue}</span>
                      <Chip {...getPriorityChipProps(ticket.priority)} size="small" />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">{ticket.department}</span>
                      <span className="text-xs text-gray-500">{ticket.location}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-900">{ticket.description?.slice(0, 80) || 'No description provided.'}</p>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>{ticket.createdAt}</span>
                      <button className="text-primary-600 hover:text-primary-800">
                        Assign Technician
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
      {/* Ticket Details Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <Dialog
            open={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              // component: motion.div,
              variants: modalVariants,
              initial: 'hidden',
              animate: 'visible',
              exit: 'exit',
              className: 'rounded-3xl',
              style: { overflow: 'visible', background: 'rgba(255,255,255,0.98)', borderRadius: 32, boxShadow: '0 8px 40px rgba(0,0,0,0.10)' },
            }}
          >
            <Paper elevation={0} sx={{ borderRadius: 6, p: { xs: 2, sm: 4 }, background: 'transparent', boxShadow: 'none' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" fontWeight={700} color="primary.main">Ticket Details</Typography>
                <Button onClick={() => setSelectedTicket(null)} sx={{ minWidth: 0, p: 1, borderRadius: 2 }}>
                  <FaTimes className="h-5 w-5 text-gray-500" />
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box mb={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Title</Typography>
                <Typography variant="h6" color="text.primary" fontWeight={600}>{selectedTicket.issue}</Typography>
              </Box>
              <Box mb={3}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, background: '#f8fafc', fontSize: 15, color: '#222', whiteSpace: 'pre-line' }}>
                  {selectedTicket.description || 'No description provided.'}
                </Paper>
              </Box>
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Department</Typography>
                  <Typography variant="body1" color="text.primary">{selectedTicket.department}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Location</Typography>
                  <Typography variant="body1" color="text.primary">{selectedTicket.location}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Priority</Typography>
                  <Chip {...getPriorityChipProps(selectedTicket.priority)} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Status</Typography>
                  <Chip {...getStatusChipProps(selectedTicket.status)} size="small" />
                </Grid>
              </Grid>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Coordinator</Typography>
                  {selectedTicket.coordinator ? (
                    <Box>
                      <Typography variant="body1" fontWeight={500}>{selectedTicket.coordinator.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{selectedTicket.coordinator.email}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">N/A</Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Technician</Typography>
                  {selectedTicket.technician ? (
                    <Box>
                      <Typography variant="body1" fontWeight={500}>{selectedTicket.technician.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{selectedTicket.technician.email}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">Unassigned</Typography>
                  )}
                </Grid>
              </Grid>
              <DialogActions sx={{ mt: 4, px: 0 }}>
                <Button onClick={() => setSelectedTicket(null)} color="primary" variant="contained" fullWidth size="large" sx={{ borderRadius: 2, fontWeight: 600, fontSize: 16 }}>
                  Close
                </Button>
              </DialogActions>
            </Paper>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard; 