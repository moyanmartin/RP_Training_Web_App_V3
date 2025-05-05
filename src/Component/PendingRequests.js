import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { hostName } from './HostNames';
//const hostName = process.env.REACT_APP_HOST_NAME;




const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  // Fetch the pending requests from the backend
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://${hostName}/api/Request/PendingRequests`);
      console.log("Fetched Requests:", response.data); // Log the full response to debug
      setPendingRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      alert("Failed to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a request to show delete/respond buttons
  const handleSelectRequest = (request) => {
    setSelectedRequest(request);
  };

  useEffect(() => {
    fetchPendingRequests(); // Fetch pending requests when component mounts
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Pending Requests</h2>

      {loading ? (
        <p>Loading pending requests...</p>
      ) : (
        <>
          {pendingRequests.length === 0 ? (
            <p>No pending requests found.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ marginTop: "20px", width: "100%" }}>
              <thead>
                <tr>
                  <th>Log Number</th>
                  <th>Participant ID</th>
                  <th>Type of Request</th>
                  <th>Requester</th>
                  <th>Email</th>
                  <th>Comment</th>
                  <th>Date Requested</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request, index) => (
                  <tr
                    key={index}
                    onClick={() => handleSelectRequest(request)} // Click to select a request
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        selectedRequest?.log_Number === request.log_Number
                          ? "#e0f7fa" // Highlight selected request
                          : "#f5f5f5",
                    }}
                  >
                    <td>{request.log_Number || "No Log Number"}</td>
                    <td>{request.participant_ID || "No Participant ID"}</td>
                    <td>{request.type_Of_Request || "No Type of Request"}</td>
                    <td>{request.requester || "No Requester"}</td>
                    <td>{request.requester_Email || "No Email"}</td>
                    <td>{request.requester_Comment || "No Comment"}</td>
                    <td>{request.date_Requested ? new Date(request.date_Requested).toLocaleString() : "No Date"}</td>
                    <td>{request.request_Status || "No Status"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

{selectedRequest && (
  <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
    <button
      onClick={() => navigate(`/delete-request/${selectedRequest.participant_ID}/${selectedRequest.log_Number}`)}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#d32f2f",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Delete Participant
    </button>

    <button
      onClick={() => navigate(`/deny-request/${selectedRequest.log_Number}`)}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#1976d2",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Respond to Request
    </button>
  </div>
)}

        </>
      )}
    </div>
  );
};

export default PendingRequests;
