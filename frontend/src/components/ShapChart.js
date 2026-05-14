// frontend/src/components/ShapChart.js
import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from 'recharts';

/* Custom tooltip */
const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
        <div style={{
            background: '#1B2A4A', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10, padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#B2DDE0', marginBottom: 6 }}>
                {d.label}
            </div>
            <div style={{
                fontSize: 14, fontWeight: 700,
                color: d.shap_value > 0 ? '#FF8A80' : '#80CBC4', marginBottom: 4
            }}>
                {d.shap_value > 0 ? '+' : ''}{d.shap_value.toFixed(4)} kg CO₂/day
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>
                {d.direction === 'increases' ? '↑ Increases' : '↓ Decreases'} your emissions
                ({d.contribution_pct}% of total)
            </div>
        </div>
    );
};

export default function ShapChart({ explanation }) {
    const [showAll, setShowAll] = useState(false);

    if (!explanation) return null;

    const { shap_values, base_value, predicted_co2, top_culprit } = explanation;

    // Filter to show only features with non-trivial SHAP values
    const significant = shap_values.filter(sv => Math.abs(sv.shap_value) > 0.001);
    const display = showAll ? significant : significant.slice(0, 8);

    const chartData = display.map(sv => ({
        label: sv.label,
        shap_value: sv.shap_value,
        contribution_pct: sv.contribution_pct,
        direction: sv.direction,
        absVal: Math.abs(sv.shap_value),
    }));

    // Sort by absolute value descending for chart
    chartData.sort((a, b) => b.absVal - a.absVal);

    return (
        <div>
            {/* Header insight */}
            <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '16px 20px', borderRadius: 12,
                background: '#FDECEA', border: '1px solid #C0392B30',
                marginBottom: 20,
            }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>🔍</span>
                <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#C0392B', marginBottom: 4 }}>
                        Biggest Culprit: {top_culprit}
                    </div>
                    <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.6 }}>
                        SHAP analysis shows <strong>{top_culprit}</strong> contributes the most to your
                        total predicted emission of <strong>{predicted_co2} kg CO₂/day</strong>.
                        Red bars increase your footprint. Green bars reduce it.
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div style={{
                background: '#1B2A4A', borderRadius: 16, padding: '24px 12px 16px',
                marginBottom: 16,
            }}>
                <div style={{
                    fontSize: 12, color: '#B2DDE0', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: 1.2,
                    paddingLeft: 12, marginBottom: 16,
                }}>
                    Appliance CO₂ Contribution (kg/day)
                </div>
                <ResponsiveContainer width="100%" height={Math.max(280, chartData.length * 38)}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 0, right: 60, bottom: 0, left: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                        <XAxis
                            type="number"
                            tick={{ fill: 'rgba(255,255,255,0.50)', fontSize: 11 }}
                            axisLine={{ stroke: 'rgba(255,255,255,0.15)' }}
                            tickLine={false}
                            tickFormatter={v => `${v > 0 ? '+' : ''}${v.toFixed(2)}`}
                        />
                        <YAxis
                            type="category"
                            dataKey="label"
                            width={130}
                            tick={{ fill: 'rgba(255,255,255,0.75)', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <ReferenceLine x={0} stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                        <Bar dataKey="shap_value" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, i) => (
                                <Cell
                                    key={i}
                                    fill={entry.shap_value > 0 ? '#E57373' : '#4DB6AC'}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex', gap: 20, marginBottom: 16,
                fontSize: 12, color: '#5A6A7A',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: '#E57373' }} />
                    Increases your CO₂
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: '#4DB6AC' }} />
                    Decreases your CO₂
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 2, background: '#8A9BB0' }} />
                    Base value: {base_value.toFixed(3)} kg
                </div>
            </div>

            {/* Breakdown table */}
            <div style={{
                background: '#fff', borderRadius: 12,
                border: '1px solid #E8ECF0', overflow: 'hidden', marginBottom: 12,
            }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr auto auto',
                    padding: '10px 16px',
                    background: '#F4F6F8',
                    fontSize: 11, fontWeight: 700, color: '#8A9BB0',
                    textTransform: 'uppercase', letterSpacing: 1,
                    borderBottom: '1px solid #E8ECF0',
                }}>
                    <span>Appliance</span>
                    <span style={{ textAlign: 'right', paddingRight: 24 }}>Impact</span>
                    <span style={{ textAlign: 'right' }}>Share</span>
                </div>
                {display.map((sv, i) => (
                    <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '1fr auto auto',
                        padding: '10px 16px',
                        borderBottom: i < display.length - 1 ? '1px solid #F4F6F8' : 'none',
                        background: i % 2 === 0 ? '#fff' : '#FAFBFC',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1B2A4A' }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                                background: sv.shap_value > 0 ? '#E57373' : '#4DB6AC',
                            }} />
                            {sv.label}
                        </div>
                        <div style={{
                            fontSize: 13, fontWeight: 700, paddingRight: 24,
                            color: sv.shap_value > 0 ? '#C0392B' : '#1A7A4A',
                            textAlign: 'right',
                        }}>
                            {sv.shap_value > 0 ? '+' : ''}{sv.shap_value.toFixed(4)} kg
                        </div>
                        <div style={{
                            fontSize: 12, color: '#8A9BB0', textAlign: 'right',
                            minWidth: 40,
                        }}>
                            {sv.contribution_pct}%
                        </div>
                    </div>
                ))}
            </div>

            {significant.length > 8 && (
                <button onClick={() => setShowAll(v => !v)} style={{
                    background: 'none', border: '1.5px solid #D0D7E0',
                    borderRadius: 8, padding: '8px 18px',
                    fontSize: 13, fontWeight: 600, color: '#0D7680', cursor: 'pointer',
                    width: '100%',
                }}>
                    {showAll ? '▲ Show less' : `▼ Show all ${significant.length} features`}
                </button>
            )}
        </div>
    );
}