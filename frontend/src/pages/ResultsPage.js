import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../App';
import SummaryCards from '../components/SummaryCards';
import ShapChart from '../components/ShapChart';
import ClusterCard from '../components/ClusterCard';
import WhatIfSimulator from '../components/WhatIfSimulator';
import EmissionGauge from '../components/EmissionGauge';
import { saveHistory } from '../api';
import {
    BarChart3,
    Search,
    Users,
    Sliders,
    CheckCircle2,
    ArrowLeft,
    Sun,
    TrendingUp,
    AlertCircle,
    Leaf,
    Lightbulb,
    Wind,
    Home
} from 'lucide-react';

const iconMap = {
    '❄️': Wind,
    '🌿': Leaf,
    '👨‍👩‍👧‍👦': Users,
    '🏠': Home,
};

/* ── Tab button ─────────────────────────────────────────────────── */
const Tab = ({ id, label, icon: Icon, active, onClick }) => (
    <button onClick={() => onClick(id)} style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '10px 18px', borderRadius: 10,
        background: active
            ? 'linear-gradient(135deg,#0D7680,#0a5d65)'
            : 'transparent',
        color: active ? '#fff' : '#5A6A7A',
        border: active ? 'none' : '1.5px solid #E8ECF0',
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: active ? '0 3px 12px rgba(13,118,128,0.30)' : 'none',
    }}>
        <Icon size={16} />
        <span style={{ display: window.innerWidth < 500 ? 'none' : 'block' }}>{label}</span>
    </button>
);

/* ── Section wrapper ────────────────────────────────────────────── */
const Section = ({ title, subtitle, children }) => (
    <div style={{ marginBottom: 32 }}>
        {(title || subtitle) && (
            <div style={{ marginBottom: 18 }}>
                {title && (
                    <h2 style={{
                        fontSize: 20, fontWeight: 800, color: '#1B2A4A',
                        fontFamily: "'Poppins',sans-serif", margin: '0 0 4px',
                    }}>{title}</h2>
                )}
                {subtitle && (
                    <p style={{ fontSize: 13, color: '#8A9BB0', margin: 0 }}>{subtitle}</p>
                )}
            </div>
        )}
        {children}
    </div>
);

export default function ResultsPage() {
    const { results, formData, resetAll, userId } = useContext(AppContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [saved, setSaved] = useState(false);

    // Save to history once on mount
    useEffect(() => {
        if (!results || saved) return;
        saveHistory({
            user_id: userId,
            prediction: { ...results.prediction, timestamp: results.timestamp },
            appliances: formData || {},
        }).catch(() => { }); // silent fail — history is best-effort
        setSaved(true);
    }, [results, saved, userId, formData]);

    if (!results) {
        navigate('/calculate');
        return null;
    }

    const { prediction, explanation, cluster } = results;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: BarChart3 },
        { id: 'breakdown', label: 'Appliance Breakdown', icon: Search },
        { id: 'profile', label: 'My Profile', icon: Users },
        { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    ];

    return (
        <div style={{ paddingTop: 80, background: '#F4F6F8', minHeight: '100vh' }}>

            {/* ── Results header banner ── */}
            <div style={{
                background: 'linear-gradient(135deg,#1B2A4A 0%,#0D3B45 100%)',
                padding: '40px 24px 56px',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -80, right: -80, width: 320, height: 320,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(13,118,128,0.15),transparent 70%)',
                }} />

                <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'flex', alignItems: 'flex-start',
                        justifyContent: 'space-between', gap: 24, flexWrap: 'wrap',
                    }}>
                        <div style={{ flex: 1, minWidth: 260 }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                fontSize: 12, color: '#B2DDE0', fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10,
                            }}>
                                <CheckCircle2 size={14} color="#B2DDE0" /> AI Analysis Complete
                            </div>
                            <h1 style={{
                                fontFamily: "'Poppins',sans-serif",
                                fontSize: 'clamp(22px,3vw,32px)',
                                fontWeight: 800, color: '#fff', marginBottom: 8,
                            }}>
                                Your Carbon Footprint Results
                            </h1>
                            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.60)', lineHeight: 1.7, maxWidth: 480 }}>
                                Analysed with XGBoost regression · SHAP explainability · K-Means clustering.
                                Results use SLSEA 2024 emission factors and CEB 2024 tariff rates.
                            </p>
                            <div style={{ marginTop: 18, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                <button onClick={resetAll} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                                    background: 'rgba(255,255,255,0.10)',
                                    color: '#fff', border: '1.5px solid rgba(255,255,255,0.25)',
                                    cursor: 'pointer', backdropFilter: 'blur(8px)',
                                }}>
                                    <ArrowLeft size={14} /> Recalculate
                                </button>
                                <Link to="/solar" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                                    background: 'linear-gradient(135deg,#C8932A,#a67420)',
                                    color: '#fff', border: 'none', cursor: 'pointer',
                                    textDecoration: 'none',
                                    boxShadow: '0 3px 12px rgba(200,147,42,0.35)',
                                }}>
                                    <Sun size={14} /> Solar ROI Calculator
                                </Link>
                                <Link to="/history" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '9px 20px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                                    background: 'rgba(255,255,255,0.08)',
                                    color: '#B2DDE0', border: '1.5px solid rgba(178,221,224,0.25)',
                                    cursor: 'pointer', textDecoration: 'none',
                                }}>
                                    <TrendingUp size={14} /> View History
                                </Link>
                            </div>
                        </div>

                        {/* Gauge */}
                        <div style={{
                            background: 'rgba(255,255,255,0.06)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            borderRadius: 20, padding: '20px 24px',
                            textAlign: 'center', minWidth: 220,
                        }}>
                            <EmissionGauge
                                daily_co2={prediction.daily_co2_kg}
                                emission_level={prediction.emission_level}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Tab bar ── */}
            <div style={{
                background: '#fff',
                borderBottom: '1px solid #E8ECF0',
                position: 'sticky', top: 64, zIndex: 100,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
                <div style={{
                    maxWidth: 1100, margin: '0 auto', padding: '10px 24px',
                    display: 'flex', gap: 8, overflowX: 'auto',
                }}>
                    {tabs.map(t => (
                        <Tab key={t.id} {...t} active={activeTab === t.id} onClick={setActiveTab} />
                    ))}
                </div>
            </div>

            {/* ── Content ── */}
            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '36px 24px 60px' }}>

                {/* OVERVIEW TAB */}
                {activeTab === 'overview' && (
                    <div className="animate-fadeIn">
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1fr',
                            gap: 28,
                        }}>
                            <Section
                                title="Emission Summary"
                                subtitle="Your household's daily, monthly, and annual carbon footprint from electricity"
                            >
                                <SummaryCards prediction={prediction} />
                            </Section>

                            {/* Quick insight cards */}
                            <Section
                                title="Key Insights"
                                subtitle="What your results mean in plain terms"
                            >
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
                                    gap: 16,
                                }}>
                                    {/* Top culprit */}
                                    <div style={{
                                        background: '#FDECEA',
                                        border: '1.5px solid #C0392B30',
                                        borderRadius: 14, padding: '20px',
                                    }}>
                                        <div style={{ color: '#C0392B', marginBottom: 10, display: 'flex' }}>
                                            <AlertCircle size={24} />
                                        </div>
                                        <div style={{
                                            fontSize: 12, fontWeight: 700, color: '#C0392B',
                                            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6
                                        }}>
                                            Biggest Culprit
                                        </div>
                                        <div style={{
                                            fontSize: 18, fontWeight: 800, color: '#1B2A4A',
                                            fontFamily: "'Poppins',sans-serif", marginBottom: 6
                                        }}>
                                            {explanation?.top_culprit || '—'}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6 }}>
                                            This appliance contributes the most to your total CO₂ emissions
                                            according to the SHAP analysis.
                                        </div>
                                    </div>

                                    {/* Household profile */}
                                    <div style={{
                                        background: '#E6F4F5',
                                        border: '1.5px solid #0D768030',
                                        borderRadius: 14, padding: '20px',
                                    }}>
                                        <div style={{ color: '#0D7680', marginBottom: 10, display: 'flex' }}>
                                            {(() => {
                                                const Icon = iconMap[cluster?.cluster_icon] || Home;
                                                return <Icon size={24} />;
                                            })()}
                                        </div>
                                        <div style={{
                                            fontSize: 12, fontWeight: 700, color: '#0D7680',
                                            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6
                                        }}>
                                            Your Profile
                                        </div>
                                        <div style={{
                                            fontSize: 18, fontWeight: 800, color: '#1B2A4A',
                                            fontFamily: "'Poppins',sans-serif", marginBottom: 6
                                        }}>
                                            {cluster?.cluster_name || '—'}
                                        </div>
                                        <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6 }}>
                                            Your usage pattern was classified by K-Means AI into this household
                                            behaviour profile.
                                        </div>
                                    </div>

                                    {/* Annual equivalent */}
                                    <div style={{
                                        background: '#F3EBF8',
                                        border: '1.5px solid #7B3F9E30',
                                        borderRadius: 14, padding: '20px',
                                    }}>
                                        <div style={{ color: '#7B3F9E', marginBottom: 10, display: 'flex' }}>
                                            <Leaf size={24} />
                                        </div>
                                        <div style={{
                                            fontSize: 12, fontWeight: 700, color: '#7B3F9E',
                                            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6
                                        }}>
                                            Annual Equivalent
                                        </div>
                                        <div style={{
                                            fontSize: 18, fontWeight: 800, color: '#1B2A4A',
                                            fontFamily: "'Poppins',sans-serif", marginBottom: 6
                                        }}>
                                            {Math.round(prediction.annual_co2_kg / 21)} trees
                                        </div>
                                        <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6 }}>
                                            It would take approximately {Math.round(prediction.annual_co2_kg / 21)} trees
                                            a year to absorb your annual electricity CO₂ of {prediction.annual_co2_kg} kg.
                                        </div>
                                    </div>

                                    {/* Top recommendation */}
                                    <div style={{
                                        background: '#FDF6E3',
                                        border: '1.5px solid #C8932A30',
                                        borderRadius: 14, padding: '20px',
                                    }}>
                                        <div style={{ color: '#C8932A', marginBottom: 10, display: 'flex' }}>
                                            <Lightbulb size={24} />
                                        </div>
                                        <div style={{
                                            fontSize: 12, fontWeight: 700, color: '#C8932A',
                                            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6
                                        }}>
                                            Top Recommendation
                                        </div>
                                        <div style={{ fontSize: 13, color: '#1B2A4A', lineHeight: 1.7 }}>
                                            {cluster?.recommendations?.[0] || 'View the Profile tab for personalised recommendations.'}
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            {/* CTA to other tabs */}
                            <div style={{
                                display: 'flex', gap: 12, flexWrap: 'wrap',
                                padding: '20px 24px', borderRadius: 14,
                                background: 'linear-gradient(135deg,#1B2A4A,#0D3B45)',
                            }}>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                                        Explore Your Results Further
                                    </div>
                                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                                        See the full appliance breakdown, simulate what-if scenarios,
                                        and check your household profile.
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                    {[
                                        { tab: 'breakdown', label: 'Breakdown', icon: Search },
                                        { tab: 'profile', label: 'Profile', icon: Users },
                                        { tab: 'simulator', label: 'Simulator', icon: Sliders },
                                    ].map(b => (
                                        <button key={b.tab} onClick={() => setActiveTab(b.tab)} style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            padding: '9px 16px', borderRadius: 9, fontSize: 13, fontWeight: 600,
                                            background: 'rgba(13,118,128,0.25)',
                                            color: '#B2DDE0', border: '1px solid rgba(13,118,128,0.40)',
                                            cursor: 'pointer',
                                        }}>
                                            <b.icon size={14} /> {b.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* BREAKDOWN TAB */}
                {activeTab === 'breakdown' && (
                    <div className="animate-fadeIn">
                        <Section
                            title="SHAP Appliance Breakdown"
                            subtitle="Powered by SHAP (SHapley Additive exPlanations) — showing each appliance's exact contribution to your predicted CO₂"
                        >
                            <ShapChart explanation={explanation} />
                        </Section>
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div className="animate-fadeIn">
                        <Section
                            title="Your Household Profile"
                            subtitle="K-Means AI clustered your usage pattern and generated these personalised recommendations"
                        >
                            <ClusterCard cluster={cluster} />
                        </Section>
                    </div>
                )}

                {/* SIMULATOR TAB */}
                {activeTab === 'simulator' && (
                    <div className="animate-fadeIn">
                        <Section
                            title="What-If Simulator"
                            subtitle="Simulate behaviour changes to see the CO₂ and LKR impact before committing to them"
                        >
                            <WhatIfSimulator formData={formData} />
                        </Section>
                    </div>
                )}
            </div>
        </div>
    );
}