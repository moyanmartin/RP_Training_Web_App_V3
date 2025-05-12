import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchParticipantById } from "./fetchParticipantByID";
import { hostName } from './HostNames';
import {  useNavigate } from "react-router-dom";
import CommunityMap from "./CommunityMap";

import {
  GenderDropdown,
  ModalityDropdown,
  RJCentreLocationDropdown,
  CertificationRadioButtons,
  ParticipantPositionDropdown,
} from "./Dropdowns";
  

  const EditParticipant = () => {

    const [activeMap, setActiveMap] = useState(null); // null | 'map1' | 'map2'

    const [submitterEmail, setSubmitterEmail] = useState("");
    
      useEffect(() => {
        const user = {
          email: localStorage.getItem("email")
        };
        setSubmitterEmail(user.email || "");
      }, []);
    

    const { id } = useParams();
    const navigate = useNavigate();
    const [participant, setParticipant] = useState({
      participantID: "",
      trainingDay1: "",
      trainingDay2: "",
      modality: "",
      RJ_Centre: "",
      institutionType: "",
      institutionName: "",
      institutionParish: "",
      institutionCommunity: "",
      institutionX: "",
      institutionY: "",
      trainingInstructor1: "",
      trainingInstructor2: "",      
      participantFirstName: "",
      participantLastName: "",
      sex: "",
      dateOfBirth: "",
      street_Num_Name: "",
      locality: "",
      position: "",
      participantParish: "",
      participantCommunity: "",
      participantX: "",
      participantY: "",
      participantTelephone: "",
      participantEmail: "",
      submittedBy: "",
      certified: "no",
    });
  
    const handleFeatureSelect = ({ COMM_NAME, PARISH, POST_CODES, LATITUDE, LONGITUDE }) => {
      if (activeMap === 'map1') {

        setParticipant({
          ...participant,
          institutionParish: PARISH,
          institutionCommunity: COMM_NAME, // Reset community when parish changes
          institutionX: LONGITUDE,
          institutionY: LATITUDE,
        });
       
      } else if (activeMap === 'map2') {
        setParticipant({
          ...participant,
          participantParish: PARISH,
          participantCommunity: COMM_NAME, // Reset community when parish changes
          locality: POST_CODES,
          participantX: LONGITUDE,
          participantY: LATITUDE,
        });
      }
    
      setActiveMap(null); // Close map after selection
    };

    
      

 
  // Fetch participant data when the component mounts or when 'id' changes
  useEffect(() => {
    if (!id) return;

    const fetchParticipant = async () => {
      try {
        const participantData = await fetchParticipantById(id);
        setParticipant({
          participantID: participantData.participants_ID || "",
          trainingDay1: participantData.training_Day_1 || "",
          trainingDay2: participantData.training_Day_2 || "",
          modality: participantData.modality || "",
          RJ_Centre: participantData.RJ_Centre || "",
          institutionType: participantData.type_of_Institution || "",
          institutionName: participantData.name_of_Institution || "",
          institutionParish: participantData.institution_Parish || "",
          institutionCommunity: participantData.institution_Community || "",
          institutionX: participantData.institution_X || "",
          institutionY: participantData.institution_Y || "",
          trainingInstructor1: participantData.training_Instructor_1 || "",
          trainingInstructor2: participantData.training_Instructor_2 || "",
          participantFirstName: participantData.participant_First_Name || "",
          participantLastName: participantData.participant_Last_Name || "",
          sex: participantData.participant_Gender || "",
          dateOfBirth: participantData.date_Of_Birth || "",
          street_Num_Name: participantData.street_Num_Name || "",
          locality: participantData.locality || "",
          participantParish: participantData.participant_Parish || "",
          participantCommunity: participantData.participant_Community || "",
          participantX: participantData.participant_X || "",
          participantY: participantData.participant_Y || "",
          position: participantData.participant_Position || "",
          participantTelephone: participantData.participant_Telephone || "",
          participantEmail: participantData.participant_Email || "",
          submittedBy: participantData.submitted_By || submitterEmail, // <-- fallback to logged-in user
          certified: participantData.certified || "no",
        });
        
      } catch (error) {
        console.error("Error fetching participant data:", error);
      }
    };
    

    fetchParticipant();
  }, [id, submitterEmail]); // Add submitterEmail here

  const submitHandler = async (event) => {
    event.preventDefault();

   
    const isValidDate = (date) => !isNaN(new Date(date).getTime());

    if (!isValidDate(participant.trainingDay1) || !isValidDate(participant.trainingDay2)) {
      alert("Please enter valid dates for Training Day 1 and 2.");
      return;
    }

    // Format the dates for submission (YYYY-MM-DD)
    const trainingDay1 = participant.trainingDay1
      ? new Date(participant.trainingDay1).toISOString().split("T")[0]
      : "";

    const trainingDay2 = participant.trainingDay2
      ? new Date(participant.trainingDay2).toISOString().split("T")[0]
      : "";

      const dateOfBirth = participant.dateOfBirth
      ? new Date(participant.dateOfBirth).toISOString().split("T")[0]
      : "";

      const formData = {
        Training_Day_1: trainingDay1,
        Training_Day_2: trainingDay2,
        Modality: participant.modality,
        RJ_Centre: participant.RJ_Centre,
        Type_of_Institution: participant.institutionType,
        Name_of_Institution: participant.institutionName,  // consistent camelCase
        Institution_Parish: participant.institutionParish,
        Institution_Community: participant.institutionCommunity,
        Institution_X: participant.institutionX,
        Institution_Y: participant.institutionY,
        Training_Instructor_1: participant.trainingInstructor1,
        Training_Instructor_2: participant.trainingInstructor2,
        Participant_First_Name: participant.participantFirstName,
        Participant_Last_Name: participant.participantLastName,
        Participant_Gender: participant.sex,
        Date_Of_Birth: dateOfBirth,  // use formatted date
        Street_Num_Name: participant.street_Num_Name,
        Locality: participant.locality,
        Participant_Parish: participant.participantParish,
        Participant_Community: participant.participantCommunity,
        Participant_X: participant.participantX,
        Participant_Y: participant.participantY,
        Participant_Position: participant.position,
        Participant_Telephone: participant.participantTelephone,
        Participant_Email: participant.participantEmail,
        Participants_ID: participant.participantID,
        Certified: participant.certified,
        Submitted_By: submitterEmail,
        Last_Edit: new Date().toISOString(),
      };
      

    console.log("Submitting Data:", JSON.stringify(formData, null, 2));

    
    try {
      // Correct endpoint and method (PUT request)
      const response = await axios.put(
        `https://${hostName}/api/Participant/${id}`, // Use id in URL for the PUT request
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Server Response:", response.data);
      alert("Participant successfully updated!");
      navigate('/search');

    } catch (error) {
      console.error("Error status:", error.response?.status);
      console.error("Error response:", error.response?.data);
      console.error("Full error object:", error);

      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
        alert("Validation errors occurred: " + JSON.stringify(error.response.data.errors));
      } else {
        alert("Error submitting participant. Please try again.");
      }
    }
  };

 

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Participant's ID Number:</label>
        <input
          type="text"
          name="participantID"
          value={participant.participantID}
          readOnly
        />
  
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ width: '48%' }}>
            <label>Training Day 1:</label>
            <input
              type="date"
              name="trainingDay1"
              value={participant.trainingDay1}
              readOnly
            />
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Training Day 2:</label>
            <input
              type="date"
              name="trainingDay2"
              value={participant.trainingDay2}
              readOnly
            />
          </div>
  
          <div style={{ width: '48%', marginTop: '20px' }}>
          <label>Modality:</label>
            <ModalityDropdown
              value={participant.modality}
              onChange={(e) => setParticipant({ ...participant, modality: e.target.value })}
            />
          </div>
  
          <div style={{ width: '48%', marginTop: '20px' }}>
          <label>RJ Centre Location:</label>
          <RJCentreLocationDropdown
              value={participant.RJ_Centre}
              onChange={(e) => setParticipant({ ...participant, RJ_Centre: e.target.value })
              }
            />
          </div>
        </div>
  
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>Type of Institution:</label>
            <input
              type="text"
              name="typeOfInstitution"
              value={participant.institutionType}
              readOnly
            />
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Name of Institution:</label>
            <input
              type="text"
              name="nameOfInstitution"
              value={participant.institutionName}
              readOnly
            />
          </div>
        </div>

              <button
            type="button"
            onClick={() => setActiveMap('map1')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'green',
              color: 'white',
              marginLeft: '10px',
            }}
          >
            Open Map
          </button>
  
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>Parish of institution:</label>
            <input
              type="text"
              value={participant.institutionParish}
              onChange={(e) => setParticipant({ ...participant, institutionParish: e.target.value })}
              placeholder="Parish"
              readOnly
            />

                
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Community of institution:</label>
            <input
              type="text"
              value={participant.institutionCommunity}
              onChange={(e) => setParticipant({ ...participant, institutionCommunity: e.target.value })}
              placeholder="Community"
              readOnly
            />
          </div>
        </div>
  
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>Training instructor1:</label>
            <input
              type="text"
              name="trainingInstructor1"
              value={participant.trainingInstructor1}
              onChange={(e) => setParticipant({ ...participant, trainingInstructor1: e.target.value })}
            />
          </div>

          <div style={{ width: '48%' }}>
            <label>Training instructor2:</label>
            <input
              type="text"
              name="instructorName"
              value={participant.trainingInstructor2}
              onChange={(e) => setParticipant({ ...participant, trainingInstructor2: e.target.value })}
            />
          </div>
  
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '48%' }}>
              <label>Participant's First Name:</label>
              <input
                type="text"
                name="participantFirstName"
                value={participant.participantFirstName}
                onChange={(e) => setParticipant({ ...participant, participantFirstName: e.target.value })}
              />
            </div>
  
            <div style={{ width: '48%' }}>
              <label>Participant's Last Name:</label>
              <input
                type="text"
                name="participantLastName"
                value={participant.participantLastName}
                onChange={(e) => setParticipant({ ...participant, participantLastName: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '48%' }}>
          <label>Gender:</label>
            <GenderDropdown
              value={participant.sex}
              onChange={(e) => setParticipant({ ...participant, sex: e.target.value })}
            />
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Date of birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={participant.dateOfBirth}
              readOnly
            />
          </div>
          </div>    
          <div style={{ width: '48%' }}>
            <label>Position:</label>
            <ParticipantPositionDropdown 
                institution={participant.institutionType} 
                value={participant.position} 
             
                onChange={(e) => setParticipant({ ...participant, position: e.target.value })}
               // style={errors.participant.position? { border: '1px solid red' } : {}}
                />
          </div>

          <button
            type="button"
            onClick={() => setActiveMap('map2')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'green',
              color: 'white',
              marginLeft: '10px',
            }}
          >
            Open Map
          </button>
  
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ width: '48%' }}>
              <label>Street number and name:</label>
              <input
                type="text"
                name="street_Num_Name"
                value={participant.street_Num_Name}
                onChange={(e) => setParticipant({ ...participant, street_Num_Name: e.target.value })}
              />
            </div>
            
           

            <div style={{ width: '48%' }}>
              <label>Locality:</label>
              <input
                type="text"
                value={participant.locality}
                onChange={(e) => setParticipant({ ...participant, locality: e.target.value })}
                placeholder="e.g KGN 1"
                readOnly
              />
            </div>
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Participant Parish:</label>
            <input
              type="text"
              value={participant.participantParish}
              onChange={(e) => setParticipant({ ...participant, participantParish: e.target.value })}
              placeholder="Parish"
              readOnly
              />
              </div>

          <div style={{ width: '48%' }}>
          <label>Participant Community:</label>
           <input
              type="text"
              value={participant.participantCommunity}
              onChange={(e) => setParticipant({ ...participant, participantCommunity: e.target.value })}
              placeholder="Parish"
              readOnly
              />
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Participant's Telephone:</label>
            <input
              type="text"
              name="participantTelephone"
              value={participant.participantTelephone}
              onChange={(e) => setParticipant({ ...participant, participantTelephone: e.target.value })}
            />
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Participant's Email:</label>
            <input
              type="text"
              name="participantEmail"
              value={participant.participantEmail}
              onChange={(e) => setParticipant({ ...participant, participantEmail: e.target.value })}
            />
          </div>
          
          <label>Certified:</label>
          <CertificationRadioButtons
            value={participant.certified}
            onChange={(e) => setParticipant({ ...participant, certified: e.target.value })}
          />
        </div>
  
        <button type="submit">Submit</button>
      </form>

      {activeMap && (
        <CommunityMap onFeatureSelect={handleFeatureSelect} />
      )}

    </div>
  );
  
};

export default EditParticipant;

