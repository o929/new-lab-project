import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { ChevronUp, ChevronDown } from "lucide-react";
import "./App.css";
import { db } from "./fireBaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";


const dropdownOptions = {
  urineColour: ["clear", "yellow", "amber", "red"],
  urineReaction: ["acidic", "neutral", "alkaline"],
  urineSugar: ["negative", "trace", "+", "++", "++++"],
  urineAlbumin: ["negative", "trace", "+", "++", "++++"],
  stoolColour: ["brown", "green", "black", "red"],
  stoolConsistency: ["formed", "semi-formed", "watery"],
  abo: ["A", "B", "AB", "O"],
  rh: ["+", "-"],
  urinePusCells: ["0-2/HPF", "3-5/HPF", "6-10/HPF", ">10/HPF"],
  urineRBCs: ["0-2/HPF", "3-5/HPF", "6-10/HPF", ">10/HPF"],
  stoolPusCells: ["0-2/HPF", "3-5/HPF", "6-10/HPF", ">10/HPF"],
  stoolRBCs: ["0-2/HPF", "3-5/HPF", "6-10/HPF", ">10/HPF"]
};

const checkboxFields = [
  "urineCrystals", "urineOva", "urineTrichomonas", "urineYeast",
  "stoolCystOva", "stoolFlagellates", "stoolTrophozoite", "stoolUndigestedFood"
];

const fields = [
  "patientName", "date", "sign", "bfMalaria", "ictMalaria", "hb", "twbc", "esr", "rf",
  "aso", "rbs", "fbs", "hpp", "hcg", "abo", "rh", "hiv", "hbv", "hcv", "urea",
  "creatinine", "urineColour", "urineReaction", "urineSugar", "urineAlbumin",
  "urinePusCells", "urineRBCs", "urineEPCs", "urineCasts", "urineCrystals",
  "urineOva", "urineTrichomonas", "urineYeast", "urineOthers", "stoolColour",
  "stoolConsistency", "stoolMucous", "stoolBlood", "stoolWorms",
  "stoolPusCells", "stoolRBCs", "stoolCystOva", "stoolFlagellates",
  "stoolTrophozoite", "stoolUndigestedFood", "stoolOthers"
];

const urineGeneralFields = ["urineColour", "urineReaction", "urineSugar", "urineAlbumin"];
const stoolGeneralFields = ["stoolColour", "stoolConsistency", "stoolMucous", "stoolBlood", "stoolWorms"];

const defaultReportData = () => {
  const data = {};
  fields.forEach((field) => {
    data[field] = checkboxFields.includes(field) ? false : "";
  });
  return data;
};

const LabReportSystem = () => {
  const [reports, setReports] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [messageBox, setMessageBox] = useState(null);
  const [messageColor, setMessageColor] = useState("#007bff");
  const [searchQuery, setSearchQuery] = useState("");
  const reportRefs = useRef({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    emailjs.init("7o9FV7q7E2a0Cd7lf");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("activeReports");
    if (saved) setReports(JSON.parse(saved));
  }, []);

  const handleAddReport = () => {
    const newReport = {
      id: Date.now(),
      data: defaultReportData(),
      edit: true,
      wrapped: false
    };
    const updated = [...reports, newReport];
    setReports(updated);
    localStorage.setItem("activeReports", JSON.stringify(updated));
  };

  const handleInputChange = (id, name, value) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, data: { ...r.data, [name]: value } } : r))
    );
  };

  const handleSave = (id) => {
    setReports((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, edit: false } : r));
      localStorage.setItem("activeReports", JSON.stringify(updated));
      return updated;
    });
  };

  const handleEdit = (id) => {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, edit: true } : r)));
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setReports((prev) => {
      const updated = prev.filter((r) => r.id !== deleteId);
      localStorage.setItem("activeReports", JSON.stringify(updated));
      return updated;
    });
    setShowConfirm(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };
  //laoding state for sending report

///Firebase function to send report

const sendReport = async (report) => {
  setLoading(true);
  try {
    await addDoc(collection(db, "labReports"), {
      ...report.data,
      sentAt: Timestamp.now()
    });

    setMessageBox("Report sent successfully to the doctor!");
    setMessageColor("#28a745");
  } catch (error) {
    console.error("Error sending report:", error);
    setMessageBox("Failed to send report. Try again.");
    setMessageColor("#dc3545");
  } finally {
    setLoading(false);
    setTimeout(() => setMessageBox(null), 3000);
  }
};



const toggleWrap = (id) => {
  setReports((prev) => {
    const updated = prev.map((r) =>
      r.id === id ? { ...r, wrapped: !r.wrapped } : r
    );
    localStorage.setItem("activeReports", JSON.stringify(updated));
    return updated;
  });
};


  const formatLabel = (field) =>
    field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  const renderInputField = (report, field) => (
    <div key={field} className="section">
      <label htmlFor={`${field}-${report.id}`}>{formatLabel(field)}:</label>
      <input
        id={`${field}-${report.id}`}
        type="text"
        value={report.data[field]}
        disabled={!report.edit}
        onChange={(e) => handleInputChange(report.id, field, e.target.value)}
      />
    </div>
  );


  const renderOtherFields = (report) =>
    fields.filter(
      (f) =>
        !urineGeneralFields.includes(f) &&
        !stoolGeneralFields.includes(f) &&
        f !== "patientName"
    ).map((field) => renderInputField(report, field));

  const filteredReports = reports.filter((report) =>
    report.data.patientName.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  const [allWrapped, setAllWrapped] = useState(false);

const toggleWrapAll = () => {
  setReports((prev) => {
    const updated = prev.map((r) => ({ ...r, wrapped: true }));
    localStorage.setItem("activeReports", JSON.stringify(updated));
    return updated;
  });
  setAllWrapped(true); // optional for consistency
};



  return (
    <div className="lab-report-system" style={{ padding: "20px" }}>
      <h2>Hospital Lab Report System</h2>

      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 15, padding: 10, width: "100%", maxWidth: 400 }}
      />
      {messageBox && (
        <div id="messageBox" style={{ backgroundColor: messageColor, color: "white", padding: 10, borderRadius: 6 }}>{messageBox}</div>
      )}
{loading && (
  <div id="loadingMessageBox" style={{backgroundColor: "white", position: "fixed",top: "50%" ,left: "50%" ,padding: 10, zIndex: 1000000, color: "#007bff" }}>
    Sending report... ⏳
  </div>
)}
{/* <button id="wrapall" onClick={toggleWrapAll} aria-label={allWrapped ? "Unwrap All Reports" : "Wrap All Reports"}>
  {allWrapped ? <ChevronDown size={24} />  : <ChevronUp size={24} />}
</button> */}

{messageBox && !loading && (
  <div style={{ backgroundColor: messageColor, color: "white", padding: 10, borderRadius: 6 }}>
    {messageBox}
  </div>
)}

      {filteredReports.map((report, idx) => (
        <div
          key={report.id}
          className="lab-form"
          ref={(el) => (reportRefs.current[report.id] = el)}
          style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20, borderRadius: 8 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
              <h3 style={{ margin: 0 }}>Lab Report #{idx + 1}</h3>
              <div>
                <label htmlFor={`patientName-${report.id}`} style={{ fontWeight: 600 }}>Patient:</label>
                <input
                  id={`patientName-${report.id}`}
                  type="text"
                  value={report.data.patientName}
                  disabled={!report.edit}
                  onChange={(e) => handleInputChange(report.id, "patientName", e.target.value)}
                  style={{ padding: "4px 8px", fontSize: 14 }}
                />
              </div>
              
            </div>
            <button onClick={() => toggleWrap(report.id)}>
              {report.wrapped ? <ChevronDown /> : <ChevronUp />}
            </button>
            
{filteredReports.length > 0 && filteredReports.every(r => !r.wrapped) && (
  <div className="tooltip-container">
    <button id="wrapall" onClick={toggleWrapAll} aria-label="Wrap All Reports">
      <ChevronUp size={24} />
    </button>
    <span className="tooltip-text">Wrap All</span>
  </div>
)}



          </div>

          {!report.wrapped && (
            <div style={{ marginTop: 10 }}>
              <div className="other-fields-grid">{renderOtherFields(report)}</div>
              <div className="general-sections-container">
                <div className="box">
                  <h4>Urine General</h4>
                  {urineGeneralFields.map((field) => renderInputField(report, field))}
                </div>
                <div className="box">
                  <h4>Stool General</h4>
                  {stoolGeneralFields.map((field) => renderInputField(report, field))}
                </div>
              </div>
              <div style={{ textAlign: "right", marginTop: 15 }}>
                {report.edit ? (
                  <button className="edit" onClick={() => handleSave(report.id)}>Save</button>
                ) : (
                  <button className="edit" onClick={() => handleEdit(report.id)}>Edit</button>
                )}
                <button className="delete" onClick={() => handleDelete(report.id)}>Delete</button>
                <button className="send" onClick={() => sendReport(report)}>Send to the doctor</button>
              </div>
            </div>
          )}
        </div>
      ))}

      {showConfirm && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: 30, borderRadius: 10, boxShadow: "0 0 15px rgba(0,0,0,0.3)" }}>
          <p>Are you sure you want to delete this report?</p>
          <button id="confirmYesBtn" onClick={confirmDelete} style={{ backgroundColor: "#dc3545", color: "white", padding: 10, marginRight: 10 }}>Yes</button>
          <button id="confirmNoBtn" onClick={cancelDelete} style={{ backgroundColor: "#6c757d", color: "white", padding: 10 }}>No</button>
        </div>
      )}
      <button id="addReportBtn" onClick={handleAddReport}>Add New Lab Report</button>

    </div>
  );
};

export default LabReportSystem;
