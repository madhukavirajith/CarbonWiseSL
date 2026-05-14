// frontend/src/components/EmissionGauge.js
import React from 'react';

export default function EmissionGauge({ daily_co2, emission_level }) {
    const max = 10;
    const pct = Math.min((daily_co2 / max) * 100, 100);

    const levelColors = {
        Low: ['#1A7A4A', '#4CAF50'],
        Medium: ['#C8932A', '#FFC107'],
        High: ['#C0392B', '#F44336'],
    };
    const [dark, light] = levelColors[emission_level] || levelColors.Medium;

    // SVG arc gauge — 180° semicircle
    const r = 70;
    const cx = 100, cy = 95;
    const startAngle = -180;
    const sweepAngle = 180;
    const angleRange = sweepAngle;

    const toRad = (deg) => (deg * Math.PI) / 180;
    const arcPath = (start, end, radius) => {
        const s = toRad(start);
        const e = toRad(end);
        return `M ${cx + radius * Math.cos(s)} ${cy + radius * Math.sin(s)}
            A ${radius} ${radius} 0 ${end - start > 180 ? 1 : 0} 1
            ${cx + radius * Math.cos(e)} ${cy + radius * Math.sin(e)}`;
    };

    const fillEnd = startAngle + (pct / 100) * angleRange;

    // Tick marks
    const ticks = [0, 2, 4, 6, 8, 10];

    return (
        <div style={{ textAlign: 'center' }}>
            <svg width="200" height="110" viewBox="0 0 200 110" style={{ overflow: 'visible' }}>
                {/* Background arc */}
                <path
                    d={arcPath(-180, 0, r)}
                    fill="none"
                    stroke="#E8ECF0"
                    strokeWidth="14"
                    strokeLinecap="round"
                />

                {/* Coloured fill arc */}
                <path
                    d={arcPath(-180, Math.min(fillEnd, -0.5), r)}
                    fill="none"
                    stroke={`url(#gaugeGrad)`}
                    strokeWidth="14"
                    strokeLinecap="round"
                    style={{ transition: 'all 1s ease' }}
                />

                {/* Gradient definition */}
                <defs>
                    <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1A7A4A" />
                        <stop offset="50%" stopColor="#C8932A" />
                        <stop offset="100%" stopColor="#C0392B" />
                    </linearGradient>
                </defs>

                {/* Tick marks and labels */}
                {ticks.map((val) => {
                    const angle = -180 + (val / max) * 180;
                    const rad = toRad(angle);
                    const innerR = r - 10;
                    const outerR = r + 4;
                    const labelR = r + 18;
                    return (
                        <g key={val}>
                            <line
                                x1={cx + innerR * Math.cos(rad)}
                                y1={cy + innerR * Math.sin(rad)}
                                x2={cx + outerR * Math.cos(rad)}
                                y2={cy + outerR * Math.sin(rad)}
                                stroke="#D0D7E0" strokeWidth={1.5}
                            />
                            <text
                                x={cx + labelR * Math.cos(rad)}
                                y={cy + labelR * Math.sin(rad)}
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize="9"
                                fill="#8A9BB0"
                            >{val}</text>
                        </g>
                    );
                })}

                {/* Needle */}
                {(() => {
                    const needleAngle = -180 + (Math.min(daily_co2, max) / max) * 180;
                    const rad = toRad(needleAngle);
                    const nx = cx + (r - 8) * Math.cos(rad);
                    const ny = cy + (r - 8) * Math.sin(rad);
                    return (
                        <g style={{ transition: 'all 1s ease' }}>
                            <line
                                x1={cx} y1={cy}
                                x2={nx} y2={ny}
                                stroke={dark} strokeWidth={2.5} strokeLinecap="round"
                            />
                            <circle cx={cx} cy={cy} r={5} fill={dark} />
                            <circle cx={cx} cy={cy} r={3} fill="#fff" />
                        </g>
                    );
                })()}

                {/* Centre value */}
                <text x={cx} y={cy + 22} textAnchor="middle"
                    fontSize="20" fontWeight="800" fill="#1B2A4A"
                    fontFamily="'Poppins',sans-serif">
                    {daily_co2}
                </text>
                <text x={cx} y={cy + 36} textAnchor="middle"
                    fontSize="9" fill="#8A9BB0" fontWeight="500">
                    kg CO₂/day
                </text>
            </svg>

            {/* Level badge */}
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 14px', borderRadius: 100,
                background: dark + '18', border: `1px solid ${dark}40`,
                fontSize: 12, fontWeight: 700, color: dark, marginTop: 4,
            }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: dark }} />
                {emission_level} Emissions
            </div>
        </div>
    );
}