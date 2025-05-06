import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { hostName } from './HostNames';
//const hostName = process.env.REACT_APP_HOST_NAME;

const DeleteParticipantRequested = () => {
  const { id, logNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // State for success message

  const handleDelete = async () => {
    setLoading(true);
    setError(""); // Reset error
    setSuccess(""); // Reset success message

    try {
      // Deleting participant
      await axios.delete(
        `https://${hostName}/api/Participant/DeleteParticipant/${id}`
      );

      // Prepare request update information
      const responder = localStorage.getItem("fullName");
      const responderEmail = localStorage.getItem("email");

      const updatedRequest = {
        Action_Taken: "Participant Deleted",
        Responder: responder,
        Responder_Email: responderEmail,
        Responder_Comment: "The participant has been deleted from the system.",
        Date_Responded: new Date().toISOString(),
        Request_Status: "Resolved",
      };

      // Updating the request status
      await axios.put(
        `https://${hostName}/api/Request/Update/${logNumber}`,
        updatedRequest
      );

      // Set success message
      setSuccess("Participant successfully deleted and request updated.");

      // Optional: Navigate after a delay
      setTimeout(() => {
        navigate("/pendingRequests");
      }, 2000); // Navigate after 2 seconds (or based on your preference)

    } catch (err) {
      setError("Failed to delete the participant or update the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Delete Participant</h2>
      <p>
        Are you sure you want to delete the participant with ID:{" "}
        <strong>{id}</strong> (Log Number: {logNumber})?
      </p>

      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#d32f2f",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {loading ? "Deleting..." : "Delete Participant"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>} {/* Success message */}


      <div style={{ position: "fixed", top: "20px", left: "20px" }}>
      <button
        onClick={() => navigate("/home")}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#1976d2",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Home
      </button>
    </div>
    
    </div>
  );
};

export default DeleteParticipantRequested;
