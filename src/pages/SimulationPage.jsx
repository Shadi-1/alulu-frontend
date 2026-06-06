import { useState } from "react";
import { getApiBase } from "../config/api";
import "../App.css";

export default function SimulationPage() {
  const [electricity, setElectricity] = useState(10);
  const [transport, setTransport] = useState(20);
  const [waste, setWaste] = useState(15);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runSimulation = async () => {
    try {
      setError("");
      const apiBase = getApiBase();

      const response = await fetch(`${apiBase}/simulate-reduction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electricity_reduction_percent: Number(electricity),
          transport_reduction_percent: Number(transport),
          waste_reduction_percent: Number(waste),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">SCENARIO SIMULATION</p>
          <h1>Carbon Reduction Simulator</h1>
          <p className="subtitle">
            Test reduction scenarios using percentage-based inputs and compare totals in kg CO₂e.
          </p>
        </div>
      </header>

      {error && <div className="error-box">Error: {error}</div>}

      <section className="content-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="panel glass">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Inputs</p>
              <h3>Scenario Settings (%)</h3>
            </div>
          </div>

          <div style={{ display: "grid", gap: "18px" }}>
            <div>
              <label>Electricity reduction (%)</label>
              <input
                type="number"
                value={electricity}
                onChange={(e) => setElectricity(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Transport reduction (%)</label>
              <input
                type="number"
                value={transport}
                onChange={(e) => setTransport(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Waste reduction (%)</label>
              <input
                type="number"
                value={waste}
                onChange={(e) => setWaste(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div className="insight-box">
              <p className="insight-title">Input Unit</p>
              <p className="insight-text">
                All scenario inputs are entered as percentage reductions (%).
              </p>
            </div>

            <button onClick={runSimulation} style={buttonStyle}>
              Run Simulation
            </button>
          </div>
        </div>

        <div className="panel glass">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Results</p>
              <h3>Simulation Output</h3>
            </div>
          </div>

          {!result ? (
            <div className="loading-card">
              Run a simulation to see the results in kg CO₂e and %.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              <div className="stat-card">
                <p className="stat-label">Original Total</p>
                <h2>{Number(result.original_total).toFixed(1)}</h2>
                <span className="stat-foot">kg CO₂e</span>
              </div>

              <div className="stat-card">
                <p className="stat-label">Simulated Total</p>
                <h2>{Number(result.simulated_total).toFixed(1)}</h2>
                <span className="stat-foot">kg CO₂e</span>
              </div>

              <div className="stat-card">
                <p className="stat-label">Reduction Amount</p>
                <h2>{Number(result.reduction_amount).toFixed(1)}</h2>
                <span className="stat-foot">kg CO₂e</span>
              </div>

              <div className="stat-card accent-card">
                <p className="stat-label">Reduction Percent</p>
                <h2>{Number(result.reduction_percent).toFixed(2)}%</h2>
                <span className="stat-foot">%</span>
              </div>
            </div>
          )}
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