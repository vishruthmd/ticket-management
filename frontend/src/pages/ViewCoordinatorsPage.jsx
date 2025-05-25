import React, { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../libs/axios.libs.js";
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

const ViewCoordinatorsPage = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);

  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const response = await axiosInstance.get("/users/all-coordinators");
        setCoordinators(response.data.coordinators || []);
      } catch (error) {
        console.error("Error fetching coordinators:", error);
        setFetchError("Failed to fetch coordinators. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCoordinators();
  }, []);

  const columns = [
    { header: "Name", field: "name", sortable: true },
    { header: "Email", field: "email", sortable: true },
    {
      header: "Total Tickets",
      field: "totalTickets",
      sortable: true,
      render: (row) => row.coordinatorTickets.length,
    },
    {
      header: "Open",
      field: "openCount",
      sortable: true,
      render: (row) => row.coordinatorTickets.filter((t) => t.status === "OPEN").length,
    },
    {
      header: "In Progress",
      field: "inProgressCount",
      sortable: true,
      render: (row) => row.coordinatorTickets.filter((t) => t.status === "IN_PROGRESS").length,
    },
    {
      header: "Closed",
      field: "closedCount",
      sortable: true,
      render: (row) => row.coordinatorTickets.filter((t) => t.status === "CLOSED").length,
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
          onClick={() => setSelectedCoordinator(row)}
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
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Coordinators"
        description="List of registered coordinators and their tickets"
      />
      <Card className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-8">Loading coordinators...</div>
        ) : fetchError ? (
          <div className="text-center py-8 text-red-500">{fetchError}</div>
        ) : (
          <DataTable columns={columns} data={coordinators} />
        )}
      </Card>
      <AnimatePresence>
        {selectedCoordinator && (
          <Dialog
            open={!!selectedCoordinator}
            onClose={() => setSelectedCoordinator(null)}
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
                  Tickets for {selectedCoordinator.name}
                </Typography>
                <Button onClick={() => setSelectedCoordinator(null)} sx={{ minWidth: 0, p: 1, borderRadius: 2 }}>
                  <FaTimes className="h-5 w-5 text-gray-500" />
                </Button>
              </Box>
              <Divider sx={{ mb: 2 }} />
              {selectedCoordinator.coordinatorTickets.length > 0 ? (
                <Box className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Updated</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedCoordinator.coordinatorTickets.map((ticket) => (
                        <tr key={ticket.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{ticket.title}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{ticket.department}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Chip {...getStatusChipProps(ticket.status)} size="small" />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{new Date(ticket.updatedAt).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  This coordinator has no tickets created.
                </Typography>
              )}
              <Box mt={4} textAlign="right">
                <Button
                  onClick={() => setSelectedCoordinator(null)}
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

export default ViewCoordinatorsPage;
