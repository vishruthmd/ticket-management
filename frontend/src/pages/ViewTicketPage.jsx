import React, { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import { axiosInstance } from "../libs/axios.libs.js";
import { motion, AnimatePresence } from "framer-motion";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { FaTimes, FaEye, FaCheck, FaTicketAlt, FaTools, FaMapMarkerAlt, FaClock, FaUser, FaDesktop, FaEnvelope } from "react-icons/fa";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import LinearProgress from "@mui/material/LinearProgress";

const getStatusChipProps = (status) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "OPEN":
      return { 
        label: "OPEN", 
        sx: { 
          bgcolor: "rgba(59, 130, 246, 0.1)", 
          color: "#1d4ed8", 
          fontWeight: 700, 
          fontSize: 12, 
          borderRadius: "12px",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          backdropFilter: "blur(8px)"
        } 
      };
    case "IN_PROGRESS":
      return { 
        label: "IN PROGRESS", 
        sx: { 
          bgcolor: "rgba(245, 158, 11, 0.1)", 
          color: "#b45309", 
          fontWeight: 700, 
          fontSize: 12, 
          borderRadius: "12px",
          border: "1px solid rgba(245, 158, 11, 0.3)",
          backdropFilter: "blur(8px)"
        } 
      };
    case "CLOSED":
      return { 
        label: "CLOSED", 
        sx: { 
          bgcolor: "rgba(34, 197, 94, 0.1)", 
          color: "#15803d", 
          fontWeight: 700, 
          fontSize: 12, 
          borderRadius: "12px",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          backdropFilter: "blur(8px)"
        } 
      };
    default:
      return { label: status, sx: { fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
  }
};

const GlassCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '24px',
  boxShadow: '0 32px 64px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.05)',
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
  padding: '12px 16px',
  borderRadius: '12px',
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
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: `linear-gradient(135deg, ${color}2A, ${color}4D)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '16px',
  border: `1.5px solid ${color}59`,
  flexShrink: 0,
  '& svg': {
    color: color,
    fontSize: '18px'
  }
}));

const modalVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.92, 
    y: 25 
  },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.2, 
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.02 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.92, 
    y: 25,
    transition: { 
      duration: 0.15, 
      ease: [0.4, 0, 0.2, 1] 
    } 
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
  }
};

const StyledButton = styled(Button)(({ theme, variant: buttonVariant }) => ({
  borderRadius: '14px',
  padding: '12px 24px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '14px',
  boxShadow: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(buttonVariant === 'contained' && {
    background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    '&:hover': {
      background: 'linear-gradient(135deg, #1D4ED8, #1E40AF)',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 24px rgba(59, 130, 246, 0.4)',
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

const ViewTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToClose, setTicketToClose] = useState(null);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get("/tickets/coordinator-tickets");
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

  const confirmMarkAsClosed = async () => {
    if (!ticketToClose) return;
    try {
      setUpdatingTicketId(ticketToClose.id);
      const response = await axiosInstance.put(`/tickets/set-to-closed/${ticketToClose.id}`);
      const updatedTicket = response.data.ticket;
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setUpdatingTicketId(null);
      setTicketToClose(null);
    }
  };

  const getStatusColor = (status) => {
    const normalized = (status || "").toUpperCase();
    switch (normalized) {
      case "OPEN": return "#3B82F6";
      case "IN_PROGRESS": return "#F59E0B";
      case "CLOSED": return "#10B981";
      default: return "#6B7280";
    }
  };

  const columns = [
    { header: "Title", field: "title", sortable: true },
    { header: "Department", field: "department", sortable: true },
    { header: "Location", field: "location", sortable: true },
    { header: "Device ID", field: "deviceId", sortable: true },
    {
      header: "Status",
      field: "status",
      sortable: true,
      render: (row) => <Chip {...getStatusChipProps(row.status)} size="small" />,
    },
    {
      header: "Technician",
      field: "technician",
      sortable: false,
      render: (row) => row.technician?.name || "Not Assigned",
    },
    {
      header: "Resolved At",
      field: "resolvedAt",
      sortable: true,
      render: (row) => row.resolvedAt ? new Date(row.resolvedAt).toLocaleString() : "—",
    },
    {
      header: "Actions",
      field: "actions",
      sortable: false,
      render: (row) => (
        <Box display="flex" flexDirection="row" gap={1} alignItems="center" justifyContent="center">
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedTicket(row)}
            sx={{ minWidth: 0, p: 1, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <FaEye className="h-4 w-4" />
          </Button>
          {row.status === "IN_PROGRESS" && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setTicketToClose(row)}
              disabled={updatingTicketId === row.id}
              sx={{ minWidth: 0, p: 1, borderRadius: 2, color: 'green', borderColor: 'green', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <FaCheck className="h-4 w-4" />
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Tickets"
        description="Here are the tickets you have raised"
      />
      <Card className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">Loading tickets...</div>
        ) : fetchError ? (
          <div className="text-center py-8 text-red-500">{fetchError}</div>
        ) : (
          <DataTable columns={columns} data={tickets} />
        )}
      </Card>

      {/* Enhanced Ticket Details Modal */}
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
              style={{ maxWidth: '760px', width: '100%' }}
            >
              <GlassCard>
                {/* Header */}
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', 
                  color: 'white', 
                  p: '20px 24px',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="50" height="50" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.04"%3E%3Cpath d="M30 0L60 30H0L30 0Z M30 60L0 30H60L30 60Z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
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
                          mr: 2, 
                          width: 52,
                          height: 52,
                          border: '2px solid rgba(255, 255, 255, 0.4)'
                        }}>
                          <FaTicketAlt style={{ color: 'white', fontSize: '24px' }} />
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

                <Box sx={{ p: '20px 24px' }}>
                  {/* Title and Status */}
                  <motion.div variants={itemVariants}>
                    <Box sx={{ mb: 2.5 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: '#1F2937' }}>
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

                  {/* Description Section - Full Width */}
                  {selectedTicket.description && (
                    <motion.div variants={itemVariants} style={{ marginBottom: '20px' }}>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1, color: '#374151' }}>
                        Description
                      </Typography>
                      <Box sx={{ 
                        bgcolor: 'rgba(243, 244, 246, 0.8)', 
                        p: 2,
                        borderRadius: '14px',
                        border: '1px solid rgba(209, 213, 219, 0.7)', 
                        whiteSpace: 'pre-line',
                        fontSize: '14px',
                        lineHeight: 1.6, 
                        color: '#1F2937', 
                        minHeight: '80px',
                        maxHeight: '180px',
                        overflowY: 'auto', 
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
                      }}>
                        {selectedTicket.description || "No description provided."}
                      </Box>
                    </motion.div>
                  )}

                  {/* Ticket Information Section - Below Description, potentially two-column */}
                  <motion.div variants={itemVariants}>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1.5, color: '#374151' }}>
                      Ticket Information
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 1.5, sm: 2.5 } }}>
                      <DetailRow>
                        <IconWrapper color="#3B82F6">
                          <FaTools />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>
                            DEPARTMENT
                          </Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937' }}>
                            {selectedTicket.department}
                          </Typography>
                        </Box>
                      </DetailRow>

                      <DetailRow>
                        <IconWrapper color="#10B981">
                          <FaMapMarkerAlt />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>
                            LOCATION
                          </Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937' }}>
                            {selectedTicket.location}
                          </Typography>
                        </Box>
                      </DetailRow>

                      <DetailRow>
                        <IconWrapper color="#8B5CF6">
                          <FaDesktop />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>
                            DEVICE ID
                          </Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937', fontFamily: 'monospace' }}>
                            {selectedTicket.deviceId}
                          </Typography>
                        </Box>
                      </DetailRow>

                      <DetailRow>
                        <IconWrapper color="#F59E0B">
                          <FaUser />
                        </IconWrapper>
                        <Box flex={1}>
                          <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500, mb: 0.25 }}>
                            ASSIGNED TECHNICIAN
                          </Typography>
                          <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937', mb: selectedTicket.technician?.email ? 0.25 : 0 }}>
                            {selectedTicket.technician?.name || "Not Assigned"}
                          </Typography>
                          {selectedTicket.technician?.email && (
                            <Typography variant="caption" sx={{ color: '#4B5563', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <FaEnvelope size={11}/> {selectedTicket.technician.email}
                            </Typography>
                          )}
                        </Box>
                      </DetailRow>

                      {selectedTicket.resolvedAt && (
                        <DetailRow>
                          <IconWrapper color="#EF4444">
                            <FaClock />
                          </IconWrapper>
                          <Box flex={1}>
                            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px', fontWeight: 500 }}>
                              RESOLVED AT
                            </Typography>
                            <Typography variant="body1" fontWeight={600} sx={{ color: '#1F2937' }}>
                              {new Date(selectedTicket.resolvedAt).toLocaleString()}
                            </Typography>
                          </Box>
                        </DetailRow>
                      )}
                    </Box>
                  </motion.div>

                  {/* Actions */}
                  <motion.div 
                    variants={itemVariants}
                    style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}
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

      {/* Enhanced Confirmation Modal */}
      <AnimatePresence>
        {ticketToClose && (
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
            onClick={() => setTicketToClose(null)}
          >
            <motion.div
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '400px', width: '100%' }}
            >
              <GlassCard>
                <Box sx={{ 
                  background: 'linear-gradient(135deg, #10B981, #059669)', 
                  color: 'white', 
                  p: '20px 24px',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'url("data:image/svg+xml,%3Csvg width="50" height="50" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.04"%3E%3Cpath d="M30 0L60 30H0L30 0Z M30 60L0 30H60L30 60Z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat',
                    opacity: 0.8,
                  }} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    <Avatar sx={{ 
                      bgcolor: 'rgba(255, 255, 255, 0.25)', 
                      mx: 'auto',
                      mb: 1.5,
                      width: 56, 
                      height: 56,
                      border: '2px solid rgba(255, 255, 255, 0.4)'
                    }}>
                      <FaCheck style={{ color: 'white', fontSize: '28px' }} />
                    </Avatar>
                    <Typography variant="h6" fontWeight={700}>
                      Close Ticket
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                      Confirm your action
                    </Typography>
                  </motion.div>
                </Box>

                <Box sx={{ p: '24px 28px', textAlign: 'center' }}>
                  <Typography variant="body1" sx={{ mb: 1, color: '#374151' }}>
                    Are you sure you want to mark this ticket as
                  </Typography>
                  <Chip 
                    label="CLOSED" 
                    sx={{ 
                      bgcolor: "rgba(34, 197, 94, 0.1)", 
                      color: "#15803d", 
                      fontWeight: 700,
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      mb: 2
                    }} 
                  />
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
                    This action cannot be undone.
                  </Typography>

                  {updatingTicketId === ticketToClose?.id && (
                    <Box sx={{ mb: 3 }}>
                      <LinearProgress 
                        sx={{ 
                          borderRadius: '4px',
                          height: '6px',
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: '#10B981'
                          }
                        }} 
                      />
                      <Typography variant="body2" sx={{ mt: 1, color: '#6B7280' }}>
                        Closing ticket...
                      </Typography>
                    </Box>
                  )}

                  <Box display="flex" gap={2} justifyContent="center">
                    <StyledButton
                      onClick={() => setTicketToClose(null)}
                      variant="outlined"
                      disabled={updatingTicketId === ticketToClose?.id}
                    >
                      Cancel
                    </StyledButton>
                    <StyledButton
                      onClick={confirmMarkAsClosed}
                      variant="contained"
                      disabled={updatingTicketId === ticketToClose?.id}
                      sx={{
                        background: 'linear-gradient(135deg, #10B981, #059669)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #059669, #047857)',
                        }
                      }}
                    >
                      {updatingTicketId === ticketToClose?.id ? "Closing..." : "Confirm"}
                    </StyledButton>
                  </Box>
                </Box>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewTicketPage;