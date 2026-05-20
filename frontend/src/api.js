// frontend/src/api.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 120000,
});

// Response interceptor — normalise errors
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg =
            err.response?.data?.detail ||
            (err.code === 'ECONNABORTED' ? 'Request timed out. Try again.' : 'Server error. Please try again.');
        return Promise.reject(new Error(msg));
    }
);

export const checkHealth = () => api.get('/api/health');
export const predictEmissions = (d) => api.post('/api/predict', d);
export const explainPrediction = (d) => api.post('/api/explain', d);
export const getCluster = (d) => api.post('/api/cluster', d);
export const simulate = (d) => api.post('/api/simulate', d);
export const solarRoi = (d) => api.post('/api/solar', d);
export const saveHistory = (d) => api.post('/api/history/save', d);
export const getHistory = (uid) => api.get(`/api/history/${uid}`);
export const signupUser = (d) => api.post('/api/auth/signup', d);
export const loginUser = (d) => api.post('/api/auth/login', d);