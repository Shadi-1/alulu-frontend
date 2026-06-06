// API configuration for development vs production.
// In dev, Vite serves the React app on :5173 and the FastAPI backend on :8000.
// In production on GitHub Pages, the backend lives on Render — its URL is
// baked into the build via VITE_API_BASE (see frontend/.env.production).
export const getApiBase = () => {
  if (import.meta.env.DEV) return "http://127.0.0.1:8000";
  return import.meta.env.VITE_API_BASE || "";
};
