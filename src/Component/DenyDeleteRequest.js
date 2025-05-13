import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { hostName } from './HostNames';
//const hostName = process.env.REACT_APP_HOST_NAME;

const DenyDeleteRequest = () => {
  const { logNumber } = useParams(); // logNumber passed in the URL
  const navigate = useNavigate();

  const [responderComment, setResponderComment] = useState("");
  const [dateResponded] = useState(new Date().toISOString().slice(0, 16));

  const submitHandler = async (event) => {
    event.preventDefault();

    const responder = localStorage.getItem("fullName");
    const responderEmail = localStorage.getItem("email");

    const formData = {
      Action_Taken: "Request Denied",
      Responder: responder,
      Responder_Email: responderEmail,
      Responder_Comment: responderComment,
      Date_Responded: dateResponded,
    };

    try {
      await axios.put(
        

        `https://${hostName}/api/Request/denyRequest/${logNumber}`,
        formData
      );
      console.log("Request submitted successfully");
      alert("Your request was submitted successfully!");
      navigate("/pending-requests"); // redirect after successful submit
      navigate('/home');
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("There was an error submitting your request.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Respond to Request #{logNumber}</h2>
      <form onSubmit={submitHandler}>

        <label>Comment:</label>
              <textarea
              name="responderComment"
              value={responderComment}
              onChange={(e) => setResponderComment(e.target.value)}
              required
              rows={4}
              style={{ width: "100%", marginTop: "0.5rem" }}
            />
        <br />
        <button type="submit" className="submit-button" style={{ marginTop: "1rem" }}>
          Submit Response
        </button>
      </form>
    </div>
  );
};

export default DenyDeleteRequest;
