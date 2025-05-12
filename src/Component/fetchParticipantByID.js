import axios from "axios";
import { hostName } from './HostNames';
//const hostName = process.env.REACT_APP_HOST_NAME;

/**
 * Fetch participant details by ID
 * @param {string} participantID - The participant's ID number
 * @returns {Promise<Object>} - The participant data object
 */
export async function fetchParticipantById(participantID) {
  try {
    const response = await axios.get(`https://${hostName}/api/Participant/${participantID}`);
    
    const participant = response.data;

    return {
      training_Day_1: participant.training_Day_1,
      training_Day_2: participant.training_Day_2,
      modality: participant.modality,
      RJ_Centre: participant.RJ_Centre,
      type_of_Institution: participant.type_of_Institution,
      name_of_Institution: participant.name_of_Institution,
      institution_Parish: participant.institution_Parish,
      institution_Community: participant.institution_Community,
      institution_X: participant.institution_X,
      institution_Y: participant.institution_Y,
      training_Instructor_1: participant.training_Instructor_1,
      training_Instructor_2: participant.training_Instructor_2,
      participant_First_Name: participant.participant_First_Name,
      participant_Last_Name: participant.participant_Last_Name,
      participant_Gender: participant.participant_Gender,
      date_Of_Birth: participant.date_Of_Birth,
      street_Num_Name: participant.street_Num_Name,
      locality: participant.locality,
      participant_Parish: participant.participant_Parish,
      participant_Community: participant.participant_Community,
      participant_X: participant.participant_X,
      participant_Y: participant.participant_Y,
      participant_Position: participant.participant_Position,
      participant_Telephone: participant.participant_Telephone,
      participant_Email: participant.participant_Email,   
      training_Number: participant.training_Number,
      participants_ID: participant.participants_ID,
      certified: participant.certified,
      submitted_By: participant.submitted_By,
      last_Edit: participant.last_Edit,
    };
  } catch (error) {
    console.error("Error fetching participant by ID:", error.response?.data || error.message);
    throw new Error("Failed to fetch participant. Please check the ID and try again.");
  }
}
