import LabReportSystem from "./labReportSystem.jsx";
import DoctorReports from "./DoctorReports";


import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <nav style={{ padding: 10, backgroundColor: "#007bff" }}>
        <Link to="/lab" style={{ color: "white", marginRight: 20, textDecoration: "none", fontWeight: "bold" }}>
          Lab Reports
        </Link>
        <Link to="/doctor" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>
          Doctor View
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<Navigate to="/lab" />} />
        <Route path="/lab" element={<LabReportSystem />} />
        <Route path="/doctor" element={<DoctorReports />} />
        <Route path="*" element={<Navigate to="/lab" />} />
      </Routes>
    </Router>
  );
}

export default App;
