// All imports remain same
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios.libs.js";
import NavbarCoordinator from "../components/NavbarCoordinator.jsx";
import { CheckCircle } from "lucide-react";

const ViewTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToClose, setTicketToClose] = useState(null); // NEW
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
      alert("Failed to mark ticket as closed.");
    } finally {
      setUpdatingTicketId(null);
      setTicketToClose(null); // close modal
    }
  };

  return (
    <div className="min-h-screen w-full bg-base-200 text-base-content">
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <NavbarCoordinator />
          <div className="card-body">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-primary pt-12">My Tickets</h1>
              <p className="text-sm text-gray-400 mt-2">
                Here are the tickets you have raised
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading tickets...</div>
            ) : fetchError ? (
              <div role="alert" className="alert alert-error mb-6">
                <span>{fetchError}</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No tickets found.</div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="table w-full table-zebra text-sm">
                  <thead>
                    <tr>
                      <th>Title</th>
                      
                      <th>Department</th>
                      <th>Location</th>
                      <th>Device ID</th>
                      <th>Status</th>
                      <th>Technician</th>
                      <th>Resolved At</th>
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
                        <td>{ticket.technician?.name || "Not Assigned"}</td>
                        <td>
                          {ticket.resolvedAt
                            ? new Date(ticket.resolvedAt).toLocaleString()
                            : "—"}
                        </td>
                        <td className="flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            View
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

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 text-gray-200 w-full max-w-md max-h-[85vh] overflow-y-auto rounded-lg shadow-lg p-6 relative hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Ticket Details
            </h2>
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl transition-colors"
              onClick={() => setSelectedTicket(null)}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-400">Description</h3>
              <p className="mt-1 p-2 bg-gray-800 rounded text-gray-100 max-h-40 overflow-y-auto text-sm whitespace-pre-line">
                {selectedTicket.description || "No description provided."}
              </p>
            </div>

            <div className="space-y-3 text-sm">
              {[
                "title",
                "department",
                "location",
                "deviceId",
                "status",
                "technician",
                "resolvedAt",
              ].map((key) => {
                let value = selectedTicket[key];

                if (key === "technician") {
                  value = selectedTicket.technician?.name || "Not Assigned";
                } else if (key === "resolvedAt" && value) {
                  value = new Date(value).toLocaleString();
                } else if (value === null || value === undefined) {
                  value = "—";
                }

                return (
                  <div
                    key={key}
                    className="flex justify-between gap-4 border-b border-gray-700 py-1"
                  >
                    <span className="font-medium text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="text-right text-gray-100 break-all max-w-[60%]">
                      {value}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-right">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-base-100 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-success">
              Confirm Close
            </h3>
            <p className="mb-6 text-sm text-gray-500">
              Are you sure you want to mark this ticket as <b>CLOSED</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setTicketToClose(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm btn-success"
                onClick={confirmMarkAsClosed}
                disabled={updatingTicketId === ticketToClose.id}
              >
                {updatingTicketId === ticketToClose.id
                  ? "Closing..."
                  : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewTicketPage;
