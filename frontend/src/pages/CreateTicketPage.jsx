import React, { useState } from 'react';
import { axiosInstance } from "../libs/axios.libs.js";
import NavbarCoordinator from '../components/NavbarCoordinator.jsx';

// Assuming you have a function or hook to get the auth token, e.g., from your auth store
// import { useAuth } from '../hooks/useAuth'; // Example hook

const CreateTicketPage = () => {
  // const { token } = useAuth(); // Example: Get token from auth context or store

  const [ticket, setTicket] = useState({
    title: '',
    description: '',
    department: '',
    lab: '', // Maps to 'location' on backend
    deviceType: '', // Not used by current backend code
    deviceId: '',
    priority: 'MEDIUM', // Not sent to backend based on controller
    status: 'OPEN', // Set by backend
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null); // To show success or error messages
  const [isError, setIsError] = useState(false); // To style message based on success/error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket({ ...ticket, [name]: value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setSubmitMessage(null);
  setIsError(false);

  const ticketDataToSend = {
    title: ticket.title,
    department: ticket.department,
    deviceId: ticket.deviceId,
    location: ticket.lab,
    description: ticket.description,
  };

  console.log('Submitting ticket data:', ticketDataToSend);

  try {
    const response = await axiosInstance.post("/tickets/create", ticketDataToSend, {
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`,
      },
    });

    const data = response.data;
    console.log('Ticket created successfully:', data);

    setSubmitMessage(data.message || 'Ticket created successfully!');
    setIsError(false);

    // Reset form
    setTicket({
      title: '',
      description: '',
      department: '',
      lab: '',
      deviceType: '',
      deviceId: '',
      priority: 'MEDIUM',
      status: 'OPEN',
    });

  } catch (error) {
    console.error('Error creating ticket:', error);
    setSubmitMessage(
      error.response?.data?.message || 'An error occurred. Please try again.'
    );
    setIsError(true);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    
    <div className="container mx-auto p-4 md:p-8">
      <NavbarCoordinator />
      {/* Card Container for better visual grouping */}
      <div className="card bg-base-100 shadow-xl p-6 md:p-8">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary pt-4" >Create Support Ticket</h1>
            <p className="text-sm text-gray-500 mt-2">Please fill all the required fields to submit your ticket</p>
          </div>

          {/* Submit Message Alert */}
          {submitMessage && (
             <div role="alert" className={`alert mb-6 ${isError ? 'alert-error' : 'alert-success'}`}>
               {/* You might need icons here based on your DaisyUI setup */}
               {/* <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> */}
               <span>{submitMessage}</span>
             </div>
          )}


          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1 */}
            <div className="space-y-4">
              {/* Title Input */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="input input-bordered w-full"
                  value={ticket.title}
                  onChange={handleChange}
                  required
                  placeholder="Brief title of the issue"
                />
              </div>

              {/* Department Select */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Department</span>
                </label>
                <select
                  name="department"
                  className="select select-bordered w-full"
                  value={ticket.department}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Department</option>
                  {["ISE", "CSE", "AIML", "BT", "CV", "ME", "ETE", "EIE", "ECE", "ASE", "IDRC", "LIB", "CMT"].map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>

              {/* Lab Input (Maps to Location on backend) */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Lab / Location</span>
                </label>
                <input
                  type="text"
                  name="lab" // Use 'lab' in state, but send as 'location'
                  className="input input-bordered w-full"
                  value={ticket.lab}
                  onChange={handleChange}
                  required
                  placeholder="Lab number or name (e.g., F101, Library)"
                />
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              {/* Device Type Input (Not sent to backend controller provided) */}
               <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Device Type</span>
                </label>
                 {/* Note: This field is *not* sent to your current backend controller */}
                <input
                  type="text"
                  name="deviceType"
                  className="input input-bordered w-full"
                  value={ticket.deviceType}
                  onChange={handleChange}
                  placeholder="Computer, Printer, etc."
                  // Made optional as it's not required by the backend controller
                />
              </div>

              {/* Device ID Input */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Device ID</span>
                </label>
                <input
                  type="text"
                  name="deviceId"
                  className="input input-bordered w-full"
                  value={ticket.deviceId}
                  onChange={handleChange}
                  required
                  placeholder="Serial number or ID"
                />
              </div>
            </div>

            {/* Description Full Width */}
            <div className="col-span-1 md:col-span-2">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  className="textarea textarea-bordered w-full h-32"
                  value={ticket.description}
                  onChange={handleChange}
                  required
                  placeholder="Please provide detailed information about the issue"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-6">
              {/* You might want a proper navigation handler for Cancel */}
              <button type="button" className="btn btn-ghost" onClick={() => console.log('Cancel clicked')}>Cancel</button>

              <button
                type="submit"
                className={`btn btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} // Simple visual disable
                disabled={isSubmitting} // Disable button while submitting
              >
                {isSubmitting ? (
                   <>
                     {/* Assuming you have lucide-react or similar for icons */}
                     {/* <Loader2 className="animate-spin mr-2 h-5 w-5" /> */}
                     Submitting...
                   </>
                ) : (
                  "Submit Ticket"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTicketPage;