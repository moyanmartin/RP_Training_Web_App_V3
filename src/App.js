import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Component/Home";
import PostParticipant from "./Component/PostParticipant";
import Search from "./Component/Search";
import CertifyParticipant from "./Component/CertifyParticipant";
import SearchTraining from "./Component/SearchTraining";
import CertifyCohort from "./Component/CertifyCohort";
import EditParticipant from "./Component/EditParticipant";
import AddUser from "./Component/AddUser";
import DeleteRequest from "./Component/DeleteRequest";
import ViewIndividualRequests from "./Component/ViewIndividualRequests";
import PendingRequests from "./Component/PendingRequests";
import DeleteParticipantRequested from "./Component/DeleteParticipantRequested";
import DenyDeleteRequest from "./Component/DenyDeleteRequest";
import DeleteUser from "./Component/DeleteUser";
import CommunityMapPage from "./Component/CommunityMap";
import Dashboard from "./Component/Dashboard";
import Login from "./Component/Login";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* Root path */}
      <Route path="/home" element={<Home />} />
      <Route path="/dashBoard" element={<Dashboard />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/deleteUser" element={<DeleteUser />} />
      <Route path="/post" element={<PostParticipant />} />
      <Route path="/community-map" element={<CommunityMapPage />} />
      <Route path="/search" element={<Search />} />
      <Route path="/certifyParticipant/:participant_ID" element={<CertifyParticipant />} />
      <Route path="/searchTraining" element={<SearchTraining />} />
      <Route path="/certifyCohort/:training_Number" element={<CertifyCohort />} />
      <Route path="/deleteRequest/:id" element={<DeleteRequest />} />
      <Route path="/individualRequests" element={<ViewIndividualRequests />} /> {/* Fixed typo */}
      <Route path="/pendingRequests" element={<PendingRequests />} />
      <Route path="/edit/:id" element={<EditParticipant />} />
      <Route path="/delete-request/:id/:logNumber" element={<DeleteParticipantRequested />} />
      <Route path="/deny-request/:logNumber" element={<DenyDeleteRequest />} />
    </Routes>
  );
}

export default App;
