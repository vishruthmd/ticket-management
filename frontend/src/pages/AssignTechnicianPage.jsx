import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios.libs.js";
import NavbarAdmin from "../components/NavbarAdmin.jsx";

const AssignTechnicianPage = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState(null);

  // Fetch open tickets
  useEffect(() => {
    const fetchOpenTickets = async () => {
      try {
        const response = await axiosInstance.get("/tickets/open-tickets");
        setTickets(response.data.tickets || []);
      } catch (error) {
        console.error("Error fetching open tickets:", error);
        setFetchError("Failed to fetch open tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpenTickets();
  }, []);

  // Fetch technicians when modal opens
  useEffect(() => {
    if (selectedTicket) {
      axiosInstance
        .get("/users/all-technicians")
        .then((res) => {
          setTechnicians(res.data.technicians);
        })
        .catch((err) => {
          console.error("Error fetching technicians:", err);
        });
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

      // Refresh ticket list (remove assigned ticket from open list)
      setTickets((prev) => prev.filter((t) => t.id !== selectedTicket.id));
      setSelectedTicket(null);
      setSelectedTechnicianId(null);
    } catch (error) {
      console.error("Failed to assign technician:", error);
      setAssignError("Assignment failed. Try again.");
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <NavbarAdmin />
      <div className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center mb-6">
              <h1 className="text-4xl font-bold text-primary pt-13">Assign Technician</h1>
              <p className="text-sm text-gray-500 mt-2">List of open tickets to assign technicians</p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading tickets...</div>
            ) : fetchError ? (
              <div role="alert" className="alert alert-error mb-6">
                <span>{fetchError}</span>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No open tickets found.</div>
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
                          <span className="badge badge-warning">{ticket.status}</span>
                        </td>
                        <td>{ticket.coordinator?.name || "N/A"}</td>
                        <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="btn btn-sm btn-outline btn-success"
                          >
                            Assign
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

      {/* Modal for assigning technician */}
      {/* Modal for assigning technician */}
{selectedTicket && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 animate-fadeIn">
    <div 
      className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative transform transition-all duration-300 scale-100 animate-slideIn"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3 mb-4">
        <h2 className="text-xl font-bold text-gray-800">Assign Technician</h2>
        <button
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-colors duration-200 focus:outline-none"
          onClick={() => {
            setSelectedTicket(null);
            setSelectedTechnicianId(null);
            setAssignError(null);
          }}
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="mb-6">
        <div className="mb-4">
          <p className="text-gray-600 mb-1">Ticket:</p>
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
            <h3 className="font-semibold text-gray-800">{selectedTicket.title}</h3>
            {selectedTicket.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{selectedTicket.description}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="technician-select" className="block text-gray-600 mb-1">Select Technician:</label>
          <div className="relative">
            <select
              id="technician-select"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 appearance-none bg-white text-gray-800 font-medium"
              value={selectedTechnicianId || ""}
              onChange={(e) => setSelectedTechnicianId(e.target.value)}
              style={{ color: '#2d3748' }}
            >
              <option disabled value="" className="text-gray-500">Choose a technician</option>
              {technicians.map((tech) => (
                <option key={tech.id} value={tech.id} className="py-2 text-gray-800 font-medium">
                  {tech.name} ({tech.email})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {assignError && (
          <div className="mt-3 text-red-500 bg-red-50 border border-red-100 rounded-md p-2 text-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {assignError}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <button
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          onClick={() => {
            setSelectedTicket(null);
            setSelectedTechnicianId(null);
            setAssignError(null);
          }}
        >
          Cancel
        </button>
        <button
          className={`px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center ${assigning ? "opacity-75" : ""}`}
          onClick={handleAssign}
          disabled={assigning}
        >
          {assigning ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Assigning...
            </>
          ) : (
            <>Assign Technician</>
          )}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default AssignTechnicianPage;
