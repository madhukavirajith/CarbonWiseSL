// frontend/src/components/WhatIfSimulator.js
import React, { useState } from 'react';
import { simulate } from '../api';
import { 
    Snowflake, 
    Clock, 
    Lightbulb, 
    WashingMachine, 
    Plug, 
    Zap, 
    Play, 
    Loader2, 
    Flame, 
    CheckCircle2, 
    Droplets, 
    FileText, 
    AlertTriangle 
} from 'lucide-react';

const scenarios = [
    {
        id: 'ac_temp',
        icon: Snowflake,
        title: 'Lower AC Temperature Setting',
        desc: 'What if you set AC to a higher (more efficient) temperature?',
        inputLabel: 'New temperature (°C)',
        min: 20, max: 30, step: 1, defaultVal: 26,
        unit: '°C',
    },
    {
        id: 'ac_hours',
        icon: Clock,
        title: 'Reduce AC Runtime',
        desc: 'What if you run the AC fewer hours per day?',
        inputLabel: 'New daily runtime (hours)',
        min: 0, max: 16, step: 0.5, defaultVal: 4,
        unit: ' hrs/day',
    },
    {
        id: 'led_upgrade',
        icon: Lightbulb,
        title: 'Replace All Bulbs with LED',
        desc: 'What if you replaced every old and fluorescent bulb with 9W LEDs?',
        inputLabel: 'Total bulbs to replace',
        min: 1, max: 30, step: 1, defaultVal: 4,
        unit: ' bulbs',
    },
    {
        id: 'washer_shift',
        icon: WashingMachine,
        title: 'Reduce Washing Machine Loads',
        desc: 'What if you reduced your weekly washing loads?',
        inputLabel: 'New loads per week',
        min: 0, max: 14, step: 1, defaultVal: 4,
        unit: ' loads/wk',
    },
    {
        id: 'standby',
        icon: Plug,
        title: 'Eliminate Standby Power',
        desc: 'What if you turned off devices fully instead of leaving on standby?',
        inputLabel: 'Devices to switch off',
        min: 1, max: 10, step: 1, defaultVal: 3,
        unit: ' devices',
    },
];

function ImpactBadge({ label }) {
    const config = {
        'High Impact': { bg: '#E8F5EE', color: '#1A7A4A', icon: Flame },
        'Medium Impact': { bg: '#FDF6E3', color: '#C8932A', icon: CheckCircle2 },
        'Low Impact': { bg: '#F4F6F8', color: '#8A9BB0', icon: Droplets },
    };
    const c = config[label] || config['Low Impact'];
    const Icon = c.icon;
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '3px 10px', borderRadius: 100,
            background: c.bg, color: c.color,
            fontSize: 11, fontWeight: 700,
        }}>
            <Icon size={12} /> {label}
        </span>
    );
}

export default function WhatIfSimulator({ formData }) {
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState({});
    const [values, setValues] = useState(
        Object.fromEntries(scenarios.map(s => [s.id, s.defaultVal]))
    );

    const runScenario = async (scenario) => {
        setLoading(prev => ({ ...prev, [scenario.id]: true }));
        try {
            const res = await simulate({
                base: formData,
                scenario: scenario.id,
                new_value: values[scenario.id],
            });
            setResults(prev => ({ ...prev, [scenario.id]: res.data }));
        } catch (err) {
            setResults(prev => ({
                ...prev,
                [scenario.id]: { error: err.message },
            }));
        } finally {
            setLoading(prev => ({ ...prev, [scenario.id]: false }));
        }
    };

    const runAll = async () => {
        for (const sc of scenarios) {
            await runScenario(sc);
        }
    };

    return (
        <div>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: 20, flexWrap: 'wrap', gap: 12,
            }}>
                <div style={{ fontSize: 13, color: '#5A6A7A', maxWidth: 480, lineHeight: 1.6 }}>
                    Adjust any slider, then click <strong>Simulate</strong> to instantly see
                    how much CO₂ and money you would save with that change.
                </div>
                <button onClick={runAll} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '10px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700,
                    background: 'linear-gradient(135deg,#1B2A4A,#0D3B45)',
                    color: '#fff', border: 'none', cursor: 'pointer',
                    boxShadow: '0 3px 10px rgba(27,42,74,0.25)',
                }}>
                    <Zap size={14} /> Simulate All
                </button>
            </div>

            {/* Scenario cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {scenarios.map(sc => {
                    const result = results[sc.id];
                    const isLoading = loading[sc.id];
                    const hasResult = result && !result.error;
                    const IconComponent = sc.icon;

                    return (
                        <div key={sc.id} style={{
                            background: '#fff', borderRadius: 14,
                            border: '1.5px solid #E8ECF0',
                            overflow: 'hidden',
                            boxShadow: hasResult ? '0 4px 16px rgba(13,118,128,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
                            transition: 'box-shadow 0.3s',
                        }}>
                            <div style={{ padding: '20px 22px' }}>
                                {/* Title row */}
                                <div style={{
                                    display: 'flex', alignItems: 'flex-start',
                                    justifyContent: 'space-between', gap: 12, marginBottom: 14,
                                }}>
                                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                        <span style={{ 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            width: 40, height: 40, borderRadius: 10, 
                                            background: '#E6F4F5', color: '#0D7680', flexShrink: 0 
                                        }}>
                                            <IconComponent size={20} />
                                        </span>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 700, color: '#1B2A4A', marginBottom: 3 }}>
                                                {sc.title}
                                            </div>
                                            <div style={{ fontSize: 12, color: '#8A9BB0' }}>{sc.desc}</div>
                                        </div>
                                    </div>
                                    {hasResult && <ImpactBadge label={result.impact_label} />}
                                </div>

                                {/* Slider */}
                                <div style={{ marginBottom: 14 }}>
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between', marginBottom: 6,
                                    }}>
                                        <label style={{ fontSize: 12, fontWeight: 600, color: '#5A6A7A' }}>
                                            {sc.inputLabel}
                                        </label>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#0D7680' }}>
                                            {values[sc.id]}{sc.unit}
                                        </span>
                                    </div>
                                    <input type="range"
                                        min={sc.min} max={sc.max} step={sc.step}
                                        value={values[sc.id]}
                                        onChange={e => setValues(prev => ({
                                            ...prev, [sc.id]: parseFloat(e.target.value),
                                        }))}
                                        style={{ width: '100%', accentColor: '#0D7680', cursor: 'pointer' }}
                                    />
                                    <div style={{
                                        display: 'flex', justifyContent: 'space-between',
                                        fontSize: 10, color: '#B0B8C4', marginTop: 2,
                                    }}>
                                        <span>{sc.min}{sc.unit}</span>
                                        <span>{sc.max}{sc.unit}</span>
                                    </div>
                                </div>

                                {/* Simulate button */}
                                <button onClick={() => runScenario(sc)} disabled={isLoading}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 6,
                                        padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600,
                                        background: isLoading
                                            ? '#E8ECF0'
                                            : 'linear-gradient(135deg,#0D7680,#0a5d65)',
                                        color: isLoading ? '#B0B8C4' : '#fff',
                                        border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                    }}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                                            Running…
                                        </>
                                    ) : (
                                        <>
                                            <Play size={14} fill="currentColor" />
                                            Simulate
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Result panel */}
                            {hasResult && (
                                <div style={{
                                    borderTop: '1px solid #E8ECF0',
                                    padding: '16px 22px',
                                    background: 'linear-gradient(135deg,#E6F4F5,#F4F6F8)',
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))',
                                        gap: 12,
                                    }}>
                                        {[
                                            {
                                                label: 'CO₂ Saving/Day',
                                                value: result.co2_saving_kg_day > 0
                                                    ? `-${result.co2_saving_kg_day} kg`
                                                    : `+${Math.abs(result.co2_saving_kg_day)} kg`,
                                                color: result.co2_saving_kg_day > 0 ? '#1A7A4A' : '#C0392B',
                                            },
                                            {
                                                label: 'CO₂ Saving/Month',
                                                value: result.co2_saving_kg_day > 0
                                                    ? `-${result.co2_saving_kg_month} kg`
                                                    : `+${Math.abs(result.co2_saving_kg_month)} kg`,
                                                color: result.co2_saving_kg_day > 0 ? '#1A7A4A' : '#C0392B',
                                            },
                                            {
                                                label: 'Cost Saving/Month',
                                                value: `LKR ${result.cost_saving_lkr_month.toLocaleString()}`,
                                                color: '#C8932A',
                                            },
                                            {
                                                label: 'Reduction %',
                                                value: `${result.co2_saving_pct}%`,
                                                color: result.co2_saving_pct > 0 ? '#1A7A4A' : '#C0392B',
                                            },
                                        ].map(m => (
                                            <div key={m.label} style={{
                                                background: '#fff', borderRadius: 10, padding: '12px 14px',
                                                border: '1px solid #E8ECF0',
                                            }}>
                                                <div style={{ fontSize: 11, color: '#8A9BB0', marginBottom: 4, fontWeight: 600 }}>
                                                    {m.label}
                                                </div>
                                                <div style={{
                                                    fontSize: 18, fontWeight: 800, color: m.color,
                                                    fontFamily: "'Poppins',sans-serif"
                                                }}>
                                                    {m.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: 12, color: '#5A6A7A', marginTop: 12 }}>
                                        <FileText size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                                        <span>{result.description}</span>
                                    </div>
                                </div>
                            )}

                            {result?.error && (
                                <div style={{
                                    borderTop: '1px solid #FDECEA', padding: '12px 22px',
                                    background: '#FDECEA', fontSize: 13, color: '#C0392B',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}>
                                    <AlertTriangle size={14} />
                                    <span>{result.error}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}