// frontend/src/components/ApplianceForm.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Home, Refrigerator, Snowflake, Fan, ShowerHead, Tv, WashingMachine, 
    Laptop, CookingPot, Microwave, Shirt, ChefHat, Lightbulb, Sun, 
    BarChart3, AlertTriangle, Zap, ArrowLeft, ArrowRight 
} from 'lucide-react';
import { predictEmissions, explainPrediction, getCluster } from '../api';
import { AppContext } from '../App';
import Loader from './Loader';

/* ── Field primitives ──────────────────────────────────────────── */
const Label = ({ children }) => (
    <label style={{ fontSize: 13, fontWeight: 600, color: '#1B2A4A', marginBottom: 6, display: 'block' }}>
        {children}
    </label>
);

const Input = ({ ...props }) => (
    <input {...props} style={{
        width: '100%', padding: '10px 14px', borderRadius: 8,
        border: '1.5px solid #D0D7E0', fontSize: 14, color: '#1B2A4A',
        background: '#fff', outline: 'none', transition: 'border-color 0.2s',
        ...props.style,
    }}
        onFocus={e => e.target.style.borderColor = '#0D7680'}
        onBlur={e => e.target.style.borderColor = '#D0D7E0'} />
);

const Select = ({ children, ...props }) => (
    <select {...props} style={{
        width: '100%', padding: '10px 14px', borderRadius: 8,
        border: '1.5px solid #D0D7E0', fontSize: 14, color: '#1B2A4A',
        background: '#fff', outline: 'none', cursor: 'pointer',
        transition: 'border-color 0.2s', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A9BB0' stroke-width='1.5' fill='none'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
        ...props.style,
    }}
        onFocus={e => e.target.style.borderColor = '#0D7680'}
        onBlur={e => e.target.style.borderColor = '#D0D7E0'}>
        {children}
    </select>
);

const Slider = ({ label, name, min, max, step = 0.5, value, onChange, unit = '' }) => (
    <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <Label>{label}</Label>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0D7680' }}>
                {value}{unit}
            </span>
        </div>
        <input type="range" name={name} min={min} max={max} step={step}
            value={value} onChange={onChange}
            style={{ width: '100%', accentColor: '#0D7680', cursor: 'pointer' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 11, color: '#8A9BB0' }}>{min}{unit}</span>
            <span style={{ fontSize: 11, color: '#8A9BB0' }}>{max}{unit}</span>
        </div>
    </div>
);

const Toggle = ({ label, name, checked, onChange, icon }) => (
    <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderRadius: 10,
        background: checked ? '#E6F4F5' : '#F4F6F8',
        border: `1.5px solid ${checked ? '#0D7680' : '#E8ECF0'}`,
        cursor: 'pointer', transition: 'all 0.2s', marginBottom: 8,
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', color: checked ? '#0D7680' : '#8A9BB0' }}>
                {icon}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1B2A4A' }}>{label}</span>
        </div>
        <div style={{
            width: 44, height: 24, borderRadius: 12,
            background: checked ? '#0D7680' : '#D0D7E0',
            position: 'relative', transition: 'background 0.2s',
        }}>
            <div style={{
                position: 'absolute', top: 3, left: checked ? 22 : 3,
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }} />
        </div>
        <input type="checkbox" name={name} checked={checked} onChange={onChange}
            style={{ display: 'none' }} />
    </label>
);

const SectionCard = ({ title, icon, children }) => (
    <div style={{
        background: '#fff', borderRadius: 16, padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        border: '1px solid #E8ECF0', marginBottom: 20,
    }}>
        <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 20, paddingBottom: 14,
            borderBottom: '1px solid #F4F6F8',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', color: '#0D7680' }}>
                {icon}
            </div>
            <h3 style={{
                fontSize: 16, fontWeight: 700, color: '#1B2A4A', margin: 0,
                fontFamily: "'Poppins',sans-serif"
            }}>{title}</h3>
        </div>
        {children}
    </div>
);

const Grid2 = ({ children }) => (
    <div className="form-grid-2">
        {children}
    </div>
);

/* ── Default form values ────────────────────────────────────────── */
const DEFAULTS = {
    city: 'Colombo', occupants: 4, ceb_units: 180,
    has_ac: 0, ac_rooms: 1, ac_hours: 6, ac_temp: 24,
    has_fridge: 1, fridge_size: 'Medium (200-350L)',
    has_heater: 0, heater_type: 'None', heater_hours: 0,
    num_fans: 3, fan_hours: 8,
    num_tvs: 1, tv_type: 'LED/LCD', tv_hours: 4,
    has_washer: 0, washer_loads: 0,
    led_count: 6, old_bulb_count: 2, tube_light_count: 1, light_hours: 6,
    has_computer: 1, computer_type: 'Laptop', computer_hours: 5,
    has_rice_cooker: 1, rice_cooker_uses: 2,
    has_microwave: 0, microwave_hours: 0,
    has_iron: 0, iron_hours_week: 0,
    has_solar: 0, solar_kw: 0,
};

/* ── MAIN COMPONENT ─────────────────────────────────────────────── */
export default function ApplianceForm() {
    const [form, setForm] = useState(DEFAULTS);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(0); // multi-step form
    const { setFormData, setResults } = useContext(AppContext);
    const navigate = useNavigate();

    const totalSteps = 4;

    const change = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox'
                ? (checked ? 1 : 0)
                : (type === 'range' || type === 'number')
                    ? (parseFloat(value) || 0)
                    : value,
        }));
    };

    const submit = async () => {
        setLoading(true);
        setError('');
        try {
            const [predRes, explRes, clusterRes] = await Promise.all([
                predictEmissions(form),
                explainPrediction(form),
                getCluster(form),
            ]);
            const results = {
                prediction: predRes.data,
                explanation: explRes.data,
                cluster: clusterRes.data,
                timestamp: new Date().toISOString(),
            };
            setFormData(form);
            setResults(results);
            navigate('/results');
        } catch (err) {
            setError(err.message || 'Could not connect to the server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Running AI models — XGBoost · SHAP · K-Means…" />;

    const steps = ['Household', 'Cooling & Heating', 'Appliances', 'Lighting & Other'];

    return (
        <div>
            {/* Progress bar */}
            <div style={{ marginBottom: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    {steps.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                            onClick={() => setStep(i)}>
                            <div style={{
                                width: 28, height: 28, borderRadius: '50%', fontSize: 12, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: i <= step ? '#0D7680' : '#E8ECF0',
                                color: i <= step ? '#fff' : '#8A9BB0',
                                transition: 'all 0.3s',
                            }}>{i + 1}</div>
                            <span className="step-label" style={{
                                fontSize: 12, fontWeight: 600,
                                color: i === step ? '#0D7680' : '#8A9BB0',
                            }}>{s}</span>
                        </div>
                    ))}
                </div>
                <div style={{ height: 4, background: '#E8ECF0', borderRadius: 2 }}>
                    <div style={{
                        height: '100%', borderRadius: 2,
                        background: 'linear-gradient(90deg,#0D7680,#4ECDC4)',
                        width: `${((step + 1) / totalSteps) * 100}%`,
                        transition: 'width 0.4s ease',
                    }} />
                </div>
            </div>

            {/* ── STEP 0: Household basics ── */}
            {step === 0 && (
                <div className="animate-fadeUp">
                    <SectionCard title="Household Details" icon={<Home size={20} />}>
                        <Grid2>
                            <div>
                                <Label>City</Label>
                                <Select name="city" value={form.city} onChange={change}>
                                    <option>Colombo</option>
                                    <option>Kandy</option>
                                    <option>Galle</option>
                                </Select>
                            </div>
                            <div>
                                <Label>Last Month CEB Units</Label>
                                <Input type="number" name="ceb_units" value={form.ceb_units}
                                    onChange={change} min={0} max={600}
                                    placeholder="e.g. 180" />
                            </div>
                        </Grid2>
                        <div style={{ marginTop: 16 }}>
                            <Slider label="Number of Occupants" name="occupants"
                                min={1} max={10} step={1} value={form.occupants} onChange={change}
                                unit=" people" />
                        </div>
                    </SectionCard>

                    <SectionCard title="Refrigerator" icon={<Refrigerator size={20} />}>
                        <Toggle label="Has Refrigerator" name="has_fridge" icon={<Refrigerator size={18} />}
                            checked={form.has_fridge === 1} onChange={change} />
                        {form.has_fridge === 1 && (
                            <div style={{ marginTop: 12 }}>
                                <Label>Refrigerator Size</Label>
                                <Select name="fridge_size" value={form.fridge_size} onChange={change}>
                                    <option>Small (under 200L)</option>
                                    <option>Medium (200-350L)</option>
                                    <option>Large (over 350L)</option>
                                </Select>
                            </div>
                        )}
                    </SectionCard>
                </div>
            )}

            {/* ── STEP 1: Cooling & Heating ── */}
            {step === 1 && (
                <div className="animate-fadeUp">
                    <SectionCard title="Air Conditioner" icon={<Snowflake size={20} />}>
                        <Toggle label="Has Air Conditioner" name="has_ac" icon={<Snowflake size={18} />}
                            checked={form.has_ac === 1} onChange={change} />
                        {form.has_ac === 1 && (
                            <div style={{ marginTop: 12 }}>
                                <Slider label="Number of AC Rooms" name="ac_rooms"
                                    min={1} max={5} step={1} value={form.ac_rooms} onChange={change}
                                    unit=" rooms" />
                                <Slider label="Daily Usage Hours" name="ac_hours"
                                    min={0} max={24} step={0.5} value={form.ac_hours} onChange={change}
                                    unit=" hrs" />
                                <Slider label="Temperature Setting" name="ac_temp"
                                    min={16} max={30} step={1} value={form.ac_temp} onChange={change}
                                    unit="°C" />
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 8,
                                    padding: '10px 14px', borderRadius: 8, background: '#E6F4F5',
                                    fontSize: 13, color: '#0D7680', fontWeight: 500, marginTop: 4,
                                }}>
                                    <Lightbulb size={16} style={{ flexShrink: 0 }} />
                                    <span>Setting AC to 26°C instead of 22°C saves up to 30% of AC energy.</span>
                                </div>
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard title="Ceiling Fans" icon={<Fan size={20} />}>
                        <Slider label="Number of Fans" name="num_fans"
                            min={0} max={10} step={1} value={form.num_fans} onChange={change}
                            unit=" fans" />
                        <Slider label="Daily Usage Hours" name="fan_hours"
                            min={0} max={24} step={0.5} value={form.fan_hours} onChange={change}
                            unit=" hrs" />
                    </SectionCard>

                    <SectionCard title="Water Heater" icon={<ShowerHead size={20} />}>
                        <Toggle label="Has Water Heater" name="has_heater" icon={<ShowerHead size={18} />}
                            checked={form.has_heater === 1} onChange={change} />
                        {form.has_heater === 1 && (
                            <div style={{ marginTop: 12 }}>
                                <div style={{ marginBottom: 16 }}>
                                    <Label>Heater Type</Label>
                                    <Select name="heater_type" value={form.heater_type} onChange={change}>
                                        <option>Instant (3kW)</option>
                                        <option>Storage (2kW)</option>
                                        <option>Solar-assisted (1kW)</option>
                                    </Select>
                                </div>
                                <Slider label="Daily Usage Hours" name="heater_hours"
                                    min={0} max={4} step={0.25} value={form.heater_hours} onChange={change}
                                    unit=" hrs" />
                            </div>
                        )}
                    </SectionCard>
                </div>
            )}

            {/* ── STEP 2: Appliances ── */}
            {step === 2 && (
                <div className="animate-fadeUp">
                    <SectionCard title="Television" icon={<Tv size={20} />}>
                        <Grid2>
                            <div>
                                <Slider label="Number of TVs" name="num_tvs"
                                    min={0} max={5} step={1} value={form.num_tvs} onChange={change}
                                    unit="" />
                            </div>
                            <div>
                                <Label>TV Type</Label>
                                <Select name="tv_type" value={form.tv_type} onChange={change}>
                                    <option>LED/LCD</option>
                                    <option>OLED</option>
                                    <option>Old CRT</option>
                                </Select>
                            </div>
                        </Grid2>
                        <Slider label="Daily Usage Hours" name="tv_hours"
                            min={0} max={16} step={0.5} value={form.tv_hours} onChange={change}
                            unit=" hrs" />
                    </SectionCard>

                    <SectionCard title="Washing Machine" icon={<WashingMachine size={20} />}>
                        <Toggle label="Has Washing Machine" name="has_washer" icon={<WashingMachine size={18} />}
                            checked={form.has_washer === 1} onChange={change} />
                        {form.has_washer === 1 && (
                            <Slider label="Loads Per Week" name="washer_loads"
                                min={0} max={20} step={1} value={form.washer_loads} onChange={change}
                                unit=" loads" />
                        )}
                    </SectionCard>

                    <SectionCard title="Computer / Laptop" icon={<Laptop size={20} />}>
                        <Toggle label="Has Computer or Laptop" name="has_computer" icon={<Laptop size={18} />}
                            checked={form.has_computer === 1} onChange={change} />
                        {form.has_computer === 1 && (
                            <div style={{ marginTop: 12 }}>
                                <div style={{ marginBottom: 16 }}>
                                    <Label>Computer Type</Label>
                                    <Select name="computer_type" value={form.computer_type} onChange={change}>
                                        <option>Laptop</option>
                                        <option>Desktop</option>
                                        <option>Both</option>
                                    </Select>
                                </div>
                                <Slider label="Daily Usage Hours" name="computer_hours"
                                    min={0} max={16} step={0.5} value={form.computer_hours} onChange={change}
                                    unit=" hrs" />
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard title="Kitchen Appliances" icon={<ChefHat size={20} />}>
                        <Toggle label="Has Rice Cooker" name="has_rice_cooker" icon={<CookingPot size={18} />}
                            checked={form.has_rice_cooker === 1} onChange={change} />
                        {form.has_rice_cooker === 1 && (
                            <Slider label="Uses Per Day" name="rice_cooker_uses"
                                min={0} max={4} step={1} value={form.rice_cooker_uses} onChange={change}
                                unit="x" />
                        )}
                        <Toggle label="Has Microwave" name="has_microwave" icon={<Microwave size={18} />}
                            checked={form.has_microwave === 1} onChange={change} />
                        {form.has_microwave === 1 && (
                            <Slider label="Daily Usage Hours" name="microwave_hours"
                                min={0} max={3} step={0.25} value={form.microwave_hours} onChange={change}
                                unit=" hrs" />
                        )}
                        <Toggle label="Has Electric Iron" name="has_iron" icon={<Shirt size={18} />}
                            checked={form.has_iron === 1} onChange={change} />
                        {form.has_iron === 1 && (
                            <Slider label="Usage Hours Per Week" name="iron_hours_week"
                                min={0} max={10} step={0.5} value={form.iron_hours_week} onChange={change}
                                unit=" hrs/wk" />
                        )}
                    </SectionCard>
                </div>
            )}

            {/* ── STEP 3: Lighting & Solar ── */}
            {step === 3 && (
                <div className="animate-fadeUp">
                    <SectionCard title="Lighting" icon={<Lightbulb size={20} />}>
                        <Slider label="Number of LED Bulbs" name="led_count"
                            min={0} max={30} step={1} value={form.led_count} onChange={change}
                            unit=" bulbs" />
                        <Slider label="Old Fluorescent Bulbs (60W)" name="old_bulb_count"
                            min={0} max={20} step={1} value={form.old_bulb_count} onChange={change}
                            unit=" bulbs" />
                        <Slider label="Tube Lights (36W)" name="tube_light_count"
                            min={0} max={10} step={1} value={form.tube_light_count} onChange={change}
                            unit="" />
                        <Slider label="Daily Lighting Hours" name="light_hours"
                            min={0} max={16} step={0.5} value={form.light_hours} onChange={change}
                            unit=" hrs" />
                        {form.old_bulb_count > 0 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 14px', borderRadius: 8, background: '#FDF6E3',
                                fontSize: 13, color: '#C8932A', fontWeight: 500, marginTop: 4,
                            }}>
                                <Lightbulb size={16} style={{ flexShrink: 0 }} />
                                <span>
                                    Replacing {form.old_bulb_count} old bulb(s) with LED would save approximately{' '}
                                    {(form.old_bulb_count * form.light_hours * (0.055 - 0.009) * 0.52).toFixed(2)} kg CO₂/day.
                                </span>
                            </div>
                        )}
                    </SectionCard>

                    <SectionCard title="Solar Panels" icon={<Sun size={20} />}>
                        <Toggle label="Has Rooftop Solar Panels" name="has_solar" icon={<Sun size={18} />}
                            checked={form.has_solar === 1} onChange={change} />
                        {form.has_solar === 1 && (
                            <Slider label="Solar System Capacity" name="solar_kw"
                                min={1} max={20} step={0.5} value={form.solar_kw} onChange={change}
                                unit=" kW" />
                        )}
                        {form.has_solar === 0 && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                padding: '10px 14px', borderRadius: 8,
                                background: '#E6F4F5', fontSize: 13, color: '#0D7680', marginTop: 8,
                            }}>
                                <Sun size={16} style={{ flexShrink: 0 }} />
                                <span>
                                    Wondering if solar is worth it?{' '}
                                    <a href="/solar" style={{ color: '#0D7680', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        Use our Solar ROI Calculator <ArrowRight size={14} />
                                    </a>
                                </span>
                            </div>
                        )}
                    </SectionCard>

                    {/* Live estimate preview */}
                    <div style={{
                        padding: '20px 24px', borderRadius: 16,
                        background: 'linear-gradient(135deg,#1B2A4A,#0D3B45)',
                        marginBottom: 20,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#B2DDE0', fontWeight: 600, marginBottom: 12 }}>
                            <BarChart3 size={16} />
                            <span>Quick Estimate Preview</span>
                        </div>
                        <div className="form-grid-2">
                            <div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.50)', marginBottom: 4 }}>
                                    Est. Daily kWh
                                </div>
                                <div style={{
                                    fontSize: 24, fontWeight: 700, color: '#B2DDE0',
                                    fontFamily: "'Poppins',sans-serif"
                                }}>
                                    {estimateKwh(form).toFixed(1)}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.50)', marginBottom: 4 }}>
                                    Est. Daily CO₂
                                </div>
                                <div style={{
                                    fontSize: 24, fontWeight: 700, color: '#4ECDC4',
                                    fontFamily: "'Poppins',sans-serif"
                                }}>
                                    {(estimateKwh(form) * 0.52).toFixed(2)} kg
                                </div>
                            </div>
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', marginTop: 10 }}>
                            This is a rough estimate. Submit for the precise AI prediction.
                        </div>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '14px 18px', borderRadius: 10, marginBottom: 20,
                    background: '#FDECEA', border: '1px solid #C0392B',
                    color: '#C0392B', fontSize: 14,
                }}>
                    <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
                <button onClick={() => setStep(s => Math.max(0, s - 1))}
                    disabled={step === 0}
                    style={{
                        padding: '12px 24px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                        background: step === 0 ? '#E8ECF0' : '#fff',
                        color: step === 0 ? '#B0B8C4' : '#1B2A4A',
                        border: '1.5px solid #D0D7E0', cursor: step === 0 ? 'not-allowed' : 'pointer',
                    }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <ArrowLeft size={16} /> Back
                    </div>
                </button>

                {step < totalSteps - 1 ? (
                    <button onClick={() => setStep(s => s + 1)} style={{
                        padding: '12px 32px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                        background: 'linear-gradient(135deg,#0D7680,#0a5d65)',
                        color: '#fff', border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(13,118,128,0.30)',
                    }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            Next <ArrowRight size={16} />
                        </div>
                    </button>
                ) : (
                    <button onClick={submit} style={{
                        padding: '14px 40px', borderRadius: 10, fontSize: 15, fontWeight: 700,
                        background: 'linear-gradient(135deg,#0D7680,#0a5d65)',
                        color: '#fff', border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 20px rgba(13,118,128,0.40)',
                    }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <Zap size={16} /> Calculate My Carbon Footprint
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}

/* Quick kWh estimate for preview */
function estimateKwh(f) {
    const fw = { 'Small (under 200L)': 1.92, 'Medium (200-350L)': 2.88, 'Large (over 350L)': 4.32 };
    const hw = { 'Instant (3kW)': 3, 'Storage (2kW)': 2, 'Solar-assisted (1kW)': 1, 'None': 0 };
    const tw = { 'LED/LCD': 0.07, 'OLED': 0.09, 'Old CRT': 0.12 };
    const pw = { 'Laptop': 0.045, 'Desktop': 0.12, 'Both': 0.08, 'None': 0 };
    return Math.max(
        f.has_ac * f.ac_hours * 1.0 * f.ac_rooms +
        f.has_fridge * (fw[f.fridge_size] || 2.88) +
        f.has_heater * f.heater_hours * (hw[f.heater_type] || 0) +
        f.num_fans * f.fan_hours * 0.06 +
        f.num_tvs * f.tv_hours * (tw[f.tv_type] || 0.07) +
        f.has_washer * f.washer_loads / 7 * 0.4 +
        f.led_count * f.light_hours * 0.009 +
        f.old_bulb_count * f.light_hours * 0.055 +
        f.tube_light_count * f.light_hours * 0.036 +
        f.has_computer * f.computer_hours * (pw[f.computer_type] || 0.045) +
        f.has_rice_cooker * f.rice_cooker_uses * 0.2 +
        f.has_microwave * f.microwave_hours * 1.0 +
        f.has_iron * f.iron_hours_week / 7 * 0.75
        - f.has_solar * f.solar_kw * 3.8,
        0.3
    );
}