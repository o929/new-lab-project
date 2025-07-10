import React, { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { ChevronUp, ChevronDown } from "lucide-react";
import "./App.css";

const fields = [
  "patientName",
  "date",
  "bfMalaria",
  "ictMalaria",
  "hb",
  "twbc",
  "esr",
  "rf",
  "aso",
  "rbs",
  "fbs",
  "hpp",
  "urineColour",
  "urineColourSelect",
  "urineReaction",
  "urineSugar",
  "urineAlbumin",
  "stoolColour",
  "stoolColourSelect",
  "stoolConsistency",
  "stoolMucous",
  "stoolBlood",
  "stoolWorms",
  "sign",
];

const defaultReportData = () => {
  const data = {};
  fields.forEach((field) => {
    data[field] = "";
  });
  data["bfMalaria"] = "";
  data["urineColourSelect"] = "clear";
  data["stoolColourSelect"] = "brown";
  return data;
};

const LabReportSystem = () => {
  const [reports, setReports] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [messageBox, setMessageBox] = useState(null);
  const [messageColor, setMessageColor] = useState("#007bff");

  // New state for search query
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    emailjs.init("7o9FV7q7E2a0Cd7lf");
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("activeReports");
    if (saved) {
      setReports(JSON.parse(saved));
    }
  }, []);

  const handleAddReport = () => {
    const newReport = {
      id: Date.now(),
      data: defaultReportData(),
      edit: true,
      wrapped: false,
    };
    const updated = [...reports, newReport];
    setReports(updated);
    localStorage.setItem("activeReports", JSON.stringify(updated));
  };

  const handleInputChange = (id, name, value) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, data: { ...r.data, [name]: value } } : r
      )
    );
  };

  const handleSave = (id) => {
    setReports((prev) => {
      const updated = prev.map((r) =>
        r.id === id ? { ...r, edit: false } : r
      );
      localStorage.setItem("activeReports", JSON.stringify(updated));
      return updated;
    });
  };

  const handleEdit = (id) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, edit: true } : r))
    );
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

  const sendReport = (report) => {
    const templateParams = { ...report.data };

    emailjs
      .send("service_wscmthg", "template_gtqluvi", templateParams)
      .then(() => {
        setMessageBox("Message sent successfully to the doctor!");
        setMessageColor("#28a745");
        setTimeout(() => setMessageBox(null), 5000);
      })
      .catch((error) => {
        console.error("FAILED...", error);
        setMessageBox("Failed to send message. Please try again.");
        setMessageColor("#dc3545");
        setTimeout(() => setMessageBox(null), 5000);
      });
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
    field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());

  // Filter reports based on search query (case-insensitive)
  const filteredReports = reports.filter((report) =>
    report.data.patientName
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="lab-report-system" style={{ padding: "20px" }}>
      <h2>Hospital Lab Report System</h2>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by patient name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          padding: "8px 12px",
          width: "100%",
          maxWidth: "400px",
          marginBottom: "15px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "1rem",
        }}
      />

      <button onClick={handleAddReport} style={{ marginBottom: "15px" }}>
        Add New Lab Report
      </button>

      {messageBox && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 15px",
            backgroundColor: messageColor,
            color: "white",
            borderRadius: "5px",
            textAlign: "center",
          }}
        >
          {messageBox}
        </div>
      )}

      <div
        id="labReportsContainer"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          alignItems: "flex-start",
        }}
      >
        {filteredReports.length === 0 ? (
          <p>No lab reports found.</p>
        ) : (
          filteredReports.map((report, idx) => (
            <div
              key={report.id}
              className="lab-form"
              data-id={report.id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                flex: "1 1 320px",
                maxWidth: "100%",
                boxSizing: "border-box",
                position: "relative",
                height: report.wrapped ? "60px" : "auto",
                overflow: "hidden",
                transition: "height 0.35s ease",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "2px solid #007bff",
                  paddingBottom: "5px",
                  position: "sticky",
                  top: 0,
                  backgroundColor: "#f9f9f9",
                  zIndex: 2,
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                  Lab Report #{idx + 1}
                </h3>
                <button
                  onClick={() => toggleWrap(report.id)}
                  style={{
                    background: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    padding: "5px 8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "3px",
                    transition: "background-color 0.3s ease",
                  }}
                  aria-label={report.wrapped ? "Expand report" : "Collapse report"}
                >
                  {report.wrapped ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
              </div>

              <div
                style={{
                  marginTop: "10px",
                  flexGrow: 1,
                  overflowY: report.wrapped ? "hidden" : "auto",
                }}
              >
                {!report.wrapped &&
                  fields.map((field) => (
                    <div key={field} style={{ marginBottom: "10px" }}>
                      <label style={{ display: "block" }}>{formatLabel(field)}:</label>
                      <input
                        type="text"
                        value={report.data[field]}
                        disabled={!report.edit}
                        onChange={(e) =>
                          handleInputChange(report.id, field, e.target.value)
                        }
                        style={{ width: "100%" }}
                      />
                    </div>
                  ))}
              </div>

              {!report.wrapped && (
                <div style={{ textAlign: "right", marginTop: "auto" }}>
                  {report.edit ? (
                    <button className="edit" onClick={() => handleSave(report.id)}>
                      Save
                    </button>
                  ) : (
                    <button className="edit" onClick={() => handleEdit(report.id)}>
                      Edit
                    </button>
                  )}
                  <button
                    className="delete"
                    style={{ marginLeft: "15px" }}
                    onClick={() => handleDelete(report.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="send"
                    style={{ marginLeft: "15px" }}
                    onClick={() => sendReport(report)}
                  >
                    Send to the doctor
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showConfirm && (
        <div
          id="confirmBox"
          style={{
            display: "block",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "white",
            padding: "25px 30px",
            boxShadow: "0 0 15px rgba(0,0,0,0.25)",
            zIndex: 999,
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <p>Are you sure you want to delete this report?</p>
          <button
            id="confirmYesBtn"
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: "700",
              cursor: "pointer",
              margin: "0 10px",
              fontSize: "15px",
              border: "none",
            }}
            onClick={confirmDelete}
          >
            Yes
          </button>
          <button
            id="confirmNoBtn"
            style={{
              backgroundColor: "#6c757d",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              fontWeight: "700",
              cursor: "pointer",
              margin: "0 10px",
              fontSize: "15px",
              border: "none",
            }}
            onClick={cancelDelete}
          >
            No
          </button>
        </div>
      )}
    </div>
  );
};

export default LabReportSystem;
