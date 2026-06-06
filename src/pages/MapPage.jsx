import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Popup, CircleMarker } from "react-leaflet";
import { getApiBase } from "../config/api";
import "../App.css";

export default function MapPage() {
  const [locations, setLocations] = useState([]);
  const [error, setError] = useState("");
  
  // أضفنا حالة لحفظ عتبات الألوان الديناميكية بدل الأرقام الثابتة
  const [thresholds, setThresholds] = useState({ high: 220, med: 170 });

  const siteCoordinates = {
    "Hegra": [26.7943, 37.9567],
    "Dadan": [26.6080, 37.9210],
    "OldTown": [26.6167, 37.9333],
  };

  useEffect(() => {
    const apiBase = getApiBase();
    fetch(`${apiBase}/ranked-sites`)
      .then((res) => res.json())
      .then((data) => {
        let mapped = data
          .map((item) => {
            const siteName = item.site || item.site_name; 
            return {
              name: siteName,
              emissions: Number(item.emissions),
              position: siteCoordinates[siteName],
            };
          })
          .filter((item) => item.position);

        // السر هنا: ترتيب المواقع تنازلياً وتحديد الألوان حسب المراكز!
        mapped = mapped.sort((a, b) => b.emissions - a.emissions);
        
        if (mapped.length >= 2) {
          setThresholds({
            high: mapped[0].emissions, // المركز الأول دائماً أحمر
            med: mapped[1].emissions,  // المركز الثاني برتقالي
          });
        }

        setLocations(mapped);
      })
      .catch((err) => setError(err.message));
  }, []);

  const getColor = (emissions) => {
    if (emissions >= thresholds.high) return "#ef4444"; // أحمر
    if (emissions >= thresholds.med) return "#f59e0b"; // برتقالي
    return "#10b981"; // أخضر
  };

  const getRadius = (emissions) => {
    if (emissions >= thresholds.high) return 24; // تكبير دائرة المركز الأول
    if (emissions >= thresholds.med) return 18;
    return 14;
  };

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">GEOGRAPHIC ANALYSIS</p>
          <h1>Carbon Emissions Map</h1>
          <p className="subtitle">
            Geographic distribution of carbon emissions across key tourism locations in AlUla.
          </p>
        </div>
      </header>

      {error && <div className="error-box">Error: {error}</div>}

      <div className="panel glass" style={{ height: "520px" }}>
        <MapContainer
          center={[26.70, 37.93]}
          zoom={11}
          style={{ height: "100%", borderRadius: "16px" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {locations.map((location) => (
            <CircleMarker
              key={location.name}
              center={location.position}
              radius={getRadius(location.emissions)}
              pathOptions={{
                color: getColor(location.emissions),
                fillColor: getColor(location.emissions),
                fillOpacity: 0.85,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <strong style={{ fontSize: "16px", color: "#333" }}>{location.name}</strong>
                  <br />
                  <span style={{ color: "#666", marginTop: "4px", display: "inline-block" }}>
                    Emissions: <b>{location.emissions.toLocaleString(undefined, {maximumFractionDigits: 1})}</b> kg CO₂e
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      <section style={{ marginTop: "20px" }}>
        <div className="panel glass">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Legend</p>
              <h3>Emission Levels</h3>
            </div>
          </div>

          <div className="legend-list">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#ef4444" }} />
              <span>High emissions</span>
              {/* عرض الأرقام الحقيقية في المفتاح بشكل احترافي بدل الأرقام الثابتة القديمة */}
              <strong>{thresholds.high.toLocaleString(undefined, {maximumFractionDigits: 0})}+ kg CO₂e</strong>
            </div>

            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#f59e0b" }} />
              <span>Medium emissions</span>
              <strong>{thresholds.med.toLocaleString(undefined, {maximumFractionDigits: 0})}–{(thresholds.high - 1).toLocaleString(undefined, {maximumFractionDigits: 0})} kg CO₂e</strong>
            </div>

            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#10b981" }} />
              <span>Lower emissions</span>
              <strong>Below {thresholds.med.toLocaleString(undefined, {maximumFractionDigits: 0})} kg CO₂e</strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}