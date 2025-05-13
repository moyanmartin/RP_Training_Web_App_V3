import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { hostName } from "./HostNames";

function CertifyParticipant() {
  const { participant_ID } = useParams();
  const navigate = useNavigate();
  const [dateCertified, setDateCertified] = useState("");

  const submitHandler = async (event) => {
    event.preventDefault();

    const certifiedUpdatedBy = localStorage.getItem("email") ?? "unknown@user";

    try {
      await axios.put(
        `https://${hostName}/api/Participant/certify/${participant_ID}?updatedBy=${certifiedUpdatedBy}&dateCertified=${dateCertified}`
      );

      alert("Participant certified successfully!");
      navigate("/search");
    } catch (error) {
      console.error("Error certifying participant:", error);
      alert("There was an error certifying this participant.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Certify Participant {participant_ID}</h2>

      <form onSubmit={submitHandler}>
        <label>Date certified:</label>
        <input
          type="date"
          name="dateCertified"
          value={dateCertified}
          onChange={(e) => setDateCertified(e.target.value)}
          required
        />

        <button
          type="submit"
          style={{
            marginTop: "1rem",
            padding: "10px 20px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Certify participant
        </button>
      </form>
    </div>
  );
}

export default CertifyParticipant;
