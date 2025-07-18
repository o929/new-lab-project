import LabReportSystem from "./labReportSystem.jsx";
import ChemecReports from "./ChemecReports.jsx";


import React from "react";

import { HashRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

function App() {
  return (
    <Router>
     <nav id="nav" >
        <Link to="/lab" style={{ marginRight: "2rem", color: "white" ,fontSize:"18px"}}>Send Lab Reports</Link>
        <Link to="/chemec" style={{color: "white" ,fontSize: "18px"}}>Send Chemec Reports</Link>
      </nav>
      
      <Routes>
        {/* <Route path="/" element={<Navigate to="/lab" />} /> */}
        <Route path="/lab" element={<LabReportSystem />} />
        <Route path="/chemec" element={<ChemecReports />} />
        
        <Route path="*" element={<Navigate to="/lab" />} />
      </Routes>
    </Router>
  );
}

export default App;
