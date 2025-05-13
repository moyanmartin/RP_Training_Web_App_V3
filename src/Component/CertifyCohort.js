import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { hostName } from "./HostNames";

function CertifyCohort() {
  const { training_Number } = useParams();

  console.log("Training number from params:", training_Number);

  const navigate = useNavigate();

  const [training, setTraining] = useState(null);
  const [dateCertified, setDateCertified] = useState("");

  const certifiedUpdatedBy = localStorage.getItem("email") ?? "unknown@user";

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        const response = await axios.get(
          `https://${hostName}/api/Training/${training_Number}`
        );
        setTraining(response.data);
      } catch (error) {
        console.error("Error fetching training:", error);
        alert("Failed to load training data.");
      }

      
    };

    if (training_Number) {
      fetchTraining();
    }
  }, [training_Number]);

  const certifyAllHandler = async () => {
    try {
      await axios.put(
        `https://${hostName}/api/Training/certify/${training_Number}?updatedBy=${certifiedUpdatedBy}&dateCertified=${dateCertified}`
      );

      alert("All participants certified successfully!");
      navigate("/search");
    } catch (error) {
      console.error("Error certifying cohort:", error);
      alert("There was an error certifying the cohort.");
    }
  };

 

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Certify Cohort - Training Number: {training_Number}</h2>

      <label>Date certified:</label>
      <input
        type="date"
        name="dateCertified"
        value={dateCertified}
        onChange={(e) => setDateCertified(e.target.value)}
        required
      />

      <button
        onClick={certifyAllHandler}
        style={{
          marginTop: "1rem",
          padding: "10px 20px",
          backgroundColor: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Certify All Participants
      </button>

      {training && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Training Summary</h3>
          

          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th style={thStyle}>RJ Centre</th>
                <th style={thStyle}>Training Number</th>
                <th style={thStyle}>Training Day 1</th>
                <th style={thStyle}>Training Day 2</th>
                <th style={thStyle}>Name of Institution</th>
                <th style={thStyle}>Number of persons trained</th>
                <th style={thStyle}>Number of persons certified</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              <td style={tdStyle}>{training.rJ_Centre}</td>
                <td style={tdStyle}>{training.training_Number}</td>
                <td style={tdStyle}>
                {training.training_Day_1 ? new Date(training.training_Day_1).toLocaleDateString() : ""}
                </td>
                <td style={tdStyle}>
                {training.training_Day_2 ? new Date(training.training_Day_2).toLocaleDateString() : ""}
                </td>
                <td style={tdStyle}>{training.name_of_Institution}</td>
                <td style={tdStyle}>{training.totalParticipants}</td>
                <td style={tdStyle}>{training.certifiedCount}</td>

              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = { border: "1px solid black", padding: "8px" };
const tdStyle = { border: "1px solid black", padding: "8px" };

export default CertifyCohort;
