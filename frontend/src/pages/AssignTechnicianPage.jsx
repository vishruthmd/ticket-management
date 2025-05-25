import React, { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../libs/axios.libs";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { FaTimes } from "react-icons/fa";
import DataTable from "../components/ui/DataTable";
import dayjs from "dayjs";

const getStatusChipProps = (status) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "OPEN":
      return {
        label: "OPEN",
        sx: {
          bgcolor: "#dbeafe",
          color: "#1d4ed8",
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 9999,
        },
      };
    case "IN_PROGRESS":
      return {
        label: "IN PROGRESS",
        sx: {
          bgcolor: "#fef9c3",
          color: "#b45309",
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 9999,
        },
      };
    case "CLOSED":
      return {
        label: "CLOSED",
        sx: {
          bgcolor: "#dcfce7",
          color: "#15803d",
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 9999,
        },
      };
    default:
      return {
        label: status,
        sx: { fontWeight: 600, fontSize: 13, borderRadius: 9999 },
      };
  }
};

const getPriorityChipProps = (priority) => {
  const normalized = (priority || "").toUpperCase();
  switch (normalized) {
    case "HIGH":
      return {
        label: "HIGH",
        sx: {
          bgcolor: "#fee2e2",
          color: "#b91c1c",
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 9999,
        },
      };
    case "MEDIUM":
      return {
        label: "MEDIUM",
        sx: {
          bgcolor: "#fef9c3",
          color: "#b45309",
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 9999,
        },
      };
    case "LOW":
      return {
        label: "LOW",
        sx: {
          bgcolor: "#dcfce7",
          color: "#15803d",
          fontWeight: 600,
          fontSize: 13,
          borderRadius: 9999,
        },
      };
    default:
      return {
        label: priority,
        sx: { fontWeight: 600, fontSize: 13, borderRadius: 9999 },
      };
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 40,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

const AssignTechnicianPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [techLoading, setTechLoading] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchOpenTickets = async () => {
      try {
        const response = await axiosInstance.get("/tickets/open-tickets");
        setTickets(response.data.tickets || []);
      } catch (error) {
        setFetchError("Failed to fetch open tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchOpenTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      setTechLoading(true);
      axiosInstance
        .get("/users/all-technicians")
        .then((res) => {
          setTechnicians(res.data.technicians);
        })
        .catch(() => {
          setTechnicians([]);
        })
        .finally(() => setTechLoading(false));
    }
  }, [selectedTicket]);

  const handleAssign = async () => {
    if (!selectedTechnicianId) {
      setAssignError("Please select a technician.");
      return;
    }
    setAssigning(true);
    setAssignError(null);
    try {
      await axiosInstance.put(
        `/tickets/set-to-in-progress/${selectedTicket.id}/${selectedTechnicianId}`
      );
      setTickets((prev) => prev.filter((t) => t.id !== selectedTicket.id));
      setSelectedTicket(null);
      setSelectedTechnicianId("");
    } catch (error) {
      setAssignError("Assignment failed. Try again.");
    } finally {
      setAssigning(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const priorityMatch = priorityFilter === "ALL" || (ticket.priority || "").toUpperCase() === priorityFilter;
    const statusMatch = statusFilter === "ALL" || (ticket.status || "").toUpperCase() === statusFilter;
    return priorityMatch && statusMatch;
  });

  return (
    <div>
      <PageHeader
        title="Assign Technician"
        description="Assign a technician to open tickets."
      />
      <Card className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">
            <CircularProgress />
          </div>
        ) : fetchError ? (
          <div className="text-center py-8 text-red-500">{fetchError}</div>
        ) : (
          <DataTable
            columns={[
              {
                header: "Title",
                field: "title",
                sortable: true,
                render: (row) => (
                  <div className="max-w-[125px] truncate" title={row.title}>{row.title}</div>
                ),
              },
              { header: "Department", field: "department", sortable: true },
              {
                header: "Location",
                field: "location",
                sortable: true,
                render: (row) => (row.location ? row.location.toUpperCase() : ""),
              },
              {
                header: (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    Priority
                    <Select
                      size="small"
                      value={priorityFilter}
                      onChange={e => setPriorityFilter(e.target.value)}
                      variant="standard"
                      sx={{ ml: 0.5, minWidth: 60, maxWidth: 80, fontSize: 12, p: 0, '& .MuiSelect-select': { p: '2px 16px 2px 6px', fontSize: 12 } }}
                      disableUnderline
                    >
                      <MenuItem value="ALL">All</MenuItem>
                      <MenuItem value="HIGH">High</MenuItem>
                      <MenuItem value="MEDIUM">Medium</MenuItem>
                      <MenuItem value="LOW">Low</MenuItem>
                    </Select>
                  </Box>
                ),
                field: "priority",
                sortable: false,
                render: (row) => <Chip {...getPriorityChipProps(row.priority || "MEDIUM") } size="small" />,
              },
              {
                header: (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    Status
                    <Select
                      size="small"
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                      variant="standard"
                      sx={{ ml: 0.5, minWidth: 80, maxWidth: 110, fontSize: 12, p: 0, '& .MuiSelect-select': { p: '2px 16px 2px 6px', fontSize: 12 } }}
                      disableUnderline
                    >
                      <MenuItem value="ALL">All</MenuItem>
                      <MenuItem value="OPEN">Open</MenuItem>
                      <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                      <MenuItem value="CLOSED">Closed</MenuItem>
                    </Select>
                  </Box>
                ),
                field: "status",
                sortable: false,
                render: (row) => <Chip {...getStatusChipProps(row.status)} size="small" />,
              },
              {
                header: "Coordinator",
                field: "coordinator",
                sortable: false,
                render: (row) => row.coordinator?.name || "N/A",
              },
              {
                header: "Last Updated",
                field: "updatedAt",
                sortable: true,
                render: (row) => (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 0.2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#1d4ed8', fontSize: 13 }}>
                      {dayjs(row.updatedAt).format('DD MMM YYYY')}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b', fontSize: 11, letterSpacing: 0.2 }}>
                      {dayjs(row.updatedAt).format('hh:mm A')}
                    </Typography>
                  </Box>
                ),
              },
              {
                header: "Actions",
                field: "actions",
                sortable: false,
                render: (row) => (
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => setSelectedTicket(row)}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 600,
                      borderWidth: 2,
                      borderColor: '#2563eb',
                      color: '#2563eb',
                      background: 'white',
                      transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                      boxShadow: 'none',
                      '&:hover': {
                        background: '#eff6ff',
                        borderColor: '#1d4ed8',
                        color: '#1d4ed8',
                        transform: 'scale(1.05)',
                        boxShadow: '0 2px 8px 0 rgba(37,99,235,0.08)',
                      },
                      '&:active': {
                        background: '#dbeafe',
                        borderColor: '#1e40af',
                        color: '#1e40af',
                        transform: 'scale(0.98)',
                      },
                    }}
                  >
                    Assign
                  </Button>
                ),
              },
            ]}
            data={filteredTickets}
          />
        )}
      </Card>
      <AnimatePresence>
        {selectedTicket && (
          <Dialog
            open={!!selectedTicket}
            onClose={() => {
              setSelectedTicket(null);
              setSelectedTechnicianId("");
              setAssignError(null);
            }}
            maxWidth="sm"
            fullWidth
            PaperProps={{
              // component: motion.div,
              variants: modalVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
              className: "rounded-3xl",
              style: {
                overflow: "visible",
                background: "rgba(255,255,255,0.98)",
                borderRadius: 32,
                boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
              },
            }}
          >
            <Paper
              elevation={0}
              sx={{
                borderRadius: 6,
                p: { xs: 2, sm: 4 },
                background: "transparent",
                boxShadow: "none",
                overflowY: "auto",
                whiteSpace: "pre-wrap", // allow line wrapping
                wordBreak: "break-word",
              }}
            >
              <DialogContent
                dividers
                sx={{
                  maxHeight: "80vh",
                  overflowY: "auto",
                  p: { xs: 2, sm: 4 },
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color="primary.main"
                  >
                    Assign Technician
                  </Typography>
                  <Button
                    onClick={() => {
                      setSelectedTicket(null);
                      setSelectedTechnicianId("");
                      setAssignError(null);
                    }}
                    sx={{ minWidth: 0, p: 1, borderRadius: 2 }}
                  >
                    <FaTimes className="h-5 w-5 text-gray-500" />
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box mb={3}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Title
                  </Typography>
                  <Typography
                    variant="h6"
                    color="text.primary"
                    fontWeight={600}
                  >
                    {selectedTicket.title}
                  </Typography>
                </Box>
                <Box mb={3}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Description
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      background: "#f8fafc",
                      fontSize: 15,
                      color: "#222",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {selectedTicket.description || "No description provided."}
                  </Paper>
                </Box>
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Department
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      {selectedTicket.department}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Location
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      {selectedTicket.location ? selectedTicket.location.toUpperCase() : ""}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Priority
                    </Typography>
                    <Chip
                      {...getPriorityChipProps(
                        selectedTicket.priority || "MEDIUM"
                      )}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Status
                    </Typography>
                    <Chip
                      {...getStatusChipProps(selectedTicket.status)}
                      size="small"
                    />
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Coordinator
                    </Typography>
                    {selectedTicket.coordinator ? (
                      <Box>
                        <Typography variant="body1" fontWeight={500}>
                          {selectedTicket.coordinator.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {selectedTicket.coordinator.email}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </Grid>
                </Grid>
                <Divider sx={{ mb: 3 }} />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="technician-select-label">
                    Select Technician
                  </InputLabel>
                  <Select
                    labelId="technician-select-label"
                    id="technician-select"
                    value={selectedTechnicianId}
                    label="Select Technician"
                    onChange={(e) => setSelectedTechnicianId(e.target.value)}
                    disabled={techLoading}
                    sx={{ borderRadius: 2, bgcolor: "#f8fafc" }}
                  >
                    <MenuItem value="" disabled>
                      Choose a technician
                    </MenuItem>
                    {technicians.map((tech) => (
                      <MenuItem key={tech.id} value={tech.id}>
                        {tech.name} ({tech.email})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {assignError && (
                  <Box
                    mt={2}
                    mb={1}
                    color="error.main"
                    bgcolor="#fee2e2"
                    borderRadius={2}
                    px={2}
                    py={1}
                    fontSize={14}
                  >
                    {assignError}
                  </Box>
                )}
                <DialogActions sx={{ mt: 2, px: 0 }}>
                  <Button
                    onClick={() => {
                      setSelectedTicket(null);
                      setSelectedTechnicianId("");
                      setAssignError(null);
                    }}
                    color="inherit"
                    variant="outlined"
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2, fontWeight: 600, fontSize: 16 }}
                    disabled={assigning}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAssign}
                    color="primary"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ borderRadius: 2, fontWeight: 600, fontSize: 16 }}
                    disabled={assigning}
                    startIcon={
                      assigning && (
                        <CircularProgress size={18} color="inherit" />
                      )
                    }
                  >
                    {assigning ? "Assigning..." : "Assign Technician"}
                  </Button>
                </DialogActions>
              </DialogContent>
            </Paper>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AssignTechnicianPage;
