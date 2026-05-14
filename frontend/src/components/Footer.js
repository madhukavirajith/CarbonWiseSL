// frontend/src/components/Footer.js
import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer style={{
            background: '#111E35',
            color: 'rgba(255,255,255,0.65)',
            padding: '48px 24px 28px',
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
                    gap: 40, marginBottom: 48,
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 9,
                                background: 'linear-gradient(135deg,#0D7680,#1B2A4A)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 18,
                            }}>🌿</div>
                            <span style={{
                                fontFamily: "'Poppins',sans-serif", fontWeight: 700,
                                fontSize: 18, color: '#fff',
                            }}>CarbonWise SL</span>
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.8, maxWidth: 260 }}>
                            AI-Powered Household Electricity Carbon Prediction and Reduction
                            Platform for Urban Sri Lankan Households.
                        </p>
                        <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                            SLSEA Grid Emission Factor 2024 · CEB Tariff 2024
                        </div>
                    </div>

                    {/* Navigate */}
                    <div>
                        <div style={{
                            fontSize: 12, fontWeight: 700, color: '#B2DDE0',
                            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16
                        }}>
                            Navigate
                        </div>
                        {[
                            { to: '/', label: 'Home' },
                            { to: '/calculate', label: 'Calculate Footprint' },
                            { to: '/solar', label: 'Solar ROI Calculator' },
                            { to: '/history', label: 'Emission History' },
                        ].map(l => (
                            <div key={l.to} style={{ marginBottom: 10 }}>
                                <Link to={l.to} style={{
                                    fontSize: 14, color: 'rgba(255,255,255,0.55)',
                                    textDecoration: 'none', transition: 'color 0.2s',
                                }}
                                    onMouseEnter={e => e.target.style.color = '#B2DDE0'}
                                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}>
                                    {l.label}
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* AI Stack */}
                    <div>
                        <div style={{
                            fontSize: 12, fontWeight: 700, color: '#B2DDE0',
                            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16
                        }}>
                            AI Stack
                        </div>
                        {[
                            '🤖 XGBoost Regression',
                            '🔍 SHAP TreeExplainer',
                            '👥 K-Means Clustering',
                            '🐍 FastAPI (Python)',
                            '⚛️ React.js Frontend',
                            '🐳 Docker · Render · Vercel',
                        ].map(item => (
                            <div key={item} style={{ fontSize: 13, marginBottom: 8 }}>{item}</div>
                        ))}
                    </div>

                    {/* Data Sources */}
                    <div>
                        <div style={{
                            fontSize: 12, fontWeight: 700, color: '#B2DDE0',
                            textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16
                        }}>
                            Data Sources
                        </div>
                        {[
                            '📊 SLSEA Grid Emission Factor',
                            '💡 CEB 5-Tier Domestic Tariff',
                            '☀️ SLSEA Solar Irradiance Data',
                            '🌍 IEA Emissions Factors 2024',
                            '📚 UCI Household Energy Dataset',
                        ].map(item => (
                            <div key={item} style={{ fontSize: 13, marginBottom: 8 }}>{item}</div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    paddingTop: 24,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: 12,
                }}>
                    <div style={{ fontSize: 13 }}>
                        © 2025 CarbonWise SL · Kuruppu Arachchige Madhuka Virajith · St20311741 · CIS6035
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)' }}>
                        Built for BSc (Hons) Computer Science Final Year Project
                    </div>
                </div>
            </div>
        </footer>
    );
}