import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { fetchParticipantById } from "./fetchParticipantByID";
import { hostName, DBhostName } from './HostNames';
import { Link, useNavigate } from "react-router-dom";

import {
  GenderDropdown,
  ModalityDropdown,
  RJCentreLocationDropdown,
  CertificationRadioButtons,
  ParishDropdown,
  ParticipantPositionDropdown,
  ParticipantCommunityDropdown,
  ParticipantParishDropdown,
  CommunityDropdown
} from "./Dropdowns";
  

  const EditParticipant = () => {

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
      centreLocation: "",
      institutionType: "",
      institutionName: "",
      institutionParish: "",
      institutionCommunity: "",
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
      participantTelephone: "",
      participantEmail: "",
      submittedBy: "",
      certified: "no",
    });
  
    const [parishes, setParishes] = useState([]);
    const [communities, setCommunities] = useState([]);

    const [participantParishes, setParticipantParishes] = useState([]);
    const [participantCommunities, setParticipantCommunities] = useState([]);

    const [institutions, setInstitutionType] = useState([]);
    const [institutionNames, setInstitutionName] = useState([]);
    const [positions, setPosition] = useState([]);
  

      const handleParticipantParishChange = (event) => {
        setParticipant({
          ...participant,
          participantParish: event.target.value,
          participantCommunity: "", // Reset community when parish changes
        });
      };



      const handleInstitutionParishChange = (e) => {
        setParticipant({
          ...participant,
          institutionParish: e.target.value,
          institutionCommunity: "" // Reset community when parish changes!
        });
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
          centreLocation: participantData.rJ_Centre || "",
          institutionType: participantData.type_of_Institution || "",
          institutionName: participantData.name_of_Institution || "",
          institutionParish: participantData.institution_Parish || "",
          institutionCommunity: participantData.institution_Community || "",
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
  }, [id]);

  const submitHandler = async (event) => {
    event.preventDefault();

    // Add validation to check if any required fields are missing
   /* const requiredFields = [
      "trainingDay1", "trainingDay2", "modality", "typeOfInstitution", "nameOfInstitution",
      "parishName", "communityName", "participantFirstName", "participantLastName", "participantParishName",
      "sex", "dateOfBirth", "position", "participantCommunityName", "centreLocation"
    ];

    for (const field of requiredFields) {
      if (!participant[field]) {
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }*/

    // Check if dates are valid
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
        training_Day_1: trainingDay1,
        training_Day_2: trainingDay2,
        modality: participant.modality,
        RJ_Centre: participant.centreLocation,
        type_of_Institution: participant.institutionType,
        name_of_Institution: participant.institutionName,  // consistent camelCase
        institution_Parish: participant.institutionParish,
        institution_Community: participant.institutionCommunity, 
        training_Instructor_1: participant.trainingInstructor1,
        training_Instructor_2: participant.trainingInstructor2,
        participant_First_Name: participant.participantFirstName,
        participant_Last_Name: participant.participantLastName,
        participant_Gender: participant.sex,
        date_Of_Birth: dateOfBirth,  // use formatted date
        street_Num_Name: participant.street_Num_Name,
        locality: participant.locality,
        participant_Parish: participant.participantParish,
        participant_Community: participant.participantCommunity,
        participant_Position: participant.position,
        participant_Telephone: participant.participantTelephone,
        participant_Email: participant.participantEmail,
        participants_ID: participant.participantID,
        certified: participant.certified,
        submitted_By: submitterEmail,
        last_Edit: new Date().toISOString(),
      };
      

    console.log("Submitting Data:", JSON.stringify(formData, null, 2));

    
    try {
      // Correct endpoint and method (PUT request)
      const response = await axios.put(
        `http://${hostName}/api/Participant/${id}`, // Use id in URL for the PUT request
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
            <ModalityDropdown
              value={participant.modality}
              onChange={(e) => setParticipant({ ...participant, modality: e.target.value })}
            />
          </div>
  
          <div style={{ width: '48%', marginTop: '20px' }}>
            <RJCentreLocationDropdown
              value={participant.centreLocation}
              onChange={(e) => setParticipant({ ...participant, centreLocation: e.target.value })}
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
  
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>Parish of institution:</label>
             <ParishDropdown 
                  value={participant.institutionParishName} 
                  onChange={handleInstitutionParishChange}
                 // style={errors.participant.institutionParishName ? { border: '1px solid red' } : {}}
                  />     
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Community of institution:</label>
             <CommunityDropdown 
                parish={participant.institutionParish} 
                value={participant.institutionCommunity} 
                onChange={(e) => setParticipant({ ...participant, institutionCommunity: e.target.value })}
                
                //style={errors.institutionCommunity ? { border: '1px solid red' } : {}}
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
              onChange={(e) => setParticipant({ ...participant, ptrainingInstructor2: e.target.value })}
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
            <GenderDropdown
              value={participant.sex}
              onChange={(e) => setParticipant({ ...participant, sex: e.target.value })}
            />
          </div>
  
          <div style={{ width: '45%' }}>
            <label>Date of birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={participant.dateOfBirth}
              readOnly
            />
          </div>
          </div>    
          <div style={{ width: '45%' }}>
            <label>Position:</label>
            <ParticipantPositionDropdown 
                institution={participant.institutionType} 
                value={participant.position} 
                onChange={(e) => setPosition(e.target.value)} 
               // style={errors.participant.position? { border: '1px solid red' } : {}}
                />
          </div>
  
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
                name="locality"
                value={participant.locality}
                onChange={(e) => setParticipant({ ...participant, locality: e.target.value })}
              />
            </div>
          </div>
  
          <div style={{ width: '48%' }}>
            <label>Participant Parish:</label>

             <ParticipantParishDropdown
              //<ParishDropdown 
              value={participant.participantParish} 
              onChange={handleParticipantParishChange}
              //style={errors.participant.participantParish? { border: '1px solid red' } : {}}
                />
              </div>
       
  
          <div style={{ width: '48%' }}>
            <label>Participant Community:</label>
             <ParticipantCommunityDropdown
              //<CommunityDropdown 
              participantParish={participant.participantParish} 
              value={participant.participantCommunity} 
              onChange={(e) => setParticipant({ ...participant, participantCommunity: e.target.value })}
              
             // style={errors.participant.participantCommunity ? { border: '1px solid red' } : {}}
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
  
          <CertificationRadioButtons
            value={participant.certified}
            onChange={(e) => setParticipant({ ...participant, certified: e.target.value })}
          />
        </div>
  
        <button type="submit">Submit</button>
      </form>
    </div>
  );
  
};

export default EditParticipant;

