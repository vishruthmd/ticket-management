import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios.libs.js";
import NavbarAdmin from "../components/NavbarAdmin.jsx";

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

  return (
    <div className="min-h-screen w-full">
      <NavbarAdmin />
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-primary pt-18">All Tickets</h1>
              <p className="text-sm text-gray-500 mt-2">Admin view of all tickets</p>
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
                <table className="table w-full table-zebra">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Department</th>
                      <th>Location</th>
                      <th>Device ID</th>
                      <th>Status</th>
                      <th>Coordinator</th>
                      <th>Technician</th>
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
                        <td>{ticket.coordinator?.name || "N/A"}</td>
                        <td>{ticket.technician?.name || "Not Assigned"}</td>
                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="btn btn-sm btn-outline btn-primary"
                          >
                            View
                          </button>
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

      {/* Modal for viewing ticket details */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md max-h-[80vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            <h2 className="text-xl font-semibold text-primary mb-4">Ticket Details</h2>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
              onClick={() => setSelectedTicket(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            <div className="space-y-2 text-sm">
              {Object.entries(selectedTicket).map(([key, value]) => {
                const displayValue =
                  typeof value === "object"
                    ? (key === "technician" || key === "coordinator") && value?.name
                      ? value.name
                      : Array.isArray(value)
                      ? value.join(", ")
                      : JSON.stringify(value, null, 2)
                    : String(value);

                return (
                  <div key={key} className="flex justify-between gap-4 border-b py-1">
                    <span className="font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-right text-gray-800 break-all">{displayValue}</span>
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
    </div>
  );
};

export default ViewTicketsAdmin;
