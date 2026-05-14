// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import ResultsPage from './pages/ResultsPage';
import SolarPage from './pages/SolarPage';
import HistoryPage from './pages/HistoryPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const AppContext = React.createContext(null);

function App() {
    const [formData, setFormData] = useState(null);
    const [results, setResults] = useState(null);
    const [userId, setUserId] = useState(() => {
        return localStorage.getItem('cw_uid') || `user_${Date.now()}`;
    });

    useEffect(() => {
        localStorage.setItem('cw_uid', userId);
    }, [userId]);

    const resetAll = () => {
        setFormData(null);
        setResults(null);
    };

    return (
        <AppContext.Provider value={{ formData, setFormData, results, setResults, userId, resetAll }}>
            <BrowserRouter>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                    <Navbar />
                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/calculate" element={<AppPage />} />
                            <Route path="/results" element={results ? <ResultsPage /> : <Navigate to="/calculate" />} />
                            <Route path="/solar" element={<SolarPage />} />
                            <Route path="/history" element={<HistoryPage />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </AppContext.Provider>
    );
}

export default App;