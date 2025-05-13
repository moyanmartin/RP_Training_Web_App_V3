import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import mojLogo from "../images/moj_logo.png"; // ensure path is correct
import RJLogo from "../images/RJ_logo.jpg";  // ensure path is correct

const Home = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 🔒 Redirect to login if not logged in
  useEffect(() => {
    const typeOfUser = localStorage.getItem("typeOfUser");
    if (!typeOfUser) {
      navigate('/'); // go back to login if not logged in
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user from localStorage
  useEffect(() => {
    const userData = {
      typeOfUser: localStorage.getItem("typeOfUser"),
      fullName: localStorage.getItem("fullName"),
      email: localStorage.getItem("email")
    };
    setUser(userData);
  }, []);
  
  return (
    <div className="home-container">
      {/* Left side with image */}
      <div className="home-image">
        <img src={mojLogo} alt="Welcome" />
      </div>

      <div className="home-RJ-image">
        <img src={RJLogo} alt="RJ Logo" />
      </div>

      {/* Right side with text and buttons */}
      <div className="home-content">
        <h1>Welcome to the Home Page</h1>
        <p>This is the landing page for the restorative practice participants.</p>

        <div>
          <Link to="/post">
            <button className="styled-button">Add a participant</button>
          </Link>
        </div>

        <div>
          <Link to="/search">
            <button className="styled-button">Search for participant</button>
          </Link>
        </div>

        <div>
          <Link to="/searchTraining">
            <button className="styled-button">Search for training</button>
          </Link>
        </div>

        <div>
          <Link to="/individalRequests">
            <button className="styled-button">View my requests</button>
          </Link>
        </div>

    
        {/* Admin dropdown button - only for Super users */}
        {user?.typeOfUser === "Super" && (
          <>
            <div>
              <Link to="/pendingRequests">
                <button className="styled-button">View Pending Requests</button>
              </Link>
            </div>

            <div className="admin-dropdown" ref={dropdownRef}>
              <button className="styled-button" onClick={toggleDropdown}>
                Admin Panel ▾
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  <ul>
                    <li>
                      <Link to="/addUser">
                        <button>Add user</button>
                      </Link>
                    </li>

                    <li>
                      <Link to="/deleteUser">
                        <button>Delete user</button>
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        )}

      
      </div>
    </div>
  );
};

export default Home;


