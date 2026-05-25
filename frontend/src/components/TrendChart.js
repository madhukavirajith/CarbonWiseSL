import React from 'react';
import { BarChart2 } from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: '#1B2A4A', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10, padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        }}>
            <div style={{ fontSize: 12, color: '#B2DDE0', marginBottom: 6 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ fontSize: 14, fontWeight: 700, color: p.color }}>
                    {p.value} kg CO₂/day
                </div>
            ))}
        </div>
    );
};

export default function TrendChart({ records }) {
    if (!records || records.length === 0) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 12, padding: '40px 20px',
                color: '#8A9BB0', fontSize: 14,
            }}>
                <BarChart2 size={36} color="#8A9BB0" />
                <span>No trend data yet. Submit more predictions to see your progress.</span>
            </div>
        );
    }

    const data = records.map((r, i) => ({
        name: `Entry ${i + 1}`,
        co2: r.prediction?.daily_co2_kg ?? 0,
        date: r.prediction?.timestamp
            ? new Date(r.prediction.timestamp).toLocaleDateString('en-GB')
            : `#${i + 1}`,
    }));

    const avg = data.reduce((s, d) => s + d.co2, 0) / data.length;
    const min = Math.min(...data.map(d => d.co2));
    const max = Math.max(...data.map(d => d.co2));
    const latest = data[data.length - 1]?.co2;
    const trend = data.length > 1
        ? latest - data[0].co2
        : 0;

    return (
        <div>
            {/* Mini stats */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
                gap: 10, marginBottom: 20,
            }}>
                {[
                    { label: 'Latest', value: `${latest} kg`, color: '#0D7680' },
                    { label: 'Average', value: `${avg.toFixed(2)} kg`, color: '#7B3F9E' },
                    { label: 'Best', value: `${min} kg`, color: '#1A7A4A' },
                    {
                        label: 'Trend',
                        value: `${trend > 0 ? '+' : ''}${trend.toFixed(2)} kg`,
                        color: trend <= 0 ? '#1A7A4A' : '#C0392B',
                    },
                ].map(s => (
                    <div key={s.label} style={{
                        background: '#fff', borderRadius: 10, padding: '12px',
                        border: '1px solid #E8ECF0', textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: 10, color: '#8A9BB0', fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4
                        }}>
                            {s.label}
                        </div>
                        <div style={{
                            fontSize: 16, fontWeight: 800, color: s.color,
                            fontFamily: "'Poppins',sans-serif"
                        }}>
                            {s.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart */}
            <div style={{
                background: '#1B2A4A', borderRadius: 16, padding: '20px 8px 12px',
            }}>
                <div style={{
                    fontSize: 11, color: '#B2DDE0', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: 1.2,
                    paddingLeft: 16, marginBottom: 12,
                }}>
                    Daily CO₂ Trend (kg/day)
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <defs>
                            <linearGradient id="co2Grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0D7680" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#0D7680" stopOpacity={0.0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
                            axisLine={false} tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11 }}
                            axisLine={false} tickLine={false}
                            tickFormatter={v => `${v}`}
                        />
                        <ReferenceLine
                            y={5.5} stroke="rgba(200,147,42,0.5)"
                            strokeDasharray="4 4" label={{
                                value: 'SL Avg', fill: '#C8932A', fontSize: 10, position: 'right',
                            }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone" dataKey="co2"
                            stroke="#0D7680" strokeWidth={2.5}
                            fill="url(#co2Grad)"
                            dot={{ fill: '#0D7680', r: 4, strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: '#4ECDC4' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div style={{ fontSize: 11, color: '#8A9BB0', marginTop: 8, textAlign: 'right' }}>
                Orange dashed line = Sri Lankan urban average (5.5 kg/day)
            </div>
        </div>
    );
}