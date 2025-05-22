import React, { useEffect, useState } from "react";
import { axiosInstance } from "../libs/axios.libs";
import NavbarAdmin from "../components/NavbarAdmin";

const ViewDeptWiseTickets = () => {
  const [ticketsByDept, setTicketsByDept] = useState({});
  const [selectedDept, setSelectedDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get(
          "/tickets/get-all-tickets-department-wise"
        );
        setTicketsByDept(response.data.ticketsByDepartment);
        const departments = Object.keys(response.data.ticketsByDepartment);
        if (departments.length > 0) setSelectedDept(departments[0]);
      } catch (error) {
        console.error("Error fetching department-wise tickets:", error);
        setFetchError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleChange = (e) => {
    setSelectedDept(e.target.value);
  };

  return (
    <div className="min-h-screen bg-base-200">
      <NavbarAdmin />
      <div className="max-w-screen-2xl mx-auto px-4 py-24">
        <div className="bg-base-100 rounded-xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold text-primary whitespace-nowrap">
              Department-wise Tickets
            </h1>
            <div className="flex flex-wrap items-center gap-2">
                <label
                    htmlFor="departmentSelect"
                    className="font-semibold text-gray-700 whitespace-nowrap"
                >
                    Select Department:
                </label>
                <select
                    id="departmentSelect"
                    className="select select-bordered max-w-xs"
                    value={selectedDept}
                    onChange={handleChange}
                >
                    {Object.keys(ticketsByDept).map((dept) => (
                    <option key={dept} value={dept}>
                        {dept}
                    </option>
                    ))}
                </select>
                </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading tickets...</div>
          ) : fetchError ? (
            <div role="alert" className="alert alert-error mb-6">
              <span>{fetchError}</span>
            </div>
          ) : !selectedDept || ticketsByDept[selectedDept]?.length === 0 ? (
            <div className="text-center text-gray-500">No tickets found for this department.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full table-zebra">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Device ID</th>
                    <th>Coordinator</th>
                    <th>Technician</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketsByDept[selectedDept].map((ticket) => (
                    <tr key={ticket.id}>
                      <td>{ticket.title}</td>
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
                      <td>{ticket.location}</td>
                      <td>{ticket.deviceId}</td>
                      <td>{ticket.coordinator?.name || "—"}</td>
                      <td>{ticket.technician?.name || "—"}</td>
                      <td>{new Date(ticket.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDeptWiseTickets;
