import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Brush, 
} from "recharts";
import { getApiBase } from "../config/api";
import "../App.css";

export default function ForecastPage() {
  const [forecastData, setForecastData] = useState([]);
  const [error, setError] = useState("");
  
  // === الحالات الجديدة للتحكم في الفلترة وشريط التمرير ===
  const [period, setPeriod] = useState("D");
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState("");     
  const [brushRange, setBrushRange] = useState({ start: 0, end: 29 });

  // === جلب البيانات مع دعم الفلترة ===
  useEffect(() => {
    const apiBase = getApiBase();
    const query = `period=${period}${startDate ? `&start_date=${startDate}` : ''}${endDate ? `&end_date=${endDate}` : ''}`;
    fetch(`${apiBase}/emissions-forecast?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setForecastData(data);
          // ضبط النطاق فور وصول البيانات بناءً على النوع
          const defaultEnd = period === "D" ? 29 : 6;
          setBrushRange({
            start: 0,
            end: data.length > defaultEnd ? defaultEnd : data.length - 1
          });
        }
      })
      .catch((err) => setError(err.message));
  }, [period, startDate, endDate]);

  const filteredData = startDate 
    ? forecastData.filter(item => item.date >= startDate)
    : forecastData;

  const formatKg = (value) =>
    value === null || value === undefined ? "-" : `${Number(value).toFixed(1)} kg CO₂e`;

  // المربع الزجاجي الفاتح عند التمرير
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '12px 16px',
          border: '1px solid rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          color: '#4a3f35',
          fontSize: '14px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '4px' }}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color, fontWeight: 'bold' }}>
              {entry.name}: {Number(entry.value).toFixed(1)} kg CO₂e
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="dashboard-shell">
      {/* حل مشكلة الإطار الأبيض المزعج مدمج هنا مباشرة لراحتك */}
      <style>
        {`
          .recharts-wrapper:focus,
          .recharts-surface:focus,
          .recharts-wrapper *,
          .recharts-surface * {
            outline: none !important;
          }
        `}
      </style>

      <header className="topbar">
        <div>
          <p className="eyebrow">FORECAST ANALYTICS</p>
          <h1>Emissions Forecast</h1>
          <p className="subtitle">
            Forecast future emissions based on historical average values.
          </p>
        </div>
      </header>

      {error && <div className="error-box">Error: {error}</div>}

      <section className="content-grid" style={{ gridTemplateColumns: "1fr" }}>
        <div className="panel glass">
          <div className="panel-head">
            {/* تم ترتيب العنوان مع أزرار الفلترة بشكل متناسق */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <p className="panel-kicker">Prediction</p>
                <h3>Actual vs Forecast (kg CO₂e)</h3>
              </div>
              
              {/* أزرار الفلترة مدمجة مع ألوان العلا الزجاجية */}
              <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '12px' }}>
                {['D', 'W', 'M', 'Y'].map(p => (
                  <button 
                    key={p} 
                    onClick={() => setPeriod(p)} 
                    style={{
                      padding: '8px 18px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      background: period === p ? '#b85b3f' : 'transparent', // لون العلا الصخري للزر النشط
                      color: period === p ? '#ffffff' : 'rgba(255,255,255,0.7)', 
                      cursor: 'pointer', 
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {p === 'D' ? 'Daily' : p === 'W' ? 'Weekly' : p === 'M' ? 'Monthly' : 'Yearly'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-wrap" style={{ marginBottom: "40px", marginTop: "20px" }}>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart 
                key={`chart-${period}-${filteredData.length}-${brushRange.end}`} 
                data={filteredData} 
                margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
              >
                <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
                
                <XAxis 
                  dataKey="date" 
                  stroke="#ffffff" 
                  padding={{ left: 30, right: 30 }} 
                />
                
                <YAxis
                  stroke="#ffffff"
                  tickFormatter={(value) => `${value} kg`}
                />
                
                <Tooltip content={<CustomTooltip />} />
                
                <Legend verticalAlign="top" wrapperStyle={{ color: '#ffffff', paddingBottom: '15px' }} />
                
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#b85b3f"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Actual"
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#dca771"
                  strokeWidth={3}
                  strokeDasharray="6 6"
                  dot={{ r: 4 }}
                  name="Forecast"
                  connectNulls
                />

                {/* شريط التمرير (Brush) مدمج مع الألوان المناسبة وتكبير المقبض لسهولة السحب */}
                {filteredData.length > 0 && (
                  <Brush 
                    dataKey="date" 
                    height={35} 
                    stroke="#dca771" 
                    fill="rgba(30, 22, 18, 0.9)"
                    travellerWidth={18}
                    startIndex={brushRange.start}
                    endIndex={brushRange.end}
                    onChange={(obj) => setBrushRange({ start: obj.startIndex, end: obj.endIndex })}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="insight-box">
            <p className="insight-title">Forecast Note</p>
            <p className="insight-text" style={{ color: "#ffffff" }}>
              This forecast uses a simple average-based approach as an initial predictive model. Use the controls above to change the time period.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}