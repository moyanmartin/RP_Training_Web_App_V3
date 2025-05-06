import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { hostName } from './HostNames';

//const hostName = process.env.REACT_APP_HOST_NAME;

const ViewIndividualRequests = () => {
  const [viewIndividualRequests, setViewIndividualRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const requesterEmail = localStorage.getItem("email");

  // Memoize fetchPendingRequests to prevent redefinition on each render
  const fetchPendingRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://${hostName}/api/Request/IndividualRequests?requesterEmail=${requesterEmail}`
      );
      console.log("Fetched Requests:", response.data);
      setViewIndividualRequests(response.data);
    } catch (error) {
      console.error("Error fetching pending requests:", error);
      alert("Failed to load your requests.");
    } finally {
      setLoading(false);
    }
  }, [requesterEmail]);

  useEffect(() => {
    fetchPendingRequests(); // No warning now
  }, [fetchPendingRequests]);

  return (
    <div style={{ padding: "1rem" }}>
  <h2>Your Requests</h2>

  {loading ? (
    <p>Loading your requests...</p>
  ) : (
    <>
      {viewIndividualRequests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        // 🧠 Scrollable container
        <div style={{ overflowX: "auto" }}>
          <table
            border="1"
            cellPadding="8"
            style={{
              marginTop: "20px",
              borderCollapse: "collapse",
              width: "100%",    // ⚡ allow it to fit parent, not overflow
              minWidth: "1000px" // ⚡ allow scrolling on smaller screens
            }}
          >
            <thead>
              <tr>
                <th>Log Number</th>
                <th>Participant ID</th>
                <th>Type of Request</th>
                <th>Requester</th>
                <th>Email</th>
                <th>Requester Comment</th>
                <th>Date Requested</th>
                <th>Responder</th>
                <th>Responder Email</th>
                <th>Responder Comment</th>
                <th>Date Responded</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {viewIndividualRequests.map((request, index) => (
                <tr key={index}>
                  <td>{request.log_Number || "No Log Number"}</td>
                  <td>{request.participant_ID || "No Participant ID"}</td>
                  <td>{request.type_Of_Request || "No Type of Request"}</td>
                  <td>{request.requester || "No Requester"}</td>
                  <td style={{ wordWrap: "break-word", maxWidth: "150px" }}>
                    {request.requester_Email || "No Email"}
                  </td>
                  <td style={{ wordWrap: "break-word", maxWidth: "200px" }}>
                    {request.requester_Comment || "No Comment"}
                  </td>
                  <td>
                    {request.date_Requested
                      ? new Date(request.date_Requested).toLocaleString()
                      : "No Date"}
                  </td>
                  <td>{request.responder || "No Responder"}</td>
                  <td style={{ wordWrap: "break-word", maxWidth: "150px" }}>
                    {request.responder_Email || "No Email"}
                  </td>
                  <td style={{ wordWrap: "break-word", maxWidth: "200px" }}>
                    {request.responder_Comment || "No Comment"}
                  </td>
                  <td>
                    {request.date_Responded
                      ? new Date(request.date_Responded).toLocaleString()
                      : "No Date"}
                  </td>
                  <td>{request.request_Status || "No Status"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )}
</div>


  );
};

export default ViewIndividualRequests;
