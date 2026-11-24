import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import PwaStatus from "~/components/Global/PwaStatus/PwaStatus";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <PwaStatus />
  </React.StrictMode>
);
