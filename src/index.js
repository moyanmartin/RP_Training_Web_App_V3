import React from "react";
import ReactDOM from "react-dom/client"; // Import from react-dom/client for React 18
import { BrowserRouter } from "react-router-dom";
import App from "./App"; // Import your App component

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
