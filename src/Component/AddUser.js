import React, { Component } from "react";
import axios from "axios";
import "./AddUser.css";
import { RJCentreLocationDropdown, TypeOfUserDropdown, StaffPositionDropdown } from "./Dropdowns";  // Import StaffPositionDropdown
import { hostName } from './HostNames';


export class AddUser extends Component {



  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      centreLocation: "",
      position: "",
      typeOfUser: "",
      password: ""
    };
  }

  componentDidMount() {
    console.log("AddUser component mounted!");
  }

  submitHandler = async (event) => {
    event.preventDefault();

    try {
      const checkResponse = await axios.get(`http://${hostName}/api/Staff/StaffExists`, {
        params: { Email: this.state.email }
      });

      if (checkResponse.data.exists) {
        alert("User already exists.");
        return;
      }
    } catch (error) {
      console.error("Error checking request existence:", error);
      alert("Error checking if a user already exists.");
      return;
    }

    const formData = {
      First_Name: this.state.firstName,
      Last_Name: this.state.lastName,
      Position: this.state.position,
      Telephone: this.state.telephone,
      Email: this.state.email,
      RJ_Location: this.state.centreLocation,
      Type_Of_User: this.state.typeOfUser,
      Pass_Word: this.state.password
    };

    console.log("Submitting Data:", JSON.stringify(formData, null, 2));

    try {
      const response = await axios.post(`http://${hostName}/api/Staff/add-staff`, formData, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Server Response:", response.data);
      alert("User successfully added!");
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      alert("Error submitting user. Please try again.");
    }
  };

  handleSelectChange = (event) => {
    this.setState({ position: event.target.value });
  };

  render() {
    return (
      <div>

        <form onSubmit={this.submitHandler}>
          <label>First Name:</label>
          <input
            type="text"
            name="First_Name"
            value={this.state.firstName}
            onChange={(e) => this.setState({ firstName: e.target.value })}
          />

          <label>Last Name:</label>
          <input
            type="text"
            name="Last_Name"
            value={this.state.lastName}
            onChange={(e) => this.setState({ lastName: e.target.value })}
          />

          <RJCentreLocationDropdown
            value={this.state.centreLocation}
            onChange={(e) => this.setState({ centreLocation: e.target.value })}
          />

          {/* Staff Position Dropdown Component */}
          <StaffPositionDropdown
            value={this.state.position}
            onChange={(e) => this.setState({ position: e.target.value })}
          />

          <TypeOfUserDropdown
            value={this.state.typeOfUser}
            onChange={(e) => this.setState({ typeOfUser: e.target.value })}
          />

          <label>Participant's Telephone:</label>
          <input
            type="text"
            name="Participant_Telephone"
            value={this.state.telephone}
            onChange={(e) => this.setState({ telephone: e.target.value })}
          />

          <label>Email:</label>
          <input
            type="text"
            name="Email"
            value={this.state.email}
            onChange={(e) => this.setState({ email: e.target.value })}
          />

          <label>Password:</label>
          <input
            type="text"
            name="Pass_Word"
            value={this.state.password}
            onChange={(e) => this.setState({ password: e.target.value })}
          />

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default AddUser;
