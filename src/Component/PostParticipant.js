import React, { useState, useEffect } from "react";
import "./PostParticipant.css";
import axios from "axios";
import { hostName } from './HostNames';

import {
  GenderDropdown,
  ModalityDropdown,
  RJCentreLocationDropdown,
  CertificationRadioButtons,
  TypeOfInstitutionDropdown,
  InstitutionNameDropdown,
  ParishDropdown,
  ParticipantPositionDropdown,
  ParticipantCommunityDropdown,
  ParticipantParishDropdown,
  CommunityDropdown
} from "./Dropdowns";

//const hostName = process.env.REACT_APP_HOST_NAME;

const PostParticipant = () => {
  const [submitterEmail, setSubmitterEmail] = useState("");

  useEffect(() => {
    const user = {
      email: localStorage.getItem("email")
    };
    setSubmitterEmail(user.email || "");
  }, []);

  const [formData, setFormData] = useState({
    trainingDay1: null,
    trainingDay2: null,
    centreLocation: "",
    modality: "",
    institutionType: "",
    institutionName: "",
    position: "",
    institutionParish: "",
    institutionCommunity: "",
    trainingInstructor1: "",
    trainingInstructor2: "",
    participantFirstName: "",
    participantLastName: "",
    dateOfBirth: null,
    sex: "",
    street_Num_Name: "",
    locality: "",
    participantParish: "",
    participantCommunity: "",
    participantTelephone: "",
    participantEmail: "",
    certified: "no"
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleResetCommunity = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
      participantCommunity: "", // Reset participant/community fields
    });
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = true;
      }
    });
    return newErrors;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstMissing = Object.keys(validationErrors)[0];
      alert(`Please fill out the ${firstMissing} field.`);
      return;
    }

    const dob = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : "";

    try {
      const check = await axios.get(`http://${hostName}/api/Participant/ParticipantExists`, {
        params: {
          firstName: formData.participantFirstName,
          lastName: formData.participantLastName,
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

    const day1 = formData.trainingDay1 ? new Date(formData.trainingDay1).toISOString().split("T")[0] : "";
    const day2 = formData.trainingDay2 ? new Date(formData.trainingDay2).toISOString().split("T")[0] : "";

    const payload = { ...formData, Training_Day_1: day1, Training_Day_2: day2, Date_Of_Birth: dob, Submitted_By: submitterEmail };
    try {
      const res = await axios.post(`http://${hostName}/api/Participant/AddParticipant`, payload, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Server Response:", res.data);
      alert("Participant successfully added!");
      setFormData({ ...formData, participantFirstName: '', participantLastName: '' }); // Clear participant fields
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
              value={formData.trainingDay1}
              onChange={handleChange}
              style={errors.trainingDay1 ? { border: '1px solid red' } : {}}
            />
          </div>
          <div style={{ width: '48%' }}>
            <label>Training Day 2:</label>
            <input
              type="date"
              name="trainingDay2"
              value={formData.trainingDay2}
              onChange={handleChange}
              style={errors.trainingDay2 ? { border: '1px solid red' } : {}}
            />
          </div>
          <div style={{ width: '48%', marginTop: '20px' }}>
            <label>Modality:</label>
            <ModalityDropdown
              value={formData.modality}
              onChange={handleChange}
              style={errors.modality ? { border: '1px solid red' } : {}}
            />
          </div>
          <div style={{ width: '48%', marginTop: '20px' }}>
            <label>RJ Centre Location:</label>
            <RJCentreLocationDropdown
              value={formData.centreLocation}
              onChange={handleChange}
              style={errors.centreLocation ? { border: '1px solid red' } : {}}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>Type of institution:</label>
            <TypeOfInstitutionDropdown
              value={formData.institutionType}
              onChange={handleChange}
              style={errors.institutionType ? { border: '1px solid red' } : {}}
            />
          </div>
          <div style={{ width: '48%' }}>
            <label>Name of institution:</label>
            <InstitutionNameDropdown
              institution={formData.institutionType}
              value={formData.institutionName}
              onChange={handleChange}
              style={errors.institutionName ? { border: '1px solid red' } : {}}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>Institution Parish:</label>
            <ParishDropdown
              value={formData.institutionParish}
              onChange={(e) => handleResetCommunity('institutionParish', e.target.value)}
              style={errors.institutionParish ? { border: '1px solid red' } : {}}
            />
          </div>
          <div style={{ width: '48%' }}>
            <label>Institution Community:</label>
            <CommunityDropdown
              parish={formData.institutionParish}
              value={formData.institutionCommunity}
              onChange={handleChange}
              style={errors.institutionCommunity ? { border: '1px solid red' } : {}}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ width: '48%' }}>
            <label>Participant's First Name:</label>
            <input
              type="text"
              name="participantFirstName"
              value={formData.participantFirstName}
              onChange={handleChange}
              style={errors.participantFirstName ? { border: '1px solid red' } : {}}
            />
          </div>
          <div style={{ width: '48%' }}>
            <label>Participant's Last Name:</label>
            <input
              type="text"
              name="participantLastName"
              value={formData.participantLastName}
              onChange={handleChange}
              style={errors.participantLastName ? { border: '1px solid red' } : {}}
            />
          </div>
        </div>

        <div style={{ width: '48%' }}>
          <label>Select sex:</label>
          <GenderDropdown
            value={formData.sex}
            onChange={handleChange}
            style={errors.sex ? { border: '1px solid red' } : {}}
          />
        </div>

        <div style={{ width: '48%' }}>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            style={errors.dateOfBirth ? { border: '1px solid red' } : {}}
          />
        </div>

        <div style={{ width: '48%' }}>
          <label>Position:</label>
          <ParticipantPositionDropdown
            institution={formData.institutionType}
            value={formData.position}
            onChange={handleChange}
            style={errors.position ? { border: '1px solid red' } : {}}
          />
        </div>

        <div style={{ width: '48%' }}>
          <label>Community:</label>
          <ParticipantCommunityDropdown
            parish={formData.participantParish}
            value={formData.participantCommunity}
            onChange={handleChange}
            style={errors.participantCommunity ? { border: '1px solid red' } : {}}
          />
        </div>

        <div style={{ width: '48%' }}>
          <label>Parish:</label>
          <ParticipantParishDropdown
            value={formData.participantParish}
            onChange={(e) => handleResetCommunity('participantParish', e.target.value)}
            style={errors.participantParish ? { border: '1px solid red' } : {}}
          />
        </div>

        <div style={{ width: '48%' }}>
          <label>Telephone:</label>
          <input
            type="tel"
            name="participantTelephone"
            value={formData.participantTelephone}
            onChange={handleChange}
            style={errors.participantTelephone ? { border: '1px solid red' } : {}}
          />
        </div>

        <div style={{ width: '48%' }}>
          <label>Email:</label>
          <input
            type="email"
            name="participantEmail"
            value={formData.participantEmail}
            onChange={handleChange}
            style={errors.participantEmail ? { border: '1px solid red' } : {}}
          />
        </div>

        <div>
          <label>Certified?</label>
          <CertificationRadioButtons
            value={formData.certified}
            onChange={handleChange}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default PostParticipant;
