import React, { useState } from 'react';

const Admin = () => {
  const [selectedAction, setSelectedAction] = useState('');

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
  };

  return (
    <div>

<div style={{ position: "fixed", top: "20px", left: "20px" }}>
      <button
        onClick={() => navigate("/home")}
        style={{
          backgroundColor: "transparent",
          border: "none",
          color: "#1976d2",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Home
      </button>
    </div>

      <h2>Admin Panel</h2>
      
      <label>Select an action:</label>
      <select value={selectedAction} onChange={handleActionChange}>
        <option value="">Select Action</option>
        <option value="add">Add User</option>
        <option value="update">Update User</option>
        <option value="delete">Delete User</option>
        <option value="veiw">Veiw User</option>
      </select>

      {selectedAction && (
        <div>
          <p>You selected: {selectedAction}</p>
          {/* You can link to the corresponding pages or display relevant components here */}
        </div>
      )}
    </div>
  );
};

export default Admin;
