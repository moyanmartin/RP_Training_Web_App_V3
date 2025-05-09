import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Component/Home";
import PostParticipant from "./Component/PostParticipant";
import Search from "./Component/Search";
import EditParticipant from "./Component/EditParticipant";

import AddUser from "./Component/AddUser";

import DeleteRequest from "./Component/DeleteRequest";
import ViewIndividualRequests from "./Component/ViewIndividualRequests";
import PendingRequests from "./Component/PendingRequests";
import DeleteParticipantRequested from "./Component/DeleteParticipantRequested";
import DenyDeleteRequest from "./Component/DenyDeleteRequest";

import DeleteUser from "./Component/DeleteUser";

import CommunityMapPage from "./Component/CommunityMap";




function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} /> {/* 👈 Add this line for root path */}

      <Route path="/home" element={<Home />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/deleteUser" element={<DeleteUser />} />
      <Route path="/post" element={<PostParticipant />} />
      <Route path="/community-map" element={<CommunityMapPage />} />
      <Route path="/search" element={<Search />} />
      <Route path="/deleteRequest/:id" element={<DeleteRequest />} />
      <Route path="/individalRequests" element={<ViewIndividualRequests />} />
      <Route path="/pendingRequests" element={<PendingRequests />} />
      <Route path="/edit/:id" element={<EditParticipant />} />
      <Route path="/delete-request/:id/:logNumber" element={<DeleteParticipantRequested />} />
      <Route path="/deny-request/:logNumber" element={<DenyDeleteRequest />} />
    </Routes>
  );
}

export default App;
