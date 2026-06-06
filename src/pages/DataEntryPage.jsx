import { useState } from "react";
import { getApiBase } from "../config/api";
import "../App.css";

export default function DataEntryPage() {
  const [siteName, setSiteName] = useState("Hegra");
  const [date, setDate] = useState("");
  const [electricity, setElectricity] = useState("");
  const [transport, setTransport] = useState("");
  const [waste, setWaste] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}/add-record`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          site_name: siteName,
          date: date,
          electricity_kwh: Number(electricity),
          transport_km: Number(transport),
          waste_kg: Number(waste)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || "Record added successfully");
        setElectricity("");
        setTransport("");
        setWaste("");
      } else {
        setError("Failed to add record");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">DATA ENTRY</p>
          <h1>Daily Emissions Input</h1>
          <p className="subtitle">
            Add a new daily activity record to update the platform data.
          </p>
        </div>
      </header>

      {message && <div className="loading-card">{message}</div>}
      {error && <div className="error-box">Error: {error}</div>}

      <section className="content-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel glass">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Form</p>
              <h3>Enter Daily Record</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "18px" }}>
            <div>
              <label>Site Name</label>
              <select
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                style={inputStyle}
              >
                <option value="Hegra">Hegra</option>
                <option value="Dadan">Dadan</option>
                <option value="OldTown">OldTown</option>
              </select>
            </div>

            <div>
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label>Electricity Consumption (kWh)</label>
              <input
                type="number"
                value={electricity}
                onChange={(e) => setElectricity(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label>Transport Activity (km)</label>
              <input
                type="number"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label>Waste Generated (kg)</label>
              <input
                type="number"
                value={waste}
                onChange={(e) => setWaste(e.target.value)}
                style={inputStyle}
                required
              />
            </div>

            <button type="submit" style={buttonStyle}>
              Save Record
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: "8px",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "rgba(255,255,255,0.04)",
  color: "#fff",
  outline: "none",
};

const buttonStyle = {
  marginTop: "8px",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "none",
  background: "#7C3AED",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "600",
};