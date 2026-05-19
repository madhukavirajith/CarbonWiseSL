import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AppPage from './pages/AppPage';
import ResultsPage from './pages/ResultsPage';
import SolarPage from './pages/SolarPage';
import HistoryPage from './pages/HistoryPage';
import AuthPage from './pages/AuthPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const AppContext = React.createContext(null);

function App() {
    const [formData, setFormData] = useState(null);
    const [results, setResults] = useState(null);
    
    // User authentication state
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('cw_user');
        try {
            return stored ? JSON.parse(stored) : null;
        } catch (e) {
            return null;
        }
    });

    // Fallback anonymous user ID
    const [anonId] = useState(() => {
        return localStorage.getItem('cw_uid') || `user_${Date.now()}`;
    });

    useEffect(() => {
        localStorage.setItem('cw_uid', anonId);
    }, [anonId]);

    const userId = user ? user.user_id : anonId;

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('cw_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cw_user');
    };

    const resetAll = () => {
        setFormData(null);
        setResults(null);
    };

    return (
        <AppContext.Provider value={{ formData, setFormData, results, setResults, userId, user, login, logout, resetAll }}>
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
                            <Route path="/auth" element={<AuthPage />} />
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