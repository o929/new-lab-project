import React, { useState } from "react";
import { db } from "./fireBaseConfig";
import { collection, addDoc } from "firebase/firestore";

function defaultChemecReportData() {
  return {
    patientName: "",
    age: "",
    testResult: "",
    date: new Date().toISOString().split("T")[0],
  };
}

const SavedChemecReports = () => {
  const [newReport, setNewReport] = useState(defaultChemecReportData());

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "chemecReports"), newReport);
      setNewReport(defaultChemecReportData()); // Reset form
    } catch (error) {
      console.error("Error adding Chemec report:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Chemec Reports</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          name="patientName"
          placeholder="Patient Name"
          value={newReport.patientName}
          onChange={handleChange}
           
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={newReport.age}
          onChange={handleChange}
           
        />
        <input
          type="text"
          name="testResult"
          placeholder="Test Result"
          value={newReport.testResult}
          onChange={handleChange}
           
        />
        <input
          type="date"
          name="date"
          value={newReport.date}
          onChange={handleChange}
        />
        <button type="submit">Add Report</button>
      </form>
    </div>
  );
};

export default SavedChemecReports;
