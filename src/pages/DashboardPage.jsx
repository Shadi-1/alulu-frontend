import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { getApiBase } from "../config/api";
import "../App.css";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [chart, setChart] = useState(null);
  const [siteData, setSiteData] = useState([]);
  const [error, setError] = useState("");
  const [rankedSites, setRankedSites] = useState([]);

  useEffect(() => {
    console.log("Fetching data from API...");

    // Centralized dev/prod base URL — see src/config/api.js
    const apiBase = getApiBase();

    console.log("API Base:", apiBase);
    
    Promise.all([
      fetch(`${apiBase}/emissions-summary`).then((res) => {
        if (!res.ok) throw new Error(`emissions-summary: ${res.status}`);
        return res.json();
      }),
      fetch(`${apiBase}/emissions-chart`).then((res) => {
        if (!res.ok) throw new Error(`emissions-chart: ${res.status}`);
        return res.json();
      }),
      fetch(`${apiBase}/emissions-by-site`).then((res) => {
        if (!res.ok) throw new Error(`emissions-by-site: ${res.status}`);
        return res.json();
      }),
      fetch(`${apiBase}/ranked-sites`).then((res) => {
        if (!res.ok) throw new Error(`ranked-sites: ${res.status}`);
        return res.json();
      })
    ])
      .then(([summaryData, chartData, siteChartData, rankedSitesData]) => {
        console.log("Data fetched successfully:", { summaryData, chartData, siteChartData, rankedSitesData });
        setSummary(summaryData);
        setChart(chartData);

        const formattedSites = Object.keys(siteChartData).map((site) => ({
          site,
          emissions: siteChartData[site],
        }));
        setSiteData(formattedSites);

        setRankedSites(rankedSitesData);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(`Failed to load data: ${err.message}`);
      });
  }, []);

  const pieData = useMemo(() => {
    if (!chart) return [];
    return [
      { name: "Electricity", value: chart.electricity },
      { name: "Transport", value: chart.transport },
      { name: "Waste", value: chart.waste },
    ];
  }, [chart]);

  const highestSource = useMemo(() => {
    if (!pieData.length) return "-";
    return [...pieData].sort((a, b) => b.value - a.value)[0].name;
  }, [pieData]);

  const highestSite = useMemo(() => {
    if (!siteData.length) return "-";
    return [...siteData].sort((a, b) => b.emissions - a.emissions)[0].site;
  }, [siteData]);

  // ألوان طبيعة العلا الجديدة
  const ALULA_COLORS = ['#b85b3f', '#dca771', '#8c3a21', '#a09488'];

  const formatKg = (value) => `${Number(value).toFixed(1)} kg CO₂e`;

  // المربع الزجاجي المخصص
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)', /* خلفية زجاجية فاتحة */
          padding: '12px 16px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          color: '#4a3f35', /* نص بني داكن ليكون واضحاً على الخلفية البيضاء للـ Tooltip */
          fontSize: '14px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>
            {label ? `${label} - ` : ''}{payload[0].name || "Emissions"}: {Number(payload[0].value).toFixed(1)} kg CO₂e
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-shell">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />

      <header className="topbar">
        <div>
          <p className="eyebrow">SUSTAINABILITY INTELLIGENCE</p>
          <h1>AlUla Carbon Command Center</h1>
          <p className="subtitle">
            Carbon emissions overview across electricity, transport, waste, and tourism sites.
          </p>
        </div>

        <div className="status-pill">
          <span className="status-dot" />
          Live data
        </div>
      </header>

      {error && (
        <div className="error-box" style={{
          backgroundColor: '#fee',
          color: '#c00',
          padding: '20px',
          margin: '20px',
          borderRadius: '8px',
          border: '2px solid #c00',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 1000,
          position: 'relative'
        }}>
          ⚠️ Error: {error}
        </div>
      )}

      {!summary || !chart ? (
        <div className="loading-card" style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#333',
          padding: '40px',
          margin: '40px 20px',
          borderRadius: '12px',
          fontSize: '18px',
          textAlign: 'center'
        }}>
          {error ? 'Failed to load dashboard. API returned an error.' : 'Loading dashboard...'}
        </div>
      ) : (
        <>
          <section className="stats-grid">
            <div className="stat-card">
              <p className="stat-label">Total Emissions</p>
              <h2>{Number(summary.total_emissions_all).toFixed(1)}</h2>
              <span className="stat-foot">kg CO₂e</span>
            </div>

            <div className="stat-card">
              <p className="stat-label">Average Emissions</p>
              <h2>{Number(summary.average_emissions).toFixed(1)}</h2>
              <span className="stat-foot">kg CO₂e per record</span>
            </div>

            <div className="stat-card">
              <p className="stat-label">Dominant Source</p>
              <h2>{highestSource}</h2>
              <span className="stat-foot">highest contribution</span>
            </div>

            <div className="stat-card accent-card">
              <p className="stat-label">Highest Site</p>
              <h2>{rankedSites.length > 0 ? rankedSites[0].site : "-"}</h2>
              <span className="stat-foot">top emitting location</span>
            </div>
          </section>

          <section className="content-grid">
            <div className="panel glass">
              <div className="panel-head">
                <div>
                  <p className="panel-kicker">Distribution</p>
                  <h3>Emissions by Source</h3>
                </div>
              </div>
              <section style={{ marginTop: "20px" }}>
                <div className="panel glass">
                  <div className="panel-head">
                    <div>
                      <p className="panel-kicker">Ranking</p>
                      <h3>Top Emitting Sites</h3>
                    </div>
                  </div>

                  <div className="legend-list">
                    {rankedSites.map((item, index) => (
                      <div className="legend-item" key={item.site}>
                        <span>#{index + 1}</span>
                        <span>{item.site}</span>
                        <strong>{Number(item.emissions).toFixed(1)} kg CO₂e</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={72}
                      outerRadius={110}
                      paddingAngle={4}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={ALULA_COLORS[index % ALULA_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    {/* تعديل لون نص المفتاح (Legend) إلى الأبيض */}
                    <Legend wrapperStyle={{ color: '#ffffff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="legend-list">
                {pieData.map((item, index) => (
                  <div className="legend-item" key={item.name}>
                    <span
                      className="legend-dot"
                      style={{ backgroundColor: ALULA_COLORS[index % ALULA_COLORS.length] }}
                    />
                    <span>{item.name}</span>
                    <strong>{formatKg(item.value)}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel glass">
              <div className="panel-head">
                <div>
                  <p className="panel-kicker">Locations</p>
                  <h3>Emissions by Site</h3>
                </div>
              </div>

              <div className="chart-wrap">
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={siteData}>
                    {/* تحديث خطوط الشبكة لتكون أفتح قليلاً ومناسبة للخلفية */}
                    <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
                    
                    {/* تعديل لون نصوص الأرقام والكلمات في المحاور لتكون باللون الأبيض */}
                    <XAxis dataKey="site" stroke="#ffffff" />
                    <YAxis
                      stroke="#ffffff"
                      tickFormatter={(value) => `${value} kg`}
                    />
                    
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="emissions" radius={[10, 10, 0, 0]} fill="#dca771" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="insight-box">
                <p className="insight-title">Insight</p>
                <p className="insight-text">
                  {highestSite} currently contributes the highest site-level carbon emissions in the dataset.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}