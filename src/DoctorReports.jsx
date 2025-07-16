import { db } from "./fireBaseConfig";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { deleteDoc, doc } from "firebase/firestore";


const urineGeneralFields = ["urineColour", "urineReaction", "urineSugar", "urineAlbumin"];
const stoolGeneralFields = ["stoolColour", "stoolConsistency", "stoolMucous", "stoolBlood", "stoolWorms"];

// Full ordered list of fields for display (adjust to your needs)
const orderedFields = [
  "patientName", "date", "sign", "bfMalaria", "ictMalaria", "hb", "twbc", "esr", "rf",
  "aso", "rbs", "fbs", "hpp", "hcg", "abo", "rh", "hiv", "hbv", "hcv", "urea",
  "creatinine", "urineColour", "urineReaction", "urineSugar", "urineAlbumin",
  "urinePusCells", "urineRBCs", "urineEPCs", "urineCasts", "urineCrystals",
  "urineOva", "urineTrichomonas", "urineYeast", "urineOthers", "stoolColour",
  "stoolConsistency", "stoolMucous", "stoolBlood", "stoolWorms",
  "stoolPusCells", "stoolRBCs", "stoolCystOva", "stoolFlagellates",
  "stoolTrophozoite", "stoolUndigestedFood", "stoolOthers", "sentAt"
];



const DoctorReports = () => {
  const [reports, setReports] = useState([]);
/// handle delete functionality
    const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this report?");
  if (!confirmDelete) return;

  try {
 await deleteDoc(doc(db, "labReports", id));

    setReports((prev) => prev.filter((report) => report.id !== id));
  } catch (error) {
    console.error("Error deleting report:", error);
    alert("Failed to delete the report.");
  }
};

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "labReports"));
        const reportList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReports(reportList);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };


    fetchReports();
  }, []);

  // Helper to format labels nicely
  const formatLabel = (field) =>
    field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  return (
    <div style={{ padding: "20px" }}>
      <h1>Doctor’s Reports</h1>
      {reports.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        reports.map((report) => (
          <div
            key={report.id}
            style={{
              border: "1px solid #ccc",
              padding: "15px",
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <button
  onClick={() => handleDelete(report.id)}
  style={{
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    marginTop: "10px",
  }}
>
  Delete Report
</button>
            <h3>{report.patientName}</h3>
            <p><strong>Date:</strong> {report.date}</p>


            {/* Other fields excluding urine and stool general */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {orderedFields.map((field) => {
                // skip fields handled separately or missing in data
                if (
                  ["patientName", "date", "sentAt"].includes(field) ||
                  urineGeneralFields.includes(field) ||
                  stoolGeneralFields.includes(field)
                )
                  return null;

                if (!(field in report)) return null;

                return (
                  <div key={field} className="section">
                    <strong>{formatLabel(field)}:</strong> {String(report[field])}
                  </div>
                );
              })}
            </div>

            {/* Urine General Box */}
            <div className="box urine-box">
              <h4>Urine General</h4>
     {urineGeneralFields.map((field) => (
  <div key={field} className="section">
    <strong>{formatLabel(field)}:</strong> {String(report[field]) || <em>empty</em>}
  </div>
))}

            </div>stoolGeneralFields

            {/* Stool General Box */}
            <div className="box stool-box">
              <h4>Stool General</h4>
      {stoolGeneralFields.map((field) => (
  <div key={field} className="section">
    <strong>{formatLabel(field)}:</strong> {String(report[field]) || <em>empty</em>}
  </div>
))}

            </div>

            {/* Sent at field */}
            {report.sentAt && (
              <p>
                <strong>Sent At:</strong> {report.sentAt.toDate ? report.sentAt.toDate().toLocaleString() : String(report.sentAt)}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DoctorReports;
