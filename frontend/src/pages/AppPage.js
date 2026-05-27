// frontend/src/pages/AppPage.js
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplianceForm from '../components/ApplianceForm';
import { AppContext } from '../App';
import { ClipboardList, Cpu, BarChart3, Lock } from 'lucide-react';

export default function AppPage() {
    const { results } = useContext(AppContext);
    const navigate = useNavigate();

    // If results already exist redirect to results page
    useEffect(() => {
        if (results) navigate('/results');
    }, []); // eslint-disable-line

    const steps = [
        { icon: ClipboardList, text: 'Enter Appliances', sub: '~3 minutes' },
        { icon: Cpu, text: 'AI Calculates', sub: 'Instant' },
        { icon: BarChart3, text: 'See Results', sub: 'Full breakdown' },
    ];

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
                        {steps.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', gap: 10,
                                }}>
                                    {i > 0 && (
                                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.25)' }}>→</div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: 32, height: 32, borderRadius: '50%', 
                                            background: 'rgba(255,255,255,0.1)', color: '#fff' 
                                        }}>
                                            <Icon size={16} />
                                        </span>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{s.text}</div>
                                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{s.sub}</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pull-up card */}
            <div style={{ maxWidth: 860, margin: '-28px auto 60px', padding: '0 24px' }}>
                <div className="form-card">
                    <ApplianceForm />
                </div>

                {/* Data notice */}
                <div style={{
                    marginTop: 20, padding: '14px 20px', borderRadius: 10,
                    background: '#fff', border: '1px solid #E8ECF0',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                    <span style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#8A9BB0', marginTop: 2, flexShrink: 0 
                    }}>
                        <Lock size={18} />
                    </span>
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