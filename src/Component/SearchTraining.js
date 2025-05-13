import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { hostName } from './HostNames';

//const hostName = process.env.REACT_APP_HOST_NAME;

const SearchTraining = () => {
  const navigate = useNavigate();
  const [ParticipantID, setParticipantID] = React.useState("");
  const [TrainingNum, setTrainingNum] = React.useState("");
  const [participantFirstName, setParticipantFirstName] = React.useState("");
  const [participantLastName, setParticipantLastName] = React.useState("");
  const [participantTelephone, setParticipantTelephone] = React.useState("");
  const [searchResults, setSearchResults] = React.useState([]);
  const [selectedParticipant, setSelectedParticipant] = React.useState(null);


  const clearForm = () => {
    setParticipantID("");
    setTrainingNum("");
    setParticipantFirstName("");
    setParticipantLastName("");
    setParticipantTelephone("");
    setSearchResults([]);
    setSelectedParticipant(null);
  };
  

  const submitHandler = async (event) => {
    event.preventDefault();

    const params = new URLSearchParams({
      iDNumber: ParticipantID,
      trainingNumber: TrainingNum,
      firstName: participantFirstName,
      lastName: participantLastName,
      telephone: participantTelephone,
    }).toString();

    try {
      const response = await axios.get(
        `https://${hostName}/api/Participant/search?${params}`
      );

      if (response.data.length === 0) {
        alert("No participants found.");
      }

      setSearchResults(response.data);
      setSelectedParticipant(null);
    } catch (error) {
      console.error("Error fetching participants:", error);
      alert("Error retrieving participants.");
    }
  };

  const handleParticipantSelect = (participant) => {
    setSelectedParticipant(participant);
  };

  return (

    <div>

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


      <h2>Search Participants</h2>
      <form onSubmit={submitHandler}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>Participant's ID Number:</label>
            <input
              type="text"
              name="ParticipantID"
              value={ParticipantID}
              onChange={(e) => setParticipantID(e.target.value)}
            />
          </div>
          <div style={{ width: '48%' }}>
            <label>Training Number:</label>
            <input
              type="text"
              name="TrainingNum"
              value={TrainingNum}
              onChange={(e) => setTrainingNum(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>First Name:</label>
            <input
              type="text"
              name="participantFirstName"
              value={participantFirstName}
              onChange={(e) => setParticipantFirstName(e.target.value)}
            />
          </div>
          <div style={{ width: '48%' }}>
            <label>Last Name:</label>
            <input
              type="text"
              name="participantLastName"
              value={participantLastName}
              onChange={(e) => setParticipantLastName(e.target.value)}
            />
          </div>
        </div>

        <label>Telephone:</label>
        <input
          type="text"
          name="participantTelephone"
          value={participantTelephone}
          onChange={(e) => setParticipantTelephone(e.target.value)}
        />

        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <button
            type="submit"
            style={{
              backgroundColor: "#007BFF",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Search
          </button>

          <button
            type="button"
            onClick={clearForm}
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px"
            }}
          >
            Clear Form
          </button>
        </div>

      </form>

      {searchResults.length > 0 && (
        <div>
          <h3>Results:</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Date of Birth</th>
                <th style={{ border: "1px solid black", padding: "8px" }}>Telephone</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((participant, index) => {
                const isSelected = selectedParticipant &&
                                   selectedParticipant.participants_ID === participant.participants_ID;

                return (
                  <tr
                    key={index}
                    onClick={() => handleParticipantSelect(participant)}
                    style={{
                      backgroundColor: isSelected ? "#e0e0e0" : "transparent",
                      cursor: "pointer"
                    }}
                  >
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {participant.participant_First_Name} {participant.participant_Last_Name}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {participant.date_Of_Birth
                        ? new Date(participant.date_Of_Birth).toLocaleDateString()
                        : "Not Available"}
                    </td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>
                      {participant.participant_Telephone || "Not Available"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
     
          {selectedParticipant && (
  <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
    <button
      onClick={() => {
        console.log(selectedParticipant.training_Number);
        navigate(`/certifyCohort/${selectedParticipant.training_Number}`);
      }}
      style={{
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px"
      }}
    >
      Certify Cohort
    </button>
  </div>
)}


        </div>
      )}
    </div>
  );
};

export default SearchTraining;
