// frontend/src/components/SummaryCards.js
import React from 'react';

const levelConfig = {
    Low: { color: '#1A7A4A', bg: '#E8F5EE', icon: '🟢', label: 'Low Emissions' },
    Medium: { color: '#C8932A', bg: '#FDF6E3', icon: '🟡', label: 'Medium Emissions' },
    High: { color: '#C0392B', bg: '#FDECEA', icon: '🔴', label: 'High Emissions' },
};

function MetricCard({ icon, label, value, unit, color, bg, sub, delay }) {
    return (
        <div className="animate-fadeUp" style={{
            animationDelay: `${delay}s`,
            background: bg || '#fff',
            border: `1.5px solid ${color}30`,
            borderRadius: 16,
            padding: '24px 20px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            cursor: 'default',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)';
            }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
            <div style={{
                fontSize: 11, fontWeight: 700, color: color,
                textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6,
            }}>{label}</div>
            <div style={{
                display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6,
            }}>
                <span style={{
                    fontSize: 34, fontWeight: 800, color: '#1B2A4A',
                    fontFamily: "'Poppins', sans-serif", lineHeight: 1,
                }}>{value}</span>
                <span style={{ fontSize: 14, color: '#8A9BB0', fontWeight: 500 }}>{unit}</span>
            </div>
            {sub && (
                <div style={{ fontSize: 12, color: '#8A9BB0', marginTop: 4 }}>{sub}</div>
            )}
        </div>
    );
}

export default function SummaryCards({ prediction }) {
    if (!prediction) return null;

    const {
        daily_co2_kg, monthly_co2_kg, annual_co2_kg,
        monthly_cost_lkr, emission_level,
        sl_average_co2, vs_average_pct,
    } = prediction;

    const lvl = levelConfig[emission_level] || levelConfig.Medium;
    const vsSign = vs_average_pct > 0 ? '+' : '';
    const vsColor = vs_average_pct > 0 ? '#C0392B' : '#1A7A4A';

    return (
        <div>
            {/* Emission level banner */}
            <div className="animate-fadeUp" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 22px', borderRadius: 14,
                background: lvl.bg, border: `1.5px solid ${lvl.color}40`,
                marginBottom: 20,
            }}>
                <span style={{ fontSize: 28 }}>{lvl.icon}</span>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: lvl.color }}>
                        {lvl.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#5A6A7A', marginTop: 2 }}>
                        Your household emits{' '}
                        <strong style={{ color: vsColor }}>{vsSign}{vs_average_pct}%</strong>
                        {' '}{vs_average_pct > 0 ? 'above' : 'below'} the Sri Lankan urban average of {sl_average_co2} kg/day
                    </div>
                </div>
                <div style={{
                    padding: '6px 14px', borderRadius: 100,
                    background: lvl.color, color: '#fff',
                    fontSize: 12, fontWeight: 700,
                }}>
                    {emission_level}
                </div>
            </div>

            {/* Metric cards grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: 14,
            }}>
                <MetricCard
                    icon="📅" label="Daily CO₂" delay={0.05}
                    value={daily_co2_kg} unit="kg"
                    color="#0D7680" bg="#E6F4F5"
                    sub="Carbon dioxide today" />

                <MetricCard
                    icon="📆" label="Monthly CO₂" delay={0.10}
                    value={monthly_co2_kg} unit="kg"
                    color="#7B3F9E" bg="#F3EBF8"
                    sub={`≈ ${Math.round(monthly_co2_kg / 0.52)} kWh consumed`} />

                <MetricCard
                    icon="🗓️" label="Annual CO₂" delay={0.15}
                    value={annual_co2_kg} unit="kg"
                    color="#C0392B" bg="#FDECEA"
                    sub="Your yearly footprint" />

                <MetricCard
                    icon="💰" label="Monthly Bill" delay={0.20}
                    value={monthly_cost_lkr.toLocaleString()} unit="LKR"
                    color="#C8932A" bg="#FDF6E3"
                    sub="Estimated CEB bill" />
            </div>

            {/* CO2 context bar */}
            <div className="animate-fadeUp" style={{
                animationDelay: '0.25s',
                marginTop: 14, padding: '14px 18px', borderRadius: 12,
                background: '#F4F6F8', border: '1px solid #E8ECF0',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A' }}>
                        Your daily CO₂ vs Sri Lanka urban average
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: vsColor }}>
                        {daily_co2_kg} kg / {sl_average_co2} kg avg
                    </span>
                </div>
                <div style={{ height: 8, background: '#E8ECF0', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                    {/* Average line */}
                    <div style={{
                        position: 'absolute', left: `${Math.min((sl_average_co2 / 10) * 100, 100)}%`,
                        top: 0, bottom: 0, width: 2, background: '#8A9BB0', zIndex: 2,
                    }} />
                    {/* Your value */}
                    <div style={{
                        height: '100%',
                        width: `${Math.min((daily_co2_kg / 10) * 100, 100)}%`,
                        background: `linear-gradient(90deg, ${lvl.color}80, ${lvl.color})`,
                        borderRadius: 4, transition: 'width 1s ease',
                    }} />
                </div>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', marginTop: 6,
                    fontSize: 11, color: '#8A9BB0',
                }}>
                    <span>0 kg</span>
                    <span>↑ SL avg: {sl_average_co2} kg</span>
                    <span>10 kg</span>
                </div>
            </div>
        </div>
    );
}