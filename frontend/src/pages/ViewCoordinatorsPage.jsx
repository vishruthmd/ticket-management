import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios.libs.js";
import NavbarAdmin from "../components/NavbarAdmin.jsx";

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

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <NavbarAdmin />
          <div className="card-body">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-primary pt-18">
                Coordinators
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                List of registered coordinators and their tickets
              </p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading coordinators...</div>
            ) : fetchError ? (
              <div role="alert" className="alert alert-error mb-6">
                <span>{fetchError}</span>
              </div>
            ) : coordinators.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No coordinators found.
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <table className="table w-full table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Total Tickets</th>
                      <th>Open</th>
                      <th>In Progress</th>
                      <th>Closed</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coordinators.map((coord) => {
                      const openCount = coord.coordinatorTickets.filter(
                        (t) => t.status === "OPEN"
                      ).length;
                      const inProgressCount = coord.coordinatorTickets.filter(
                        (t) => t.status === "IN_PROGRESS"
                      ).length;
                      const closedCount = coord.coordinatorTickets.filter(
                        (t) => t.status === "CLOSED"
                      ).length;

                      return (
                        <tr key={coord.id}>
                          <td>{coord.name}</td>
                          <td>{coord.email}</td>
                          <td>{coord.coordinatorTickets.length}</td>
                          <td>{openCount}</td> {/* ✅ New open ticket count */}
                          <td>{inProgressCount}</td>
                          <td>{closedCount}</td>
                          <td>
                            <button
                              onClick={() => setSelectedCoordinator(coord)}
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

      {/* Coordinator Ticket Modal */}
      {selectedCoordinator && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 text-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Tickets for {selectedCoordinator.name}
              </h2>
              <button
                className="text-white hover:text-red-400 text-xl"
                onClick={() => setSelectedCoordinator(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {selectedCoordinator.coordinatorTickets.length > 0 ? (
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
                    {selectedCoordinator.coordinatorTickets.map((ticket) => (
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
                This coordinator has no tickets created.
              </p>
            )}

            <div className="mt-4 text-right">
              <button
                onClick={() => setSelectedCoordinator(null)}
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

export default ViewCoordinatorsPage;
