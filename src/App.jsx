import LabReportSystem from "./labReportSystem.jsx";



import React from "react";

import { HashRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";

function App() {
  return (
    <Router>


      <Routes>
        {/* <Route path="/" element={<Navigate to="/lab" />} /> */}
        <Route path="/lab" element={<LabReportSystem />} />
        
        <Route path="*" element={<Navigate to="/lab" />} />
      </Routes>
    </Router>
  );
}

export default App;
