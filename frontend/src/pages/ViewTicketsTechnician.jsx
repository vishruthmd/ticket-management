import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios.libs.js";
// import NavbarTechnician from "../components/NavbarTechnician.jsx"; // Removed
import { CheckCircle, Eye } from "lucide-react";
import PageHeader from "../components/ui/PageHeader.jsx"; // Assuming we want to use PageHeader
import Card from "../components/ui/Card.jsx"; // Assuming we want to use Card
import DataTable from "../components/ui/DataTable.jsx"; // Assuming we want to use DataTable for consistency
import Button from "@mui/material/Button"; // For consistency with other action buttons
import Box from "@mui/material/Box";// For consistency with other action buttons
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip"; // For status
import { FaTimes, FaTicketAlt, FaTools, FaMapMarkerAlt, FaDesktop, FaUser, FaClock, FaEnvelope } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";

// Consistent status chip styling (can be moved to a shared util if used elsewhere)
const getStatusChipProps = (status) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "OPEN":
      return { label: "OPEN", sx: { bgcolor: "rgba(59, 130, 246, 0.1)", color: "#1d4ed8", fontWeight: 700, fontSize: 12, borderRadius: "12px", border: "1px solid rgba(59, 130, 246, 0.3)"} };
    case "IN_PROGRESS":
      return { label: "IN PROGRESS", sx: { bgcolor: "rgba(245, 158, 11, 0.1)", color: "#b45309", fontWeight: 700, fontSize: 12, borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.3)" } };
    case "CLOSED":
      return { label: "CLOSED", sx: { bgcolor: "rgba(34, 197, 94, 0.1)", color: "#15803d", fontWeight: 700, fontSize: 12, borderRadius: "12px", border: "1px solid rgba(34, 197, 94, 0.3)" } };
    default:
      return { label: status, sx: { fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
  }
};

// Priority chip styling helper
const getPriorityChipProps = (priority) => {
  const normalized = (priority || '').toUpperCase();
  switch (normalized) {
    case 'LOW':
      return { label: 'LOW', sx: { bgcolor: '#dcfce7', color: '#15803d', fontWeight: 700, fontSize: 12, borderRadius: '12px', border: '1px solid #bbf7d0' } };
    case 'MEDIUM':
      return { label: 'MEDIUM', sx: { bgcolor: '#fef9c3', color: '#b45309', fontWeight: 700, fontSize: 12, borderRadius: '12px', border: '1px solid #fde68a' } };
    case 'HIGH':
      return { label: 'HIGH', sx: { bgcolor: '#fee2e2', color: '#b91c1c', fontWeight: 700, fontSize: 12, borderRadius: '12px', border: '1px solid #fecaca' } };
    default:
      return { label: priority, sx: { fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
  }
};

// Styled components from ViewTicketPage.jsx
const GlassCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '20px',
  boxShadow: '0 24px 48px rgba(0, 0, 0, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.05)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
  }
}));

const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  padding: '10px 12px',
  borderRadius: '10px',
  margin: '4px 0',
  background: 'rgba(248, 250, 252, 0.5)',
  border: '1px solid rgba(226, 232, 240, 0.3)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'rgba(248, 250, 252, 0.8)',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  }
}));

const IconWrapper = styled(Box)(({ theme, color = '#3B82F6' }) => ({
  width: '36px',
  height: '36px',
  borderRadius: '10px',
  background: `${color}26`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '12px',
  border: `1.5px solid ${color}59`,
  flexShrink: 0,
  '& svg': {
    color: color,
    fontSize: '16px'
  }
}));

const modalVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 25 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.12, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.01 } },
  exit: { opacity: 0, scale: 0.92, y: 25, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] } }
};

const StyledButton = styled(Button)(({ theme, variant: buttonVariant }) => ({
  borderRadius: '12px',
  padding: '10px 20px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '14px',
  boxShadow: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(buttonVariant === 'contained' && {
    background: '#1D4ED8', // Solid blue
    color: 'white',
    '&:hover': {
      background: '#1E40AF', // Darker solid blue
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 24px rgba(59, 130, 246, 0.25)',
    }
  }),
  ...(buttonVariant === 'outlined' && {
    border: '1.5px solid rgba(59, 130, 246, 0.3)',
    color: '#3B82F6',
    background: 'rgba(59, 130, 246, 0.05)',
    '&:hover': {
      background: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3B82F6',
      transform: 'translateY(-1px)',
    }
  })
}));

const ViewTicketsTechnician = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  // const [ticketToClose, setTicketToClose] = useState(null); // Logic for closing can be added later if needed
  // const [updatingTicketId, setUpdatingTicketId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get("/tickets/technician-tickets");
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setFetchError("Failed to fetch tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const columns = [
    { header: "Title", field: "title", sortable: true },
    { header: "Department", field: "department", sortable: true },
    {
      header: "Location",
      field: "location",
      sortable: true,
      render: (row) => (row.location || '').toUpperCase(),
    },
    { header: "Device ID", field: "deviceId", sortable: true },
    {
      header: "Priority",
      field: "priority",
      sortable: true,
      render: (row) => <Chip {...getPriorityChipProps(row.priority)} size="small" />,
    },
    {
      header: "Status",
      field: "status",
      sortable: true,
      render: (row) => <Chip {...getStatusChipProps(row.status)} size="small" />,
    },
    {
      header: "Last Updated",
      field: "updatedAt",
      sortable: true,
      render: (row) => new Date(row.updatedAt).toLocaleString(),
    },
    {
      header: "Actions",
      field: "actions",
      sortable: false,
      render: (row) => (
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedTicket(row)}
            startIcon={<Eye size={16} />}
            sx={{ borderRadius: 1.5, textTransform: 'none'}}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];
  
  return (
    <React.Fragment> {/* Changed to React.Fragment as top-level wrapper is LayoutTechnician */}
      <PageHeader 
        title="Assigned Tickets"
        description="Tickets currently assigned to you"
      />
      <Card sx={{ mt: 3 }}> {/* Added margin top */} 
            {loading ? (
          <Typography sx={{ textAlign: 'center', py: 8 }}>Loading tickets...</Typography>
            ) : fetchError ? (
          <Typography color="error" sx={{ textAlign: 'center', py: 8 }}>{fetchError}</Typography>
        ) : (
          <DataTable columns={columns} data={tickets} />
        )}
      </Card>

      <AnimatePresence>
      {selectedTicket && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            className="fixed inset-0 flex items-center justify-center p-4"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(12px)',
              zIndex: 9999
            }}
              onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '680px', width: '100%' }}
            >
              <GlassCard>
                <Box sx={{ 
                  background: '#43454a', // Solid blue from ViewTicketPage
                  color: 'white', 
                  p: '16px 20px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width=\"50\" height=\"50\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.04\"%3E%3Cpath d=\"M30 0L60 30H0L30 0Z M30 60L0 30H60L30 60Z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                    opacity: 0.8,
                  }} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ 
                          bgcolor: 'rgba(255, 255, 255, 0.25)', 
                          mr: 1.5,
                          width: 44,
                          height: 44,
                          border: '2px solid rgba(255, 255, 255, 0.4)'
                        }}>
                          <FaTicketAlt style={{ color: 'white', fontSize: '22px' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" fontWeight={700}>
                            Ticket Details
                          </Typography>
                        </Box>
                      </Box>
                      <Button 
                        onClick={() => setSelectedTicket(null)} 
                        sx={{ 
                          minWidth: 0, 
                          p: 1.5, 
                          borderRadius: '12px',
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          color: 'white',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.25)',
                            transform: 'scale(1.05)'
                          },
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <FaTimes className="h-5 w-5" />
                      </Button>
                    </Box>
                  </motion.div>
                </Box>

                <Box sx={{ p: '16px 20px' }}>
                  <motion.div variants={itemVariants}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.75, color: '#1F2937' }}>
                        {selectedTicket.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Chip {...getStatusChipProps(selectedTicket.status)} />
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          • Created {new Date(selectedTicket.createdAt || Date.now()).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  {selectedTicket.description && (
                    <motion.div variants={itemVariants} style={{ marginBottom: '16px' }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 0.75, color: '#374151' }}>
                        Description
                      </Typography>
                      <Box sx={{ 
                        bgcolor: 'rgba(243, 244, 246, 0.8)', 
                        p: 1.5,
                        borderRadius: '12px',
                        border: '1px solid rgba(209, 213, 219, 0.7)', 
                        whiteSpace: 'pre-line',
                        fontSize: '13px',
                        lineHeight: 1.55, 
                        color: '#1F2937', 
                        minHeight: '60px',
                        maxHeight: '150px',
                        overflowY: 'auto', 
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
                      }}>
                {selectedTicket.description || "No description provided."}
                      </Box>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#374151' }}>
                      Ticket Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1, sm: 2 } }}>
                      <DetailRow>
                        <IconWrapper color="#3B82F6"> {/* Blue for Department */}
                          <FaTools />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>DEPARTMENT</Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937' }}>{selectedTicket.department}</Typography>
                        </Box>
                      </DetailRow>

                      <DetailRow>
                        <IconWrapper color="#10B981"> {/* Green for Location */}
                          <FaMapMarkerAlt />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>LOCATION</Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937' }}>{selectedTicket.location}</Typography>
                        </Box>
                      </DetailRow>

                      <DetailRow>
                        <IconWrapper color="#8B5CF6"> {/* Purple for Device ID */}
                          <FaDesktop />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>DEVICE ID</Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937', fontFamily: 'monospace' }}>{selectedTicket.deviceId}</Typography>
                        </Box>
                      </DetailRow>

                      <DetailRow>
                        <IconWrapper color="#F59E0B"> {/* Yellow for Coordinator */}
                          <FaUser />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500, mb: 0.25 }}>COORDINATOR</Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937', mb: selectedTicket.coordinator?.email ? 0.25 : 0 }}>
                            {selectedTicket.coordinator?.name || "Unknown"}
                          </Typography>
                          {selectedTicket.coordinator?.email && (
                            <Typography variant="caption" sx={{ color: '#4B5563', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FaEnvelope size={11}/> {selectedTicket.coordinator.email}
                            </Typography>
                          )}
                        </Box>
                      </DetailRow>

                      <DetailRow>
                        <IconWrapper color="#EF4444"> {/* Red for Last Updated */}
                          <FaClock />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>LAST UPDATED</Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937' }}>{new Date(selectedTicket.updatedAt).toLocaleString()}</Typography>
                        </Box>
                      </DetailRow>
                    </Box>
                  </motion.div>

                  <motion.div 
                    variants={itemVariants}
                    style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
                  >
                    <StyledButton
                onClick={() => setSelectedTicket(null)}
                      variant="outlined"
              >
                Close
                    </StyledButton>
                  </motion.div>
                </Box>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};

export default ViewTicketsTechnician;
