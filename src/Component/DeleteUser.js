import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { hostName } from './HostNames';
//const hostName = process.env.REACT_APP_HOST_NAME;

const DeleteUser = () => {
  const navigate = useNavigate();
  const [removedEmail, setRemovedEmail] = useState("");
  const [removedName, setRemovedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Added state for success message

  const now = new Date();
  const formatted = now.toISOString().slice(0, 19).replace('T', ' '); // example output: '2025-04-12 23:34:02'


  const logDeleteUrl = `http://${hostName}/api/StaffRemoved/AddRemoved/`;
  const deleteUserUrl = `http://${hostName}/api/Staff/${removedEmail}`;
  

  // Fetch Name when Email is entered
  useEffect(() => {
    const fetchUserName = async () => {
      if (!removedEmail) {
        setRemovedName("");
        return;
      }

      try {
        const response = await axios.get(`http://${hostName}/api/Staff/${removedEmail}`);
        const { first_Name, last_Name } = response.data;

        if (first_Name && last_Name) {
          setRemovedName(`${first_Name} ${last_Name}`);
        } else {
          setRemovedName("");
        }
      } catch (err) {
        console.error("Error fetching user name:", err);
        setRemovedName("");
      }
    };

    fetchUserName();
  }, [removedEmail]);

  const handleDelete = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage(""); // Reset success message on every delete attempt

    try {
      // Step 1: Delete the participant
      await axios.delete(deleteUserUrl);

      // Step 2: Log who deleted this user
      const remover = localStorage.getItem("fullName");
      const removerEmail = localStorage.getItem("email");

      const logData = {
        Remover: remover,
        Remover_Email: removerEmail,
        Removed: removedName,
        Removed_Email: removedEmail,
        Date_Removed: formatted,
      };

      await axios.post(logDeleteUrl, logData);

      // Set success message after the user is deleted and the log is created
      setSuccessMessage(`User with email ${removedEmail} has been successfully deleted.`);

      // Navigate to another page after successful deletion
      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Failed to delete the user or log the action.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Delete Participant</h2>

      <label>Email:</label>
      <input
        type="text"
        name="Email"
        value={removedEmail}
        onChange={(e) => setRemovedEmail(e.target.value)}
      />

      <label>Name:</label>
      <input
        type="text"
        name="Name"
        value={removedName}
        readOnly
      />

      <p>
        Are you sure you want to delete this user with email:{" "}
        <strong>{removedEmail}</strong> (Name: {removedName})?
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
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Deleting..." : "Delete User"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>} {/* Display success message */}
    </div>
  );
};

export default DeleteUser;
