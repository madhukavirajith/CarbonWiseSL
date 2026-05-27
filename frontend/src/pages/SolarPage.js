import React, { useState } from 'react';
import { solarRoi } from '../api';
import {
    Sun,
    Zap,
    Coins,
    Leaf,
    Calendar,
    AlertTriangle,
    AlertCircle,
    CheckCircle2,
    Loader2
} from 'lucide-react';

const Input = ({ label, name, type = 'number', value, onChange, min, max, step, unit, hint }) => (
    <div style={{ marginBottom: 20 }}>
        <div style={{
            display: 'flex', justifyContent: 'space-between', marginBottom: 6,
        }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A' }}>{label}</label>
            {unit && <span style={{ fontSize: 12, color: '#8A9BB0' }}>{unit}</span>}
        </div>
        <input
            type={type} name={name} value={value} onChange={onChange}
            min={min} max={max} step={step}
            style={{
                width: '100%', padding: '11px 14px', borderRadius: 9,
                border: '1.5px solid #D0D7E0', fontSize: 14, color: '#1B2A4A',
                background: '#fff', outline: 'none',
                transition: 'border-color 0.2s', boxSizing: 'border-box',
            }}
            onFocus={e => e.target.style.borderColor = '#0D7680'}
            onBlur={e => e.target.style.borderColor = '#D0D7E0'}
        />
        {hint && (
            <div style={{ fontSize: 11, color: '#8A9BB0', marginTop: 4 }}>{hint}</div>
        )}
    </div>
);

const ResultCard = ({ icon: Icon, label, value, sub, color, big }) => (
    <div style={{
        background: '#fff', borderRadius: 14, padding: '22px 20px',
        border: `1.5px solid ${color}25`,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
    }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
        <div style={{ color: color, marginBottom: 10, display: 'flex' }}>
            <Icon size={26} />
        </div>
        <div style={{
            fontSize: 11, fontWeight: 700, color: color,
            textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6,
        }}>{label}</div>
        <div style={{
            fontSize: big ? 30 : 24, fontWeight: 800, color: '#1B2A4A',
            fontFamily: "'Poppins',sans-serif", lineHeight: 1, marginBottom: 4,
        }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: '#8A9BB0', marginTop: 4 }}>{sub}</div>}
    </div>
);

export default function SolarPage() {
    const [form, setForm] = useState({
        city: 'Colombo',
        roof_area_sqm: 20,
        installation_cost_lkr: 500000,
        monthly_ceb_units: 180,
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const change = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: name === 'city' ? value : (parseFloat(value) || 0),
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await solarRoi(form);
            setResult(res.data);
        } catch (err) {
            setError(err.message || 'Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const irradiance = { Colombo: 4.5, Kandy: 4.2, Galle: 4.6 };

    return (
        <div style={{ paddingTop: 80, background: '#F4F6F8', minHeight: '100vh' }}>

            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg,#C8932A 0%,#1B2A4A 100%)',
                padding: '48px 24px 64px', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', top: -60, right: -60, width: 280, height: 280,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,rgba(200,147,42,0.25),transparent 70%)',
                }} />
                <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(200,147,42,0.20)',
                        border: '1px solid rgba(200,147,42,0.40)',
                        borderRadius: 100, padding: '5px 14px', marginBottom: 18,
                    }}>
                        <Sun size={14} color="#FDF6E3" />
                        <span style={{ fontSize: 12, color: '#FDF6E3', fontWeight: 600 }}>
                            Uses SLSEA Solar Irradiance Data — Colombo, Kandy, Galle
                        </span>
                    </div>
                    <h1 style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 'clamp(26px,3.5vw,38px)',
                        fontWeight: 800, color: '#fff', marginBottom: 12,
                    }}>
                        Solar Panel ROI Calculator
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', maxWidth: 520, lineHeight: 1.7 }}>
                        Find out whether rooftop solar makes financial sense for your Sri Lankan home.
                        Enter your roof area and city, get annual generation, bill savings, CO₂ offset,
                        and payback period — all using official SLSEA data.
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1000, margin: '-28px auto 60px', padding: '0 24px' }}>
                <div className="responsive-grid-2">
                    {/* Form card */}
                    <div className="responsive-padding-card" style={{
                        background: '#fff', borderRadius: 20,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        border: '1px solid #E8ECF0',
                    }}>
                        <h2 style={{
                            fontSize: 18, fontWeight: 800, color: '#1B2A4A',
                            fontFamily: "'Poppins',sans-serif", marginBottom: 6,
                        }}>Enter Your Details</h2>
                        <p style={{ fontSize: 13, color: '#8A9BB0', marginBottom: 24 }}>
                            All values used are from official Sri Lankan sources.
                        </p>

                        <form onSubmit={submit}>
                            {/* City */}
                            <div style={{ marginBottom: 20 }}>
                                <label style={{
                                    fontSize: 13, fontWeight: 600, color: '#1B2A4A',
                                    display: 'block', marginBottom: 6
                                }}>City</label>
                                <select name="city" value={form.city} onChange={change} style={{
                                    width: '100%', padding: '11px 14px', borderRadius: 9,
                                    border: '1.5px solid #D0D7E0', fontSize: 14, color: '#1B2A4A',
                                    background: '#fff', outline: 'none', cursor: 'pointer',
                                    boxSizing: 'border-box',
                                }}>
                                    <option>Colombo</option>
                                    <option>Kandy</option>
                                    <option>Galle</option>
                                </select>
                                <div style={{ fontSize: 11, color: '#8A9BB0', marginTop: 4 }}>
                                    Solar irradiance: {irradiance[form.city]} kWh/m²/day (SLSEA)
                                </div>
                            </div>

                            <Input
                                label="Available Roof Area" name="roof_area_sqm"
                                value={form.roof_area_sqm} onChange={change}
                                min={1} max={500} step={1} unit="m²"
                                hint="Usable area facing south or east/west. Exclude shaded areas."
                            />
                            <Input
                                label="Estimated Installation Cost" name="installation_cost_lkr"
                                value={form.installation_cost_lkr} onChange={change}
                                min={50000} max={10000000} step={10000} unit="LKR"
                                hint="Typical 1 kW system: LKR 150,000–200,000 installed (2024 rates)"
                            />
                            <Input
                                label="Current Monthly CEB Units" name="monthly_ceb_units"
                                value={form.monthly_ceb_units} onChange={change}
                                min={0} max={600} step={5} unit="units"
                                hint="From your latest CEB bill"
                            />

                            {/* Live estimate */}
                            <div style={{
                                padding: '14px 16px', borderRadius: 10,
                                background: '#FDF6E3', border: '1px solid #C8932A30',
                                marginBottom: 20, fontSize: 13,
                             }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#C8932A', marginBottom: 4 }}>
                                    <Sun size={14} /> Quick Estimate
                                </div>
                                <div style={{ color: '#5A6A7A', lineHeight: 1.7 }}>
                                    System size: ~<strong>{(form.roof_area_sqm * 0.18).toFixed(1)} kW</strong>
                                    {' '} · Est. annual output:{' '}
                                    <strong>{Math.round(form.roof_area_sqm * 0.18 * irradiance[form.city] * 365)} kWh</strong>
                                </div>
                            </div>

                            {error && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '12px 16px', borderRadius: 9,
                                    background: '#FDECEA', color: '#C0392B',
                                    fontSize: 13, marginBottom: 16,
                                }}>
                                    <AlertTriangle size={16} /> {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading} style={{
                                width: '100%', padding: '14px', borderRadius: 10,
                                fontSize: 15, fontWeight: 700,
                                background: loading
                                    ? '#E8ECF0'
                                    : 'linear-gradient(135deg,#C8932A,#a67420)',
                                color: loading ? '#B0B8C4' : '#fff',
                                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: loading ? 'none' : '0 4px 16px rgba(200,147,42,0.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            }}>
                                {loading ? (
                                    <>
                                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Calculating…
                                    </>
                                ) : (
                                    <>
                                        <Sun size={16} /> Calculate Solar ROI
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Results card */}
                    <div>
                        {!result ? (
                            <div style={{
                                background: '#fff', borderRadius: 20, padding: '40px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                                border: '2px dashed #D0D7E0',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                minHeight: 400, textAlign: 'center',
                            }}>
                                <span style={{ color: '#8A9BB0', marginBottom: 20, display: 'flex' }}>
                                    <Sun size={56} />
                                </span>
                                <h3 style={{
                                    fontSize: 18, fontWeight: 700, color: '#1B2A4A',
                                    fontFamily: "'Poppins',sans-serif", marginBottom: 10,
                                }}>Your Solar ROI Will Appear Here</h3>
                                <p style={{ fontSize: 13, color: '#8A9BB0', maxWidth: 280, lineHeight: 1.7 }}>
                                    Fill in the form on the left and click Calculate to see your
                                    annual savings, CO₂ offset, and payback period.
                                </p>
                            </div>
                        ) : (
                            <div className="animate-fadeIn">
                                <div style={{ marginBottom: 16 }}>
                                    <h2 style={{
                                        fontSize: 18, fontWeight: 800, color: '#1B2A4A',
                                        fontFamily: "'Poppins',sans-serif", marginBottom: 4,
                                    }}>
                                        Solar ROI Results — {result.city}
                                    </h2>
                                    <p style={{ fontSize: 13, color: '#8A9BB0' }}>
                                        {result.system_size_kw} kW system · {result.irradiance_used} kWh/m²/day
                                    </p>
                                </div>

                                <div className="responsive-grid-2" style={{ gap: 12, marginBottom: 16 }}>
                                    <ResultCard
                                        icon={Zap} label="Annual Generation"
                                        value={result.annual_kwh_generated.toLocaleString()}
                                        sub="kWh per year"
                                        color="#C8932A" big
                                    />
                                    <ResultCard
                                        icon={Coins} label="Annual Bill Saving"
                                        value={`LKR ${Math.round(result.annual_cost_saving_lkr).toLocaleString()}`}
                                        sub={`LKR ${Math.round(result.monthly_cost_saving_lkr).toLocaleString()} / month`}
                                        color="#1A7A4A"
                                    />
                                    <ResultCard
                                        icon={Leaf} label="Lifetime CO₂ Saved"
                                        value={`${Math.round(result.lifetime_co2_saving_kg).toLocaleString()} kg`}
                                        sub="Over 25 years"
                                        color="#0D7680"
                                    />
                                    <ResultCard
                                        icon={Calendar} label="Payback Period"
                                        value={`${result.payback_years} years`}
                                        sub="Return on investment"
                                        color={result.payback_years < 8 ? '#1A7A4A' : '#C8932A'}
                                        big
                                    />
                                </div>

                                {/* Verdict */}
                                <div style={{
                                    padding: '18px 20px', borderRadius: 14,
                                    background: result.payback_years < 8 ? '#E8F5EE' : '#FDF6E3',
                                    border: `1.5px solid ${result.payback_years < 8 ? '#1A7A4A' : '#C8932A'}30`,
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        fontSize: 14, fontWeight: 700,
                                        color: result.payback_years < 8 ? '#1A7A4A' : '#C8932A',
                                        marginBottom: 6,
                                    }}>
                                        {(() => {
                                            if (result.payback_years < 6) {
                                                return (
                                                    <>
                                                        <CheckCircle2 size={16} /> Excellent Investment
                                                    </>
                                                );
                                            } else if (result.payback_years < 10) {
                                                return (
                                                    <>
                                                        <AlertCircle size={16} /> Good Investment
                                                    </>
                                                );
                                            } else {
                                                return (
                                                    <>
                                                        <AlertTriangle size={16} /> Marginal — Consider Smaller System
                                                    </>
                                                );
                                            }
                                        })()}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#5A6A7A', lineHeight: 1.7 }}>
                                        A {result.system_size_kw} kW system on your {form.roof_area_sqm} m² roof in{' '}
                                        {result.city} would generate{' '}
                                        <strong>{result.annual_kwh_generated.toLocaleString()} kWh/year</strong>,
                                        saving you <strong>LKR {Math.round(result.annual_cost_saving_lkr).toLocaleString()}/year</strong> on
                                        your CEB bill and offsetting{' '}
                                        <strong>{Math.round(result.lifetime_co2_saving_kg).toLocaleString()} kg CO₂</strong> over
                                        the panel's lifetime. Payback in{' '}
                                        <strong>{result.payback_years} years</strong>.
                                    </div>
                                </div>

                                <div style={{ marginTop: 12, fontSize: 11, color: '#B0B8C4', lineHeight: 1.6 }}>
                                    Calculation uses SLSEA solar irradiance data, 18% monocrystalline panel efficiency,
                                    CEB net metering export rate (LKR 22/kWh), and 25-year panel lifetime.
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}