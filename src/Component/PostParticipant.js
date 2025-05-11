import React, { useState, useEffect } from "react";
import "./PostParticipant.css";
import axios from "axios";
import { hostName } from "./HostNames";

import CommunityMap from "./CommunityMap";


import {
  GenderDropdown,
  ModalityDropdown,
  RJCentreLocationDropdown,
  CertificationRadioButtons,
  TypeOfInstitutionDropdown,
  InstitutionNameDropdown,
  ParticipantPositionDropdown,
} from "./Dropdowns";



const PostParticipant = () => {

  //const navigate = useNavigate();


const [activeMap, setActiveMap] = useState(null); // null | 'map1' | 'map2'

  const [submitterEmail, setSubmitterEmail] = useState("");
  
  const [trainingDay1, setTrainingDay1] = useState(null);
  const [trainingDay2, setTrainingDay2] = useState(null);
  const [centreLocation, setCentreLocation] = useState("");
  const [modality, setModality] = useState("");
  const [institutionType, setInstitutionType] = useState("");
  const [institutionName, setInstitutionName] = useState([]);
  const [position, setPosition] = useState("");

  const [institutionParish, setInstitutionParish] = useState("");
  const [institutionCommunity, setInstitutionCommunity] = useState("");
  const [institutionX, setInstitutionX] = useState("");
  const [institutionY, setInstitutionY] = useState("");

  const [trainingInstructor1, setTrainingInstructor1] = useState("");
  const [trainingInstructor2, setTrainingInstructor2] = useState("");
  const [participantFirstName, setParticipantFirstName] = useState("");
  const [participantLastName, setParticipantLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [sex, setSex] = useState("");
  const [street_Num_Name, setStreet_Num_Name] = useState("");

  const [locality, setLocality] = useState("");
  const [participantParish, setParticipantParish] = useState("");
  const [participantCommunity, setParticipantCommunity] = useState("");
  const [participantX, setParticipantX] = useState("");
  const [participantY, setParticipantY] = useState("");

  const [participantTelephone, setParticipantTelephone] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");
  const [certified, setCertified] = useState("no");


  const clearForm = () => {
    // Reset all form values to their initial states (empty or default values)
    setTrainingDay1('');
    setTrainingDay2('');
    setModality('');
    setCentreLocation('');
    setInstitutionType('');
    setInstitutionName('');
    setInstitutionParish('');
    setInstitutionCommunity('');
    setTrainingInstructor1('');
    setTrainingInstructor2('');
    setParticipantFirstName('');
    setParticipantLastName('');
    setSex('');
    setDateOfBirth('');
    setPosition('');
    setStreet_Num_Name('');
    setLocality('');
    setParticipantParish('');
    setParticipantCommunity('');
    setParticipantTelephone('');
    setParticipantEmail('');
  };

  const clearParticipant = () => {
    // Reset the participant-related fields only
    setParticipantFirstName('');
    setParticipantLastName('');
    setSex('');
    setDateOfBirth('');
    setPosition('');
    setStreet_Num_Name('');
    setLocality('');
    setParticipantParish('');
    setParticipantCommunity('');
    setParticipantTelephone('');
    setParticipantEmail('');
  };

  useEffect(() => {
    const user = {
      email: localStorage.getItem("email")
    };
    setSubmitterEmail(user.email || "");
  }, []);



  const handleFeatureSelect = ({ COMM_NAME, PARISH, POST_CODES, LATITUDE, LONGITUDE }) => {
    if (activeMap === 'map1') {
      setInstitutionParish(PARISH);
      setInstitutionCommunity(COMM_NAME);
      setInstitutionX(LONGITUDE);
      setInstitutionY(LATITUDE);
    
  
    } else if (activeMap === 'map2') {
      setParticipantParish(PARISH);
      setParticipantCommunity(COMM_NAME);
      setLocality(POST_CODES);
      setParticipantX(LONGITUDE);
      setParticipantY(LATITUDE);
    }
  
    setActiveMap(null); // Close map after selection
  };
  
 
  const handleInstitutionTypeChange = (e) => {
    setInstitutionType(e.target.value);
    setInstitutionName(""); // Reset community when parish changes!
    setPosition("");
  };

  const [errors, setErrors] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault();
      const newErrors = {};

            if (!trainingDay1) newErrors.trainingDay1 = true;
            if (!trainingDay2) newErrors.trainingDay2 = true;
            if (!modality) newErrors.modality = true;
            if (!centreLocation) newErrors.centreLocation = true;
            if (!institutionType) newErrors.institutionType = true;
            if (!institutionName) newErrors.institutionName = true;

           if (!institutionParish) newErrors.institutionParish = true;
           if (!institutionCommunity) newErrors.institutionCommunity = true;

            if (!participantFirstName) newErrors.participantFirstName = true;
            if (!participantLastName) newErrors.participantLastName = true;
            if (!sex) newErrors.sex = true;
            if (!dateOfBirth) newErrors.dateOfBirth = true;
            if (!position) newErrors.position = true;

           if (!participantParish) newErrors.participantParish = true;
           if (!participantCommunity) newErrors.participantCommunity = true;

            if (Object.keys(newErrors).length > 0) {
              setErrors(newErrors);
              const firstMissing = Object.keys(newErrors)[0];
              alert(`Please fill out the ${firstMissing} field.`);
              return;
            }

    const dob = dateOfBirth ? new Date(dateOfBirth).toISOString().split("T")[0] : "";

    try {
      const check = await axios.get(`https://${hostName}/api/Participant/ParticipantExists`, {
        params: {
          firstName: participantFirstName,
          lastName: participantLastName,
          dateOfBirth: dob
        }
      });

      if (check.data.exists) {
        alert("Participant already exists");
        return;
      }
    } catch (err) {
      console.error("Error checking participant existence:", err);
      alert("Could not verify if the participant already exists. Please try again.");
      return;
    }

    const day1 = trainingDay1 ? new Date(trainingDay1).toISOString().split("T")[0] : "";
    const day2 = trainingDay2 ? new Date(trainingDay2).toISOString().split("T")[0] : "";

    
    const formData = {
      Training_Day_1: day1,
      Training_Day_2: day2,
      RJ_Centre: centreLocation,
      Modality: modality,
      Type_of_Institution: institutionType,
      Name_of_Institution: institutionName,

      Institution_Parish: institutionParish,
      Institution_Community: institutionCommunity,
      Institution_X: institutionX,
      Institution_Y: institutionY,

      Training_Instructor_1: trainingInstructor1,
      Training_Instructor_2: trainingInstructor2,
      Participant_First_Name: participantFirstName,
      Participant_Last_Name: participantLastName,
      Participant_Gender: sex,
      Date_Of_Birth: dob,
      Street_Num_Name: street_Num_Name,

      Locality: locality,
      Participant_Parish: participantParish,
      Participant_Community: participantCommunity,
      Participant_X: participantX,
      Participant_Y: participantY,

      Participant_Position: position,
      Participant_Telephone: participantTelephone,
      Participant_Email: participantEmail,
      Submitted_By: submitterEmail,
      Certified: certified
    }; 

    try {
      const res = await axios.post(`https://${hostName}/api/Participant/AddParticipant`, formData, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Server Response:", res.data);
      alert("Participant successfully added!");
      clearParticipant();
    } catch (err) {
      console.error("Error submitting participant:", err.response?.data || err.message);
      alert("Error submitting participant. Please try again.");
    }
  };

  return (
    <div>
      
     
      <form onSubmit={submitHandler}>
  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    <div style={{ width: '48%' }}>
      <label>Training Day 1:</label>
      <input
        type="date"
        name="trainingDay1"
        value={trainingDay1}
        onChange={(e) => setTrainingDay1(e.target.value)}
        style={errors.trainingDay1 ? { border: '1px solid red' } : {}}
      />
    </div>

    <div style={{ width: '48%' }}>
      <label>Training Day 2:</label>
      <input
        type="date"
        name="trainingDay2"
        value={trainingDay2}
        onChange={(e) => setTrainingDay2(e.target.value)}
        style={errors.trainingDay2 ? { border: '1px solid red' } : {}}
        
      />
    </div>

    <div style={{ width: '48%', marginTop: '20px' }}>
    <label>Modality:</label>
      <ModalityDropdown
        value={modality}
        onChange={(e) => setModality(e.target.value)}
        style={errors.modality ? { border: '1px solid red' } : {}}
      />
    </div>

    <div style={{ width: '48%', marginTop: '20px' }}>
      <label>RJ Centre Location:</label>
        <RJCentreLocationDropdown
          value={centreLocation}
          onChange={(e) => setCentreLocation(e.target.value)}
          style={errors.centreLocation ? { border: '1px solid red' } : {}}
        />
    </div>
  </div>

  <div style={{ display: 'flex', gap: '20px' }}>
    <div style={{ width: '48%' }}>
    <label>Type of institution:</label>
    <TypeOfInstitutionDropdown value={institutionType} 
      onChange={handleInstitutionTypeChange}
      style={errors.institutionType ? { border: '1px solid red' } : {}}
      />
    </div>
    
    <div style={{ width: '48%' }}>
    <label>Name of institution:</label>
    <InstitutionNameDropdown institution={institutionType} value={institutionName} 
    onChange={(e) => setInstitutionName(e.target.value)} 
    style={errors.institutionName ? { border: '1px solid red' } : {}}
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
    <label>Institution Parish:</label>
    <input
        type="text"
        value={institutionParish}
        onChange={(e) => setInstitutionParish(e.target.value)}
        placeholder="Parish"
        readOnly
      />
    </div>

    <div style={{ width: '48%' }}>
    <label>Institution Community:</label>
    <input
        type="text"
        value={institutionCommunity}
        onChange={(e) => setInstitutionCommunity(e.target.value)}
        placeholder="Community"
        readOnly
      />
    </div>
  </div>

  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
    <div style={{ width: '48%' }}>
      <label>Training Instructor1 Name:</label>
      <input
        type="text"
        name="trainingInstructor1"
        value={trainingInstructor1}
        onChange={(e) => setTrainingInstructor1(e.target.value)}
      />
    </div>

    <div style={{ width: '48%' }}>
      <label>Training Instructor2 Name:</label>
      <input
        type="text"
        name="trainingInstructor2"
        value={trainingInstructor2}
        onChange={(e) => setTrainingInstructor2(e.target.value)}
      />
    </div>

    <div style={{ display: 'flex', gap: '20px' }}>
      <div style={{ width: '48%' }}>
        <label>Participant's First Name:</label>
        <input
          type="text"
          name="participantFirstName"
          value={participantFirstName}
          onChange={(e) => setParticipantFirstName(e.target.value)}
          style={errors.participantFirstName ? { border: '1px solid red' } : {}}
        />
      </div>

      <div style={{ width: '48%' }}>
        <label>Participant's Last Name:</label>
        <input
          type="text"
          name="participantLastName"
          value={participantLastName}
          onChange={(e) => setParticipantLastName(e.target.value)}
          style={errors.participantLastName ? { border: '1px solid red' } : {}}
        />
      </div>
    </div>

    <div style={{ width: '48%' }}>
    <label>Select sex:</label>
      <GenderDropdown
        value={sex}
        onChange={(e) => setSex(e.target.value)}
        style={errors.sex? { border: '1px solid red' } : {}}
        placeholder="Select sex"
      />
    </div>

    <div style={{ width: '48%' }}>
      <label>Date of Birth:</label>
      <input
        type="date"
        name="dateOfBirth"
        value={dateOfBirth}
        onChange={(e) => setDateOfBirth(e.target.value)}
        style={errors.dateOfBirth? { border: '1px solid red' } : {}}
      />
    </div>

    <div style={{ width: '48%' }}>
    <label>Position:</label>
    <ParticipantPositionDropdown 
    institution={institutionType} 
    value={position} 
    onChange={(e) => setPosition(e.target.value)} 
    style={errors.position? { border: '1px solid red' } : {}}
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
            <label>Street Number and Name:</label>
            <input
              type="text"
              name="street_Num_Name"
              value={street_Num_Name}
              onChange={(e) => setStreet_Num_Name(e.target.value)}
              placeholder="10 Main Street"
            />
        </div>
      

      <div style={{ width: '48%' }}>
        <label>Locality:</label>
        <input
        type="text"
        value={locality}
        onChange={(e) => setLocality(e.target.value)}
        placeholder="KGN 1"
        readOnly
      />
      </div>
    </div>

        <div style={{ width: '48%' }}>
        <label>Participant Parish:</label>
        <input
        type="text"
        value={participantParish}
        onChange={(e) => setParticipantParish(e.target.value)}
        placeholder="Parish"
        readOnly
      />
        </div>
        
        <div style={{ width: '48%' }}>
        <label>Participant Community:</label>      
        <input
        type="text"
        value={participantCommunity}
        onChange={(e) => setParticipantCommunity(e.target.value)}
        placeholder="Community"
        readOnly

      />
        </div>

    <div style={{ width: '48%' }}>
      <label>Participant's Telephone:</label>
      <input
        type="text"
        name="participantTelephone"
        value={participantTelephone}
        onChange={(e) => setParticipantTelephone(e.target.value)}
      />
    </div>

    <div style={{ width: '48%' }}>
      <label>Participant's Email:</label>
      <input
        type="text"
        name="participantEmail"
        value={participantEmail}
        onChange={(e) => setParticipantEmail(e.target.value)}
      />
    </div>
    
    <label>Certified:</label>
    <CertificationRadioButtons
      value={certified}
      onChange={(e) => setCertified(e.target.value)}
    />


  </div>

  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
  <button
    type="submit"
    style={{
      padding: '10px 20px',
      backgroundColor: 'blue',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    Submit
  </button>

  <button
    type="button"
    onClick={clearForm}
    style={{
      padding: '10px 20px',
      backgroundColor: 'gray',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    Clear Form
  </button>

  <button
    type="button"
    onClick={clearParticipant}
    style={{
      padding: '10px 20px',
      backgroundColor: 'orange',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
    }}
  >
    Clear Participant
  </button>
</div>

</form>

    {activeMap && (
        <CommunityMap onFeatureSelect={handleFeatureSelect} />
      )}

    </div>
  );
};

export default PostParticipant;
