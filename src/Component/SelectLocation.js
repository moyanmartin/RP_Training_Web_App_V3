// SelectLocation.js

import React from "react";
import { useNavigate } from "react-router-dom";
import CommunityMap from "./CommunityMap";

const SelectLocation = () => {
  const navigate = useNavigate();

  const handleFeatureSelect = ({ COMM_NAME, PARISH, POST_CODES }) => {
    navigate(
      `/post-participant?community=${encodeURIComponent(COMM_NAME)}&parish=${encodeURIComponent(PARISH)}&postcode=${encodeURIComponent(POST_CODES)}`
    );
  };

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      {/* Top Bar with Back Button */}
      <div style={{ background: "#f0f0f0", padding: "10px" }}>
        <button onClick={() => navigate("/post-participant")}>⬅ Back to Form</button>
      </div>

      {/* Fullscreen Map Container */}
      <div style={{ flex: 1, position: "relative" }}>
        <CommunityMap onFeatureSelect={handleFeatureSelect} />
      </div>
    </div>
  );
};

export default SelectLocation;
