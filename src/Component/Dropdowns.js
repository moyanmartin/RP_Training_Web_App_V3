// In components/Dropdowns.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { hostName } from './HostNames';
import '../App.css';




export function ParishDropdown({ value, onChange }) {
  const [parishes, setParishes] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/parishes`)
      .then(response => {
        setParishes(response.data);
      })
      .catch(error => {
        console.error("Error fetching parishes:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select parish --</option>
      {parishes.map((parish, index) => (
        <option key={index} value={parish}>{parish}</option>
      ))}
    </select>
  );
}

export function ParticipantParishDropdown({ value, onChange }) {
  const [participantParishes, setParticipantParishes] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/parishes`)
      .then(response => {
        setParticipantParishes(response.data);
      })
      .catch(error => {
        console.error("Error fetching parishes:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select parish --</option>
      {participantParishes.map((participantParish, index) => (
        <option key={index} value={participantParish}>{participantParish}</option>
      ))}
    </select>
  );
}

export function CommunityDropdown({ parish, value, onChange }) {
  const [communities, setCommunities] = useState([]);

  useEffect(() => {
    console.log("Fetching communities for parish:", parish);
  
    if (parish) {
      axios.get(`https://${hostName}/api/DropDowns/communities?parish=${encodeURIComponent(parish)}`)
        .then(response => {
          console.log("Received communities for", parish, ":", response.data); // Debug log for API response
          setCommunities(response.data);
        })
        .catch(error => {
          console.error("Error fetching communities:", error);
          setCommunities([]); // Clear communities on error
        });
    } else {
      setCommunities([]); // Clear communities if no parish is selected
    }
  }, [parish]); // Only dependency is parish
  

  console.log("Rendering CommunityDropdown for parish:", parish); // Debug log for re-rendering

  return (
    <div>
      <input
        list="community-options"
        value={value}
        onChange={onChange}
        disabled={!parish}
        placeholder={parish ? "Type or select a community" : "Select parish first"}
      />
      <datalist id="community-options">
        {communities.map((community, index) => (
          <option key={index} value={community} />
        ))}
      </datalist>
    </div>
  );
}

export function ParticipantCommunityDropdown({ participantParish, value, onChange }) {
  const [participantCommunities, setParticipantCommunities] = useState([]);

  useEffect(() => {
    console.log("Fetching communities for parish:", participantParish);
  
    if (participantParish) {
      axios.get(`https://${hostName}/api/DropDowns/communities?parish=${encodeURIComponent(participantParish)}`)
        .then(response => {
          console.log("Received communities for", participantParish, ":", response.data); // Debug log for API response
          setParticipantCommunities(response.data);
        })
        .catch(error => {
          console.error("Error fetching communities:", error);
          setParticipantCommunities([]); // Clear communities on error
        });
    } else {
      setParticipantCommunities([]); // Clear communities if no parish selected
    }
  }, [participantParish]); // Only dependency is participantParish
  
  

  console.log("Rendering CommunityDropdown for parish:", participantParish); // Debug log for re-rendering

  return (
    <div>
      <input
        list="participantCommunity-options"
        value={value}
        onChange={onChange}
        disabled={!participantParish}
        placeholder={participantParish ? "Type or select a community" : "Select parish first"}
        
      />
      <datalist id="participantCommunity-options">
        {participantCommunities.map((participantCommunity, index) => (
          <option key={index} value={participantCommunity} />
        ))}
      </datalist>
    </div>
  );
}




export function TypeOfInstitutionDropdown({ value, onChange }) {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/institutions`)
      .then(response => {
        setInstitutions(response.data);
      })
      .catch(error => {
        console.error("Error fetching type of institutions:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select type of institution --</option>
      {institutions.map((institution, index) => (
        <option key={index} value={institution}>{institution}</option>
      ))}
    </select>
  );
}

export function InstitutionNameDropdown({ institution, value, onChange }) {
  const [institutionNames, setInstitutionNames] = useState([]);

  useEffect(() => {
    if (institution) {
      axios.get(`https://${hostName}/api/DropDowns/institutionNames?institution=${encodeURIComponent(institution)}`)
        .then(response => {
          setInstitutionNames(response.data);
        })
        .catch(error => {
          console.error("Error fetching positions:", error);
          setInstitutionNames([]);
        });
    } else {
      setInstitutionNames([]);
    }
  }, [institution]);

  return (
    <div>
      <input
        list="institutionName-options"
        value={value}
        onChange={onChange}
        disabled={!institution}
        placeholder={institution ? "Type or select institution name" : "Select institution first"}
      />
      <datalist id="institutionName-options">
        {institutionNames.map((institutionName, index) => (
          <option key={index} value={institutionName} />
        ))}
      </datalist>
    </div>
  );
}

export function ParticipantPositionDropdown({ institution, value, onChange }) {
  const [participantPositions, setParticipantPositions] = useState([]);

  useEffect(() => {
    if (institution) {
      axios.get(`https://${hostName}/api/DropDowns/participantPositions?institution=${encodeURIComponent(institution)}`)
        .then(response => {
          setParticipantPositions(response.data);
        })
        .catch(error => {
          console.error("Error fetching positions:", error);
          setParticipantPositions([]);
        });
    } else {
      setParticipantPositions([]);
    }
  }, [institution]);

  return (
    <div>
      <input
        list="participantPosition-options"
        value={value}
        onChange={onChange}
        disabled={!institution}
        placeholder={institution ? "Type or select position" : "Select institution first"}
      />
      <datalist id="participantPosition-options">
        {participantPositions.map((participantPosition, index) => (
          <option key={index} value={participantPosition} />
        ))}
      </datalist>
    </div>
  );
}


export function GenderDropdown({ value, onChange }) {
  const [genders, setGenders] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/genders`)
      .then(response => {
        setGenders(response.data);
      })
      .catch(error => {
        console.error("Error fetching Genders:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select sex --</option>
      {genders.map((gender, index) => (
        <option key={index} value={gender}>{gender}</option>
      ))}
    </select>
  );
}


export function ModalityDropdown({ value, onChange }) {
  const [modalities, setModalities] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/modalities`)
      .then(response => {
        setModalities(response.data);
      })
      .catch(error => {
        console.error("Error fetching Modalities:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select modality --</option>
      {modalities.map((modality, index) => (
        <option key={index} value={modality}>{modality}</option>
      ))}
    </select>
  );
}


export function RJCentreLocationDropdown({ value, onChange }) {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/rjCentreLocations`)
      .then(response => {
        setLocations(response.data);
      })
      .catch(error => {
        console.error("Error fetching RJ Centre Locations:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select RJ Centre Location --</option>
      {locations.map((location, index) => (
        <option key={index} value={location}>{location}</option>
      ))}
    </select>
  );
}

export function TypeOfUserDropdown({ value, onChange }) {
  const [typeOfUsers, setTypeOfUsers] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/typeOfUsers`)
      .then(response => {
        setTypeOfUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching type of users:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select type of user --</option>
      {typeOfUsers.map((typeOfUser, index) => (
        <option key={index} value={typeOfUser}>{typeOfUser}</option>
      ))}
    </select>
  );
}

export function TypeOfRequestDropdown({ value, onChange }) {
  const [typeOfRequests, setTypeOfRequests] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/typeOfRequests`)
      .then(response => {
        setTypeOfRequests(response.data);
      })
      .catch(error => {
        console.error("Error fetching type of requests:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select type of request --</option>
      {typeOfRequests.map((typeOfRequest, index) => (
        <option key={index} value={typeOfRequest}>{typeOfRequest}</option>
      ))}
    </select>
  );
}

export function StaffPositionDropdown({ value, onChange }) {
  const [staffPositions, setStaffPositions] = useState([]);

  useEffect(() => {
    axios.get(`https://${hostName}/api/DropDowns/staffPositions`)
      .then(response => {
        setStaffPositions(response.data);
      })
      .catch(error => {
        console.error("Error fetching staff positions:", error);
      });
  }, []);

  return (
    <select value={value} onChange={onChange}>
      <option value="">-- Select position --</option>
      {staffPositions.map((staffPosition, index) => (
        <option key={index} value={staffPosition}>{staffPosition}</option>
      ))}
    </select>
  );
}


export const CertificationRadioButtons = ({ value, onChange }) => (
  <div className="radio-group">
    <label className="radio-options">
      <input 
        type="radio" 
        name="certified" 
        value="Yes" 
        checked={value === "Yes"} 
        onChange={onChange} 
      />
      Yes
    </label>

    <label className="radio-options">
      <input 
        type="radio" 
        name="certified" 
        value="No" 
        checked={value === "No"} 
        onChange={onChange} 
      />
      No
    </label>
  </div>
);
