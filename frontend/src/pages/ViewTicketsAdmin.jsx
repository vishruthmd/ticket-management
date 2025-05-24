import React, { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import { axiosInstance } from "../libs/axios.libs.js";
import { motion, AnimatePresence } from "framer-motion";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { FaTimes } from "react-icons/fa";

const getStatusChipProps = (status) => {
  const normalized = (status || "").toUpperCase();
  switch (normalized) {
    case "OPEN":
      return { label: "OPEN", sx: { bgcolor: "#dbeafe", color: "#1d4ed8", fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    case "IN_PROGRESS":
      return { label: "IN PROGRESS", sx: { bgcolor: "#fef9c3", color: "#b45309", fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    case "CLOSED":
      return { label: "CLOSED", sx: { bgcolor: "#dcfce7", color: "#15803d", fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
    default:
      return { label: status, sx: { fontWeight: 600, fontSize: 13, borderRadius: 9999 } };
  }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 40 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2, ease: "easeIn" } },
};

const ViewTicketsAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get("/tickets/get-all-tickets");
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error("Error fetching admin tickets:", error);
        setFetchError("Failed to fetch tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const columns = [
    {
      header: "Title",
      field: "title",
      sortable: true,
      render: (row) => (
        <div className="max-w-[125px] truncate" title={row.title}>{row.title}</div>
      ),
    },
    { header: "Department", field: "department", sortable: true },
    { header: "Location", field: "location", sortable: true },
    {
      header: "Priority",
      field: "priority",
      sortable: true,
      render: (row) => <Chip label={row.priority} sx={{
        bgcolor: row.priority === 'HIGH' ? '#fee2e2' : row.priority === 'MEDIUM' ? '#fef9c3' : '#dcfce7',
        color: row.priority === 'HIGH' ? '#b91c1c' : row.priority === 'MEDIUM' ? '#b45309' : '#15803d',
        fontWeight: 600, fontSize: 13, borderRadius: 9999
      }} size="small" />,
    },
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
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => setSelectedTicket(row)}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="All Tickets"
        description="Admin view of all tickets"
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
      <AnimatePresence>
        {selectedTicket && (
          <Dialog
            open={!!selectedTicket}
            onClose={() => setSelectedTicket(null)}
            maxWidth="md"
            fullWidth
            PaperProps={{
              variants: modalVariants,
              initial: "hidden",
              animate: "visible",
              exit: "exit",
              className: "rounded-3xl",
              style: { overflow: "visible", background: "rgba(255,255,255,0.98)", borderRadius: 32, boxShadow: "0 8px 40px rgba(0,0,0,0.10)" },
            }}
          >
            <Paper elevation={0} sx={{ borderRadius: 6, p: { xs: 2, sm: 4 }, background: "transparent", boxShadow: "none" }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  Ticket Details
                </Typography>
                <Button onClick={() => setSelectedTicket(null)} sx={{ minWidth: 0, p: 1, borderRadius: 2 }}>
                  <FaTimes className="h-5 w-5 text-gray-500" />
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>Description</Typography>
                <Typography variant="body2" sx={{ bgcolor: '#f3f4f6', p: 2, borderRadius: 2, whiteSpace: 'pre-line' }}>
                  {selectedTicket.description || "No description provided."}
                </Typography>
              </Box>
              <Box className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Field</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-3 font-medium">Title</td>
                      <td className="px-4 py-3">{selectedTicket.title}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Department</td>
                      <td className="px-4 py-3">{selectedTicket.department}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Location</td>
                      <td className="px-4 py-3">{selectedTicket.location}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Priority</td>
                      <td className="px-4 py-3"><Chip label={selectedTicket.priority} sx={{
                        bgcolor: selectedTicket.priority === 'HIGH' ? '#fee2e2' : selectedTicket.priority === 'MEDIUM' ? '#fef9c3' : '#dcfce7',
                        color: selectedTicket.priority === 'HIGH' ? '#b91c1c' : selectedTicket.priority === 'MEDIUM' ? '#b45309' : '#15803d',
                        fontWeight: 600, fontSize: 13, borderRadius: 9999
                      }} size="small" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Status</td>
                      <td className="px-4 py-3"><Chip {...getStatusChipProps(selectedTicket.status)} size="small" /></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">Technician</td>
                      <td className="px-4 py-3">{selectedTicket.technician?.name || "Not Assigned"}</td>
                    </tr>
                  </tbody>
                </table>
              </Box>
              <Box mt={4} textAlign="right">
                <Button
                  onClick={() => setSelectedTicket(null)}
                  color="primary"
                  variant="contained"
                  sx={{ borderRadius: 2, fontWeight: 600 }}
                >
                  Close
                </Button>
              </Box>
            </Paper>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewTicketsAdmin;
