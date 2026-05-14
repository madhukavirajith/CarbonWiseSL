// frontend/src/pages/HistoryPage.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import { getHistory } from '../api';
import TrendChart from '../components/TrendChart';
import EmptyState from '../components/EmptyState';

const levelColors = {
    Low: { bg: '#E8F5EE', color: '#1A7A4A', dot: '#1A7A4A' },
    Medium: { bg: '#FDF6E3', color: '#C8932A', dot: '#C8932A' },
    High: { bg: '#FDECEA', color: '#C0392B', dot: '#C0392B' },
};

function HistoryRow({ record, index }) {
    const p = record.prediction || {};
    const lvl = levelColors[p.emission_level] || levelColors.Medium;
    const date = p.timestamp
        ? new Date(p.timestamp).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
        })
        : `Entry ${index + 1}`;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '120px 1fr 1fr 1fr 1fr',
            gap: 12, alignItems: 'center',
            padding: '14px 20px',
            background: index % 2 === 0 ? '#fff' : '#FAFBFC',
            borderBottom: '1px solid #F4F6F8',
        }}>
            <div style={{ fontSize: 13, color: '#5A6A7A' }}>{date}</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: lvl.dot, flexShrink: 0,
                }} />
                <span style={{
                    fontSize: 13, fontWeight: 700, color: lvl.color,
                    background: lvl.bg, padding: '3px 10px', borderRadius: 100,
                }}>
                    {p.emission_level || '—'}
                </span>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: '#1B2A4A' }}>
                {p.daily_co2_kg ?? '—'} <span style={{ fontSize: 11, color: '#8A9BB0', fontWeight: 400 }}>kg/day</span>
            </div>

            <div style={{ fontSize: 14, fontWeight: 700, color: '#0D7680' }}>
                {p.monthly_co2_kg ?? '—'} <span style={{ fontSize: 11, color: '#8A9BB0', fontWeight: 400 }}>kg/mo</span>
            </div>

            <div style={{ fontSize: 13, color: '#C8932A', fontWeight: 600 }}>
                LKR {p.monthly_cost_lkr?.toLocaleString() ?? '—'}
            </div>
        </div>
    );
}

export default function HistoryPage() {
    const { userId } = useContext(AppContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await getHistory(userId);
                setRecords(res.data.records || []);
            } catch (err) {
                setError('Could not load history. ' + err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    // Summary stats
    const co2Values = records.map(r => r.prediction?.daily_co2_kg ?? 0).filter(Boolean);
    const avgCo2 = co2Values.length
        ? (co2Values.reduce((a, b) => a + b, 0) / co2Values.length).toFixed(2)
        : '—';
    const bestCo2 = co2Values.length ? Math.min(...co2Values) : '—';
    const latestCo2 = co2Values.length ? co2Values[co2Values.length - 1] : '—';
    const trend = co2Values.length > 1
        ? (latestCo2 - co2Values[0]).toFixed(2)
        : null;

    return (
        <div style={{ paddingTop: 80, background: '#F4F6F8', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg,#1B2A4A 0%,#0D3B45 100%)',
                padding: '48px 24px 64px',
                position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -60, right: -60, width: 280, height: 280,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(13,118,128,0.15),transparent 70%)',
                }} />
                <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 'clamp(26px,3vw,36px)',
                        fontWeight: 800, color: '#fff', marginBottom: 10,
                    }}>
                        📈 Emission History
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.60)', maxWidth: 500, lineHeight: 1.7 }}>
                        Every prediction you submit is saved here so you can track your
                        carbon reduction progress over time.
                    </p>
                    {records.length > 0 && (
                        <div style={{ display: 'flex', gap: 16, marginTop: 24, flexWrap: 'wrap' }}>
                            {[
                                { label: 'Total Entries', value: records.length, unit: '' },
                                { label: 'Average CO₂', value: avgCo2, unit: 'kg/day' },
                                { label: 'Best Entry', value: bestCo2, unit: 'kg/day' },
                                { label: 'Latest Entry', value: latestCo2, unit: 'kg/day' },
                            ].map(s => (
                                <div key={s.label} style={{
                                    background: 'rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 12, padding: '14px 20px',
                                }}>
                                    <div style={{
                                        fontSize: 11, color: '#B2DDE0', fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4
                                    }}>
                                        {s.label}
                                    </div>
                                    <div style={{
                                        fontSize: 22, fontWeight: 800, color: '#fff',
                                        fontFamily: "'Poppins',sans-serif"
                                    }}>
                                        {s.value}
                                        {s.unit && <span style={{
                                            fontSize: 12, color: '#B2DDE0',
                                            fontWeight: 400, marginLeft: 4
                                        }}>{s.unit}</span>}
                                    </div>
                                </div>
                            ))}
                            {trend !== null && (
                                <div style={{
                                    background: parseFloat(trend) <= 0 ? 'rgba(26,122,74,0.20)' : 'rgba(192,57,43,0.20)',
                                    border: `1px solid ${parseFloat(trend) <= 0 ? 'rgba(26,122,74,0.40)' : 'rgba(192,57,43,0.40)'}`,
                                    borderRadius: 12, padding: '14px 20px',
                                }}>
                                    <div style={{
                                        fontSize: 11, color: '#B2DDE0', fontWeight: 600,
                                        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4
                                    }}>
                                        Overall Trend
                                    </div>
                                    <div style={{
                                        fontSize: 22, fontWeight: 800,
                                        color: parseFloat(trend) <= 0 ? '#80CBC4' : '#FF8A80',
                                        fontFamily: "'Poppins',sans-serif",
                                    }}>
                                        {parseFloat(trend) > 0 ? '+' : ''}{trend} kg
                                        {parseFloat(trend) <= 0 ? ' ✅' : ' ⚠️'}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ maxWidth: 1100, margin: '-28px auto 60px', padding: '0 24px' }}>

                {loading && (
                    <div style={{
                        background: '#fff', borderRadius: 20,
                        padding: '60px', textAlign: 'center',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%', margin: '0 auto 16px',
                            border: '3px solid #E8ECF0', borderTop: '3px solid #0D7680',
                            animation: 'spin 0.9s linear infinite',
                        }} />
                        <div style={{ fontSize: 14, color: '#8A9BB0' }}>Loading your history…</div>
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '16px 20px', borderRadius: 12,
                        background: '#FDECEA', border: '1px solid #C0392B30',
                        color: '#C0392B', fontSize: 14, marginBottom: 20,
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {!loading && !error && records.length === 0 && (
                    <div style={{ marginTop: 0 }}>
                        <EmptyState
                            icon="📈"
                            title="No History Yet"
                            desc="Submit your first calculation to start tracking your carbon footprint over time."
                            actionLabel="Calculate My Footprint"
                            actionTo="/calculate"
                        />
                    </div>
                )}

                {!loading && records.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                        {/* Trend chart */}
                        <div style={{
                            background: '#fff', borderRadius: 20,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            border: '1px solid #E8ECF0', padding: '28px',
                        }}>
                            <h2 style={{
                                fontSize: 18, fontWeight: 800, color: '#1B2A4A',
                                fontFamily: "'Poppins',sans-serif", marginBottom: 4,
                            }}>
                                CO₂ Trend Over Time
                            </h2>
                            <p style={{ fontSize: 13, color: '#8A9BB0', marginBottom: 20 }}>
                                Track how your daily carbon footprint changes across submissions
                            </p>
                            <TrendChart records={records} />
                        </div>

                        {/* History table */}
                        <div style={{
                            background: '#fff', borderRadius: 20,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            border: '1px solid #E8ECF0', overflow: 'hidden',
                        }}>
                            {/* Table header */}
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: '120px 1fr 1fr 1fr 1fr',
                                gap: 12, padding: '14px 20px',
                                background: '#F4F6F8',
                                borderBottom: '1px solid #E8ECF0',
                                fontSize: 11, fontWeight: 700, color: '#8A9BB0',
                                textTransform: 'uppercase', letterSpacing: 1,
                            }}>
                                <span>Date</span>
                                <span>Level</span>
                                <span>Daily CO₂</span>
                                <span>Monthly CO₂</span>
                                <span>Est. Bill</span>
                            </div>

                            {[...records].reverse().map((r, i) => (
                                <HistoryRow key={i} record={r} index={i} />
                            ))}
                        </div>

                        {/* Recalculate CTA */}
                        <div style={{
                            padding: '24px', borderRadius: 16,
                            background: 'linear-gradient(135deg,#E6F4F5,#fff)',
                            border: '1.5px solid #B2DDE0',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
                        }}>
                            <div>
                                <div style={{ fontSize: 15, fontWeight: 700, color: '#1B2A4A', marginBottom: 4 }}>
                                    Ready to improve your score?
                                </div>
                                <div style={{ fontSize: 13, color: '#5A6A7A' }}>
                                    Make a behaviour change and recalculate to track your progress.
                                </div>
                            </div>
                            <Link to="/calculate" style={{
                                padding: '11px 24px', borderRadius: 10, fontSize: 14, fontWeight: 700,
                                background: 'linear-gradient(135deg,#0D7680,#0a5d65)',
                                color: '#fff', textDecoration: 'none',
                                boxShadow: '0 3px 12px rgba(13,118,128,0.30)',
                            }}>
                                ⚡ Recalculate Now
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}