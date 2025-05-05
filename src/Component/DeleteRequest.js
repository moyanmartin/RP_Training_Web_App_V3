import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom"; // ✅ useParams instead of useSearchParams
import "./AddUser.css";
import { TypeOfRequestDropdown } from "./Dropdowns";
import { fetchParticipantById } from "./fetchParticipantByID";
import { useNavigate } from "react-router-dom";
import { hostName } from './HostNames';
//const hostName = process.env.REACT_APP_HOST_NAME;


const DeleteRequest = () => {

  const navigate = useNavigate();
  const { id: participantId } = useParams(); // ✅ Correct way to get the ID from the route

  console.log("🧠 DeleteRequest mounted!");
  console.log("Participant ID from URL:", participantId);

  const [typeOfRequest, setTypeOfRequest] = useState("");
  const [requester, setRequester] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterComment, setRequesterComment] = useState("");
  const [dateRequested, setDateRequested] = useState(
    new Date().toISOString().slice(0, 16)
  );


  useEffect(() => {
    // Fetch user from localStorage
    const user = {
      typeOfUser: localStorage.getItem("typeOfUser"),
      fullName: localStorage.getItem("fullName"),
      email: localStorage.getItem("email")
    };
    //setUserData(user);
    setRequester(user.fullName || "");
    setRequesterEmail(user.email || "");

    // Optional: fetch participant info if needed
    if (participantId) {
      fetchParticipantById(participantId)
        .then((data) => {
          console.log("Participant fetched:", data);
        })
        .catch((err) => {
          console.error("Error fetching participant:", err);
        });
    }
  }, [participantId]);

  const submitHandler = async (event) => {
    event.preventDefault();
  
    try {
    
      const formData = {
        Type_Of_Request: typeOfRequest,
        Participant_ID: participantId,
        Requester: requester,
        Requester_Email: requesterEmail,
        Requester_Comment: requesterComment,
        Date_Requested: dateRequested,
      };
      
      await axios.post(`http://${hostName}/api/Request/AddRequest`, formData);
      console.log("Request submitted successfully");
      alert("Your request was submitted successfully!");
      navigate('/search');

    } catch (error) {
      console.error("Error submitting request:", error);
      alert("There was an error submitting your request.");
    }
  };
  
  

  return (
    <div>
      <form onSubmit={submitHandler}>

            <input
            type="text"
            name="participantId"
            value={participantId}
            readOnly
            />


        <TypeOfRequestDropdown
          value={typeOfRequest}
          onChange={(e) => setTypeOfRequest(e.target.value)}
        />

        <label>Full Name:</label>
        <input
          type="text"
          name="requester"
          value={requester}
          onChange={(e) => setRequester(e.target.value)}
        />

        <label>Your Email:</label>
        <input
          type="text"
          name="requesterEmail"
          value={requesterEmail}
          onChange={(e) => setRequesterEmail(e.target.value)}
        />

        <label>Comment:</label>
        <input
          type="text"
          name="requesterComment"
          value={requesterComment}
          onChange={(e) => setRequesterComment(e.target.value)}
        />

        <label>Current Date and Time:</label>
        <input
          type="datetime-local"
          name="dateRequested"
          value={dateRequested}
          onChange={(e) => setDateRequested(e.target.value)}
        />

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default DeleteRequest;
