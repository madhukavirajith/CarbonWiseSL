// frontend/src/api.js
import axios from 'axios';
// During development this points to your local FastAPI
// When deployed, change this to your Render.com URL
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const api = axios.create({
 baseURL: BASE_URL,
 headers: { 'Content-Type': 'application/json' }
});
// ─── API FUNCTIONS ───────────────────────────────────────────────────
export const predictEmissions = (applianceData) =>
 api.post('/api/predict', applianceData);
export const explainPrediction = (applianceData) =>
 api.post('/api/explain', applianceData);
export const getCluster = (applianceData) =>
 api.post('/api/cluster', applianceData);
export const simulate = (simulationData) =>
 api.post('/api/simulate', simulationData);
export const solarRoi = (solarData) =>
 api.post('/api/solar', solarData);
