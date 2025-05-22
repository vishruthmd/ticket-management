import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios.libs.js";
import NavbarTechnician from "../components/NavbarTechnician.jsx";
import { CheckCircle, Eye } from "lucide-react";

const ViewTicketsTechnician = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToClose, setTicketToClose] = useState(null);
  const [updatingTicketId, setUpdatingTicketId] = useState(null);

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

  const markAsClosed = async (id) => {
    try {
      setUpdatingTicketId(id);
      const response = await axiosInstance.put(`/tickets/set-to-closed/${id}`);
      const updatedTicket = response.data.ticket;

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
      );
      setTicketToClose(null);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      alert("Failed to mark ticket as closed.");
    } finally {
      setUpdatingTicketId(null);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <NavbarTechnician />
          <div className="card-body">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-primary pt-13">
                Assigned Tickets
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Tickets currently assigned to you
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading tickets...</div>
            ) : fetchError ? (
              <div role="alert" className="alert alert-error mb-6">
                <span>{fetchError}</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No tickets assigned.
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="table w-full table-zebra">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Department</th>
                      <th>Location</th>
                      <th>Device ID</th>
                      <th>Status</th>
                      <th>Coordinator</th>
                      <th>Last Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.title}</td>
                        <td>{ticket.department}</td>
                        <td>{ticket.location}</td>
                        <td>{ticket.deviceId}</td>
                        <td>
                          <span
                            className={`badge ${
                              ticket.status === "OPEN"
                                ? "badge-warning"
                                : ticket.status === "IN_PROGRESS"
                                ? "badge-info"
                                : "badge-success"
                            }`}
                          >
                            {ticket.status.replace("_", " ")}
                          </span>
                        </td>
                        <td>{ticket.coordinator?.name || "Unknown"}</td>
                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                        <td className="flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            <Eye className="w-4 h-4 mr-1" /> View
                          </button>
                          {ticket.status === "IN_PROGRESS" && (
                            <button
                              onClick={() => setTicketToClose(ticket)}
                              className="btn btn-sm btn-outline btn-success"
                              disabled={updatingTicketId === ticket.id}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              {updatingTicketId === ticket.id
                                ? "Closing..."
                                : "Mark Closed"}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-base-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative text-white">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Ticket Details
            </h2>
            <button
              className="absolute top-3 right-3 text-gray-300 hover:text-red-500 text-xl"
              onClick={() => setSelectedTicket(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="bg-base-200 p-4 rounded-lg text-sm whitespace-pre-line">
                {selectedTicket.description || "No description provided."}
              </p>
            </div>

            {/* Info Table */}
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="text-sm text-gray-400">
                    <th>Field</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: "Title", value: selectedTicket.title },
                    { label: "Department", value: selectedTicket.department },
                    { label: "Location", value: selectedTicket.location },
                  ].map((item, index) => (
                    <tr key={index} className="hover:bg-base-300">
                      <td className="font-medium text-gray-300">
                        {item.label}
                      </td>
                      <td>{item.value || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setSelectedTicket(null)}
                className="btn btn-sm btn-primary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Close Modal */}
      {ticketToClose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Confirm Close
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to mark this ticket as{" "}
              <strong>CLOSED</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTicketToClose(null)}
                className="btn btn-sm border border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => markAsClosed(ticketToClose.id)}
                className="btn btn-sm btn-success"
              >
                Yes, Mark Closed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTicketsTechnician;
