import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { getApiBase } from "../config/api";
import "../App.css";

export default function TrendsPage() {
  const [timeData, setTimeData] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const apiBase = getApiBase();
    fetch(`${apiBase}/emissions-over-time`)
      .then((res) => res.json())
      .then((data) => {
        // ترتيب البيانات حسب التاريخ لضمان انسيابية الخط
        const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setTimeData(sortedData);
      })
      .catch((err) => setError(err.message));
  }, []);

  const formatKg = (value) => `${Number(value).toLocaleString()} kg`;

  return (
    <div className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">TIMELINE ANALYTICS</p>
          <h1>Emissions Trend</h1>
          <p className="subtitle">
            Track how total emissions change across different dates.
          </p>
        </div>
      </header>

      {error && <div className="error-box">Error: {error}</div>}

      <section className="content-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel glass">
          <div className="panel-head">
            <div>
              <p className="panel-kicker">Timeline</p>
              <h3>Emissions Over Time</h3>
            </div>
          </div>

          <div className="chart-wrap" style={{ padding: "20px" }}>
            <ResponsiveContainer width="100%" height={400}>
              {/* التعديل الأول: إضافة margin لرفع الرسمة وإعطاء مساحة للتواريخ بالأسفل */}
              <AreaChart data={timeData} margin={{ top: 10, right: 10, left: 0, bottom: 40 }}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                
                <XAxis 
                  dataKey="date" 
                  stroke="#94A3B8" 
                  minTickGap={60} // يمنع تداخل التواريخ
                  tick={{fontSize: 12}}
                  tickFormatter={(str) => {
                    const date = new Date(str);
                    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
                  }}
                />
                
                <YAxis
                  stroke="#94A3B8"
                  tick={{fontSize: 12}}
                  tickFormatter={(value) => `${value}`}
                />
                
                <Tooltip
                  formatter={(value) => [formatKg(value), "Total Emissions"]}
                  contentStyle={{
                    background: "#111827",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                
                <Area
                  type="monotone" // يجعل الخط منحنياً وناعماً بدل منكسر
                  dataKey="emissions"
                  stroke="#10B981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEmissions)"
                  dot={false} // إخفاء النقاط المزدحمة
                  activeDot={{ r: 6, strokeWidth: 0 }} // تظهر النقطة فقط عند التمرير بالماوس
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* التعديل الثاني: إضافة مسافة علوية للصندوق عشان ينزل تحت ولا يغطي التواريخ */}
          <div className="insight-box" style={{ marginTop: "40px" }}>
            <p className="insight-title">Trend Insight</p>
            <p className="insight-text">
              The graph shows a smooth progression of emissions. Use the data to identify peaks and stabilize the carbon footprint.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}