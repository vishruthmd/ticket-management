import React, { useState } from 'react';
import { axiosInstance } from "../libs/axios.libs.js";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaPlusCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const DEPARTMENTS = ["ISE", "CSE", "AIML", "BT", "CV", "ME", "ETE", "EIE", "ECE", "ASE", "IDRC", "LIB", "CMT"];

const PRIORITIES = [
  { value: 'LOW', label: 'Low', bgcolor: '#e6f4ea', color: '#2e7d32', border: '#c8e6c9' },
  { value: 'MEDIUM', label: 'Medium', bgcolor: '#fff9e6', color: '#c77700', border: '#ffecb3' },
  { value: 'HIGH', label: 'High', bgcolor: '#ffeeee', color: '#c62828', border: '#ffcdd2' },
];

const Bg = styled(Box)`
  min-height: 100vh;
  width: 100vw;
  background: #f5f7fa;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
`;

const Card = styled(motion.div)(({ theme }) => ({
  background: '#fff',
  boxShadow: theme.shadows[4],
  borderRadius: 20,
  border: `1.5px solid ${theme.palette.grey[200]}`,
  padding: '36px 32px 28px 32px',
  maxWidth: 980,
  width: '100%',
  margin: '32px 0',
  [theme.breakpoints.down('md')]: {
    padding: '18px 4px 12px 4px',
    maxWidth: '99vw',
  },
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'auto',
}));

const ProgressBar = styled(Box)(({ theme }) => ({
  height: 5,
  width: '100%',
  background: theme.palette.primary.main,
  borderRadius: 8,
  marginBottom: 18,
  opacity: 0.18,
}));

const FloatingLabelField = styled(TextField)(({ theme }) => ({
  '& label.Mui-focused': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    background: theme.palette.grey[50],
    transition: 'box-shadow 0.2s',
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: `0 0 0 2px ${theme.palette.primary.main}22`,
    },
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 999,
  fontWeight: 700,
  fontSize: '0.9rem',
  padding: '8px 18px',
  boxShadow: '0 2px 12px 0 rgba(25,118,210,0.08)',
  transition: 'transform 0.12s, box-shadow 0.12s',
  '&:hover': {
    transform: 'translateY(-2px) scale(1.03)',
    boxShadow: '0 4px 24px 0 rgba(25,118,210,0.13)',
  },
}));

const FieldsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(3.5),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2.5),
  },
}));

const PriorityButton = styled(Button)(({ bgcolor, color, border, selected }) => ({
  background: bgcolor,
  color: color,
  border: `2px solid ${selected ? color : border}`,
  fontWeight: 600,
  fontSize: '0.95rem',
  borderRadius: 12,
  minWidth: 100,
  padding: '8px 16px',
  boxShadow: selected ? `0 2px 10px 0 ${color}22` : 'none',
  transition: 'all 0.15s',
  outline: selected ? `2px solid ${color}55` : 'none',
  '&:hover': {
    background: bgcolor,
    border: `2.5px solid ${color}`,
    boxShadow: `0 3px 15px 0 ${color}22`,
    color: color,
  },
}));

const CreateTicketPage = () => {
  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    department: '',
    lab: '',
    deviceType: '',
    deviceId: '',
    priority: 'LOW',
    status: 'OPEN',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: value });
  };

  const handlePriority = (priority) => {
    setTicket({ ...ticket, priority });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);
    setIsError(false);

    const ticketDataToSend = {
      title: ticket.title,
      department: ticket.department,
      deviceId: ticket.deviceId,
      location: ticket.lab,
      description: ticket.description,
      priority: ticket.priority,
    };

    try {
      const response = await axiosInstance.post("/tickets/create", ticketDataToSend);
      const data = response.data;
      setSubmitMessage(data.message || 'Ticket created successfully!');
      setIsError(false);
      setTicket({
        title: '',
        description: '',
        department: '',
        lab: '',
        deviceType: '',
        deviceId: '',
        priority: 'MEDIUM',
        status: 'OPEN',
      });
    } catch (error) {
      setSubmitMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Bg>
      <Card
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <ProgressBar as={motion.div} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.2, ease: 'easeOut' }} />
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Box color="#1976d2" fontSize={isMobile ? 28 : 34} paddingBottom={1}>
            <FaPlusCircle />
          </Box>
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            fontWeight={700} 
            color="#1e293b" 
            sx={{ 
              fontSize: isMobile ? '1.4rem' : '1.75rem',
            }}
            paddingBottom={1}
          >
            Create Support Ticket
          </Typography>
        </Box>
        
        {submitMessage && (
          <Alert 
            severity={isError ? "error" : "success"} 
            sx={{ mb: 2, borderRadius: 2 }}
          >
            {submitMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit} autoComplete="off" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <FieldsGrid>
            <FloatingLabelField
              fullWidth
              label="Title"
              name="title"
              value={ticket.title}
              onChange={handleChange}
              required
              variant="outlined"
              placeholder="Brief title of the issue"
              autoFocus
            />
            <FloatingLabelField
              fullWidth
              select
              label="Department"
              name="department"
              value={ticket.department}
              onChange={handleChange}
              required
              variant="outlined"
            >
              <MenuItem value="" disabled>
                Select Department
              </MenuItem>
              {DEPARTMENTS.map((dep) => (
                <MenuItem key={dep} value={dep}>
                  {dep}
                </MenuItem>
              ))}
            </FloatingLabelField>
            <FloatingLabelField
              fullWidth
              label="Lab / Location"
              name="lab"
              value={ticket.lab}
              onChange={handleChange}
              required
              variant="outlined"
              placeholder="Lab number or name (e.g., F101, Library)"
            />
            <FloatingLabelField
              fullWidth
              label="Device Type"
              name="deviceType"
              value={ticket.deviceType}
              onChange={handleChange}
              variant="outlined"
              placeholder="Computer, Printer, etc."
            />
            <FloatingLabelField
              fullWidth
              label="Device ID"
              name="deviceId"
              value={ticket.deviceId}
              onChange={handleChange}
              required
              variant="outlined"
              placeholder="Serial number or ID"
            />
            <Box display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center" sx={{ mt: isMobile ? 1 : 0 }}>
              {/* <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#374151', letterSpacing: 0.2 }}>
                Priority
              </Typography> */}
              <Box display="flex" gap={2}>
                {PRIORITIES.map((p) => (
                  <PriorityButton
                    key={p.value}
                    bgcolor={p.bgcolor}
                    color={p.color}
                    border={p.border}
                    selected={ticket.priority === p.value}
                    type="button"
                    onClick={() => handlePriority(p.value)}
                  >
                    {p.label}
                  </PriorityButton>
                ))}
              </Box>
            </Box>
          </FieldsGrid>
          <Box mt={isMobile ? 1.5 : 2} mb={isMobile ? 1.5 : 2}>
            <FloatingLabelField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={ticket.description}
              onChange={handleChange}
              required
              variant="outlined"
              placeholder="Please provide detailed information about the issue"
            />
          </Box>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
            <ActionButton 
              variant="outlined" 
              color="inherit"
              onClick={() => {
                setTicket({
                  title: '',
                  description: '',
                  department: '',
                  lab: '',
                  deviceType: '',
                  deviceId: '',
                  priority: 'LOW',
                  status: 'OPEN',
                });
              }}
              disabled={isSubmitting}
            >
              Cancel
            </ActionButton>
            <ActionButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{
                background: '#1976d2',
                color: 'white',
                '&:hover': {
                  background: '#1565c0',
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </ActionButton>
          </Box>
        </form>
      </Card>
    </Bg>
  );
};

export default CreateTicketPage;