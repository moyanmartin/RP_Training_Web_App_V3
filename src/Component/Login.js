import React from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import axios from 'axios';
import { hostName } from "./HostNames";
import { useNavigate } from 'react-router-dom';

// Your MSAL config (replace with your actual config)
const msalConfig = {
  auth: {
    clientId: '6b961cb1-9a9a-4811-bbc1-ff58a3edbcc6', //my client ID
    authority: 'https://login.microsoftonline.com/ce78cd8a-3dfa-4db0-8938-176375f33e92', //AD tentant ID
    redirectUri: window.location.origin,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

const Login = () => {
  const navigate = useNavigate();  // initialize navigate hook

  const handleLogin = async () => {
  try {
    // Initialize MSAL first
    await msalInstance.initialize();

    // Proceed with login
    const loginResponse = await msalInstance.loginPopup({
      scopes: ['api://6b961cb1-9a9a-4811-bbc1-ff58a3edbcc6/access_as_user'],
    });

    const accessToken = loginResponse.accessToken;
    const email = loginResponse.account.username;

    console.log("Username is:", email);

    localStorage.setItem('email', email);

    const staffResponse = await axios.get(`https://${hostName}/api/Staff/${email}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const userData = staffResponse.data;

    const fullName = `${userData.first_Name} ${userData.last_Name}`;
    localStorage.setItem('typeOfUser', userData.type_Of_User);
    localStorage.setItem('firstName', userData.first_Name);
    localStorage.setItem('lastName', userData.last_Name);
    localStorage.setItem('fullName', fullName);

    console.log("Username is:", email, "Full name:", fullName, "Type of user:", userData.type_Of_User);


    navigate('/home');

  } catch (error) {
    if (error.response && error.response.status === 404) {
      navigate('/access-denied');
    } else {
      console.error('Login or fetch user failed:', error);
      alert('Invalid login or failed to fetch user details.');
    }
  }
};

  return (
    <div>
      <button 
      style={{
              padding: '10px 20px',
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
      onClick={handleLogin}>Login with Azure Active Directory</button>
    </div>
  );
};

export default Login;
