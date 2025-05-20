// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { hostName } from "./HostNames";

const Dashboard = () => {
  const [parishData, setParishData] = useState([]);
  const [certData, setCertData] = useState([]);

  useEffect(() => {
    fetchParishData();
    fetchCertData();
  }, []);

  const fetchParishData = async () => {
    try {
      const res = await axios.get(`http://${hostName}/api/Chart/participants-by-Institution_Parish`);
      setParishData(res.data);
    } catch (err) {
      console.error("Error fetching parish data", err);
    }
  };

  const fetchCertData = async () => {
    try {
      const res = await axios.get(`http://${hostName}/api/Chart/certification-status`);
      setCertData(res.data);
    } catch (err) {
      console.error("Error fetching certification data", err);
    }
  };

  const COLORS = ["#00C49F", "#FF8042"];

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>

      {/* Bar Chart - Participants by Parish */}
      <h3>Participants by Parish</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={parishData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Parish" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      {/* Pie Chart - Certification Status */}
      <h3>Certification Status</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={certData}
            dataKey="Count"
            nameKey="Status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {certData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
