import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios.libs.js";
import NavbarAdmin from "../components/NavbarAdmin.jsx";

const ViewTechniciansPage = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTechnician, setSelectedTechnician] = useState(null);

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const response = await axiosInstance.get("/users/all-technicians");
        setTechnicians(response.data.technicians || []);
      } catch (error) {
        console.error("Error fetching technicians:", error);
        setFetchError("Failed to fetch technicians. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTechnicians();
  }, []);

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <NavbarAdmin />
          <div className="card-body">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-primary pt-18">
                Technicians
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                List of registered technicians and their tickets
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading technicians...</div>
            ) : fetchError ? (
              <div role="alert" className="alert alert-error mb-6">
                <span>{fetchError}</span>
              </div>
            ) : technicians.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No technicians found.
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="table w-full table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Total Tickets</th>
                      <th>In Progress</th>
                      <th>Closed</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {technicians.map((tech) => {
                      const inProgressCount = tech.technicianTickets.filter(
                        (t) => t.status === "IN_PROGRESS"
                      ).length;
                      const closedCount = tech.technicianTickets.filter(
                        (t) => t.status === "CLOSED"
                      ).length;

                      return (
                        <tr key={tech.id}>
                          <td>{tech.name}</td>
                          <td>{tech.email}</td>
                          <td>{tech.technicianTickets.length}</td>
                          <td>{inProgressCount}</td>
                          <td>{closedCount}</td>
                          <td>
                            <button
                              onClick={() => setSelectedTechnician(tech)}
                              className="btn btn-sm btn-outline btn-primary"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Technician Ticket Modal */}
      {selectedTechnician && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Tickets for {selectedTechnician.name}
              </h2>
              <button
                className="text-white hover:text-red-400 text-xl"
                onClick={() => setSelectedTechnician(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {selectedTechnician.technicianTickets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-white">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Department</th>
                      <th>Status</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTechnician.technicianTickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.title}</td>
                        <td>{ticket.department}</td>
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
                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400">
                This technician has no tickets assigned.
              </p>
            )}

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedTechnician(null)}
                className="btn btn-sm btn-outline btn-accent"
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

export default ViewTechniciansPage;
