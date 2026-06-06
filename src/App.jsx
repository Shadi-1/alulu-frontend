import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

// `basename` must match the GitHub Pages project path (see vite.config.js `base`).
// Without it, <Route path="/trends"> resolves to the host root, not under
// /alulu-frontend/, and deep links break on hard refresh.
import DashboardPage from "./pages/DashboardPage";
import TrendsPage from "./pages/TrendsPage";
import SimulationPage from "./pages/SimulationPage";
import ForecastPage from "./pages/ForecastPage";
import MapPage from "./pages/MapPage";
import DataEntryPage from "./pages/DataEntryPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter basename="/alulu-frontend">
      <div className="app-nav">
        <div className="app-nav-inner">
          <div className="brand-mini">AlUla Carbon Platform</div>

          <div className="nav-links">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Dashboard
            </NavLink>

            <NavLink to="/trends" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Trends
            </NavLink>

            <NavLink to="/simulation" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Simulation
            </NavLink>

            <NavLink to="/forecast" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Forecast
            </NavLink>

            <NavLink to="/map" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Map
            </NavLink>

            <NavLink to="/data-entry" className={({ isActive }) => isActive ? "nav-link active-link" : "nav-link"}>
              Data Entry
            </NavLink>
          </div>
        </div>
      </div>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/forecast" element={<ForecastPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/data-entry" element={<DataEntryPage />} />
      </Routes>
    </BrowserRouter>
  );
}