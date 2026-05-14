// frontend/src/pages/AppPage.js
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplianceForm from '../components/ApplianceForm';
import { AppContext } from '../App';

export default function AppPage() {
    const { results } = useContext(AppContext);
    const navigate = useNavigate();

    // If results already exist redirect to results page
    useEffect(() => {
        if (results) navigate('/results');
    }, []); // eslint-disable-line

    return (
        <div style={{ paddingTop: 80, background: '#F4F6F8', minHeight: '100vh' }}>
            {/* Page header */}
            <div style={{
                background: 'linear-gradient(135deg,#1B2A4A 0%,#0D3B45 100%)',
                padding: '48px 24px 64px',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Background decoration */}
                <div style={{
                    position: 'absolute', top: -60, right: -60, width: 300, height: 300,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(13,118,128,0.15),transparent 70%)',
                }} />

                <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(13,118,128,0.20)',
                        border: '1px solid rgba(13,118,128,0.40)',
                        borderRadius: 100, padding: '5px 14px', marginBottom: 18,
                    }}>
                        <span style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: '#0D7680', display: 'block',
                            animation: 'pulse 2s infinite'
                        }} />
                        <span style={{ fontSize: 12, color: '#B2DDE0', fontWeight: 600 }}>
                            AI Models Ready — XGBoost + SHAP + K-Means
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(26px,3.5vw,38px)',
                        fontWeight: 800, color: '#fff', marginBottom: 12,
                    }}>
                        Calculate Your Carbon Footprint
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 560, lineHeight: 1.7 }}>
                        Enter your household appliances and electricity usage. Our AI will predict
                        your CO₂ emissions, explain which appliances cause them, and give you
                        personalised reduction recommendations.
                    </p>

                    {/* Step indicators */}
                    <div style={{
                        display: 'flex', gap: 20, marginTop: 28, flexWrap: 'wrap',
                    }}>
                        {[
                            { icon: '📋', text: 'Enter Appliances', sub: '~3 minutes' },
                            { icon: '🤖', text: 'AI Calculates', sub: 'Instant' },
                            { icon: '📊', text: 'See Results', sub: 'Full breakdown' },
                        ].map((s, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                {i > 0 && (
                                    <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>→</div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.text}</div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{s.sub}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Pull-up card */}
            <div style={{ maxWidth: 860, margin: '-28px auto 60px', padding: '0 24px' }}>
                <div style={{
                    background: '#fff', borderRadius: 20,
                    boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                    border: '1px solid #E8ECF0',
                    padding: '36px 40px',
                }}>
                    <ApplianceForm />
                </div>

                {/* Data notice */}
                <div style={{
                    marginTop: 20, padding: '14px 20px', borderRadius: 10,
                    background: '#fff', border: '1px solid #E8ECF0',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                    <span style={{ fontSize: 18, flexShrink: 0 }}>🔒</span>
                    <div style={{ fontSize: 12, color: '#8A9BB0', lineHeight: 1.7 }}>
                        <strong style={{ color: '#5A6A7A' }}>Privacy:</strong> Your appliance data
                        is only used for the AI prediction and is never stored permanently or shared.
                        Emission factors from SLSEA 2024 · CEB Domestic Tariff 2024.
                    </div>
                </div>
            </div>
        </div>
    );
}