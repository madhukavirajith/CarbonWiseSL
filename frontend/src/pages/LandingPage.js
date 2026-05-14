// frontend/src/pages/LandingPage.js
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/* ── tiny reusable primitives ─────────────────────────────────── */
const Btn = ({ to, children, variant = 'primary', style: s = {} }) => {
    const base = {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '14px 32px', borderRadius: 12, fontWeight: 600,
        fontSize: 16, border: 'none', cursor: 'pointer',
        transition: 'transform 0.18s, box-shadow 0.18s',
        textDecoration: 'none', ...s,
    };
    const styles = {
        primary: {
            background: 'linear-gradient(135deg,#0D7680,#0a5d65)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(13,118,128,0.40)',
        },
        secondary: {
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.30)',
            backdropFilter: 'blur(8px)',
        },
        gold: {
            background: 'linear-gradient(135deg,#C8932A,#a67420)',
            color: '#fff',
            boxShadow: '0 4px 20px rgba(200,147,42,0.40)',
        },
    };
    return (
        <Link to={to} style={{ ...base, ...styles[variant] }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = styles[variant].boxShadow || 'none'; }}>
            {children}
        </Link>
    );
};

const StatCard = ({ value, label, icon, delay }) => (
    <div className="animate-fadeUp" style={{
        animationDelay: `${delay}s`,
        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16,
        padding: '28px 24px', textAlign: 'center', flex: 1, minWidth: 160,
    }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
        <div style={{
            fontSize: 36, fontWeight: 700, color: '#B2DDE0',
            fontFamily: "'Poppins',sans-serif", lineHeight: 1
        }}>{value}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6 }}>{label}</div>
    </div>
);

const FeatureCard = ({ icon, title, desc, color, delay }) => (
    <div className="animate-fadeUp" style={{
        animationDelay: `${delay}s`,
        background: '#fff', borderRadius: 20, padding: '32px 28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        borderTop: `4px solid ${color}`,
        transition: 'transform 0.2s, box-shadow 0.2s',
    }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}>
        <div style={{
            width: 56, height: 56, borderRadius: 14, fontSize: 26,
            background: `${color}18`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: 20,
        }}>{icon}</div>
        <h3 style={{
            fontSize: 18, fontWeight: 700, color: '#1B2A4A', marginBottom: 10,
            fontFamily: "'Poppins',sans-serif"
        }}>{title}</h3>
        <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7 }}>{desc}</p>
    </div>
);

const StepBadge = ({ n, title, desc, icon, last }) => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative' }}>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg,#0D7680,#1B2A4A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 18,
                boxShadow: '0 4px 16px rgba(13,118,128,0.35)',
            }}>{n}</div>
            {!last && <div style={{ width: 2, flex: 1, minHeight: 40, background: 'linear-gradient(to bottom,#0D7680,transparent)', marginTop: 8 }} />}
        </div>
        <div style={{ paddingBottom: last ? 0 : 36 }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
            <h4 style={{
                fontSize: 17, fontWeight: 700, color: '#1B2A4A', marginBottom: 6,
                fontFamily: "'Poppins',sans-serif"
            }}>{title}</h4>
            <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7, maxWidth: 380 }}>{desc}</p>
        </div>
    </div>
);

const TestimonialCard = ({ quote, name, area, emoji }) => (
    <div style={{
        background: '#fff', borderRadius: 16, padding: '28px 24px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
        border: '1px solid #E8ECF0',
    }}>
        <div style={{ fontSize: 32, color: '#0D7680', marginBottom: 12, lineHeight: 1 }}>"</div>
        <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.8, marginBottom: 20 }}>{quote}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
                width: 42, height: 42, borderRadius: '50%',
                background: 'linear-gradient(135deg,#E6F4F5,#B2DDE0)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>{emoji}</div>
            <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1B2A4A' }}>{name}</div>
                <div style={{ fontSize: 12, color: '#8A9BB0' }}>{area}</div>
            </div>
        </div>
    </div>
);

/* ── MAIN PAGE ──────────────────────────────────────────────────── */
export default function LandingPage() {
    const heroRef = useRef(null);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        // Generate floating particles for hero
        setParticles(
            Array.from({ length: 18 }, (_, i) => ({
                id: i,
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: 4 + Math.random() * 8,
                dur: 6 + Math.random() * 8,
                delay: Math.random() * 4,
                opacity: 0.1 + Math.random() * 0.25,
            }))
        );
    }, []);

    /* Parallax on scroll */
    useEffect(() => {
        const el = heroRef.current;
        if (!el) return;
        const handler = () => {
            const y = window.scrollY;
            el.style.transform = `translateY(${y * 0.35}px)`;
        };
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <div style={{ overflowX: 'hidden' }}>

            {/* ════════ HERO ════════ */}
            <section style={{
                position: 'relative', minHeight: '100vh',
                background: 'linear-gradient(145deg,#0D1B2A 0%,#1B2A4A 45%,#0D3B45 100%)',
                display: 'flex', alignItems: 'center', overflow: 'hidden',
                paddingTop: 64,
            }}>
                {/* Animated background mesh */}
                <div ref={heroRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    {/* Grid lines */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `
              linear-gradient(rgba(13,118,128,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(13,118,128,0.08) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px',
                    }} />
                    {/* Radial glow */}
                    <div style={{
                        position: 'absolute', top: '20%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        width: 700, height: 700, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(13,118,128,0.18) 0%, transparent 70%)',
                        filter: 'blur(40px)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: '10%', right: '10%',
                        width: 400, height: 400, borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(200,147,42,0.10) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }} />
                    {/* Floating particles */}
                    {particles.map(p => (
                        <div key={p.id} style={{
                            position: 'absolute',
                            left: `${p.x}%`, top: `${p.y}%`,
                            width: p.size, height: p.size,
                            borderRadius: '50%',
                            background: `rgba(13,118,128,${p.opacity})`,
                            animation: `pulse ${p.dur}s ease-in-out ${p.delay}s infinite`,
                        }} />
                    ))}
                </div>

                <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 24px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>

                            {/* Left — copy */}
                            <div>
                                <div className="animate-fadeUp" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    background: 'rgba(13,118,128,0.20)',
                                    border: '1px solid rgba(13,118,128,0.40)',
                                    borderRadius: 100, padding: '6px 16px',
                                    marginBottom: 28,
                                }}>
                                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0D7680', display: 'block', animation: 'pulse 2s infinite' }} />
                                    <span style={{ fontSize: 13, color: '#B2DDE0', fontWeight: 500 }}>
                                        Powered by XGBoost + SHAP AI · SLSEA 2024 Data
                                    </span>
                                </div>

                                <h1 className="animate-fadeUp" style={{
                                    animationDelay: '0.1s',
                                    fontFamily: "'Poppins',sans-serif",
                                    fontSize: 'clamp(36px,4.5vw,58px)',
                                    fontWeight: 800, lineHeight: 1.15,
                                    color: '#FFFFFF', marginBottom: 24,
                                    letterSpacing: '-0.5px',
                                }}>
                                    Know Your{' '}
                                    <span style={{
                                        background: 'linear-gradient(90deg,#0D7680,#4ECDC4)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    }}>
                                        Carbon Footprint
                                    </span>
                                    . Cut Your{' '}
                                    <span style={{
                                        background: 'linear-gradient(90deg,#C8932A,#F5A623)',
                                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                    }}>
                                        CEB Bill.
                                    </span>
                                </h1>

                                <p className="animate-fadeUp" style={{
                                    animationDelay: '0.2s',
                                    fontSize: 18, color: 'rgba(255,255,255,0.72)',
                                    lineHeight: 1.75, marginBottom: 40, maxWidth: 500,
                                }}>
                                    Sri Lanka's first AI-powered electricity carbon tracker. Enter your appliances,
                                    get your exact CO₂ footprint, see <em>which appliances</em> cause it, and
                                    simulate how much you can save — in rupees and kilograms.
                                </p>

                                <div className="animate-fadeUp" style={{
                                    animationDelay: '0.3s',
                                    display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48,
                                }}>
                                    <Btn to="/calculate" variant="primary">
                                        ⚡ Calculate My Footprint
                                    </Btn>
                                    <Btn to="/solar" variant="secondary">
                                        ☀️ Solar ROI Calculator
                                    </Btn>
                                </div>

                                {/* Trust badges */}
                                <div className="animate-fadeUp" style={{
                                    animationDelay: '0.4s',
                                    display: 'flex', gap: 24, flexWrap: 'wrap',
                                }}>
                                    {[
                                        { icon: '🏛️', text: 'SLSEA 2024 Data' },
                                        { icon: '🔋', text: 'CEB Tariff Accurate' },
                                        { icon: '🤖', text: 'XGBoost AI Model' },
                                        { icon: '🆓', text: '100% Free' },
                                    ].map(b => (
                                        <div key={b.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <span style={{ fontSize: 16 }}>{b.icon}</span>
                                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{b.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right — animated mockup card */}
                            <div className="animate-fadeUp" style={{ animationDelay: '0.2s' }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: 24, padding: 32,
                                    boxShadow: '0 24px 64px rgba(0,0,0,0.40)',
                                }}>
                                    {/* Mock dashboard header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', marginLeft: 8 }}>
                                            carbonwise-sl.vercel.app
                                        </span>
                                    </div>

                                    {/* Mock emission cards */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                                        {[
                                            { label: 'Daily CO₂', value: '4.2 kg', color: '#0D7680' },
                                            { label: 'Monthly', value: '127 kg', color: '#C8932A' },
                                            { label: 'Level', value: 'Medium', color: '#1A7A4A' },
                                        ].map(c => (
                                            <div key={c.label} style={{
                                                background: `${c.color}22`, border: `1px solid ${c.color}40`,
                                                borderRadius: 12, padding: '14px 12px', textAlign: 'center',
                                            }}>
                                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>{c.label}</div>
                                                <div style={{ fontSize: 18, fontWeight: 700, color: c.color, fontFamily: "'Poppins',sans-serif" }}>{c.value}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mock SHAP bars */}
                                    <div style={{ marginBottom: 20 }}>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.50)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                            Appliance Breakdown (SHAP)
                                        </div>
                                        {[
                                            { label: 'Air Conditioner', pct: 78, val: '+2.1 kg', color: '#C0392B' },
                                            { label: 'Refrigerator', pct: 32, val: '+0.9 kg', color: '#E67E22' },
                                            { label: 'Water Heater', pct: 22, val: '+0.6 kg', color: '#C8932A' },
                                            { label: 'LED Bulbs', pct: 8, val: '-0.2 kg', color: '#1A7A4A' },
                                        ].map(b => (
                                            <div key={b.label} style={{ marginBottom: 10 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{b.label}</span>
                                                    <span style={{ fontSize: 12, color: b.color, fontWeight: 600 }}>{b.val}</span>
                                                </div>
                                                <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%', width: `${b.pct}%`,
                                                        background: b.color, borderRadius: 3,
                                                        transition: 'width 1s ease',
                                                    }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mock recommendation */}
                                    <div style={{
                                        background: 'rgba(200,147,42,0.12)',
                                        border: '1px solid rgba(200,147,42,0.30)',
                                        borderRadius: 10, padding: '12px 14px',
                                    }}>
                                        <div style={{ fontSize: 11, color: '#C8932A', fontWeight: 600, marginBottom: 4 }}>
                                            💡 AI Recommendation
                                        </div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)' }}>
                                            Set AC to 26°C → save <strong style={{ color: '#C8932A' }}>1.1 kg CO₂</strong> &amp;{' '}
                                            <strong style={{ color: '#C8932A' }}>LKR 290</strong> per week.
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Stats row */}
                        <div className="animate-fadeUp" style={{
                            animationDelay: '0.5s',
                            display: 'flex', gap: 16, marginTop: 72, flexWrap: 'wrap',
                        }}>
                            <StatCard value="0.52" label="kg CO₂ per kWh (SLSEA 2024)" icon="📊" delay={0.55} />
                            <StatCard value="38%" label="of SL electricity is residential" icon="🏘️" delay={0.60} />
                            <StatCard value="5-Tier" label="CEB tariff modelled accurately" icon="💡" delay={0.65} />
                            <StatCard value="Free" label="No registration required" icon="✅" delay={0.70} />
                        </div>
                    </div>
                </div>

                {/* Wave divider */}
                <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0 }}>
                    <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 80L60 69.3C120 58.7 240 37.3 360 32C480 26.7 600 37.3 720 42.7C840 48 960 48 1080 42.7C1200 37.3 1320 26.7 1380 21.3L1440 16V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0Z" fill="#F4F6F8" />
                    </svg>
                </div>
            </section>

            {/* ════════ FEATURES ════════ */}
            <section style={{ padding: '100px 0', background: '#F4F6F8' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 64 }}>
                        <div style={{
                            display: 'inline-block', padding: '6px 18px', borderRadius: 100,
                            background: '#E6F4F5', color: '#0D7680',
                            fontSize: 13, fontWeight: 600, marginBottom: 16,
                        }}>What CarbonWise SL Does</div>
                        <h2 style={{
                            fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(28px,3.5vw,42px)',
                            fontWeight: 800, color: '#1B2A4A', marginBottom: 16,
                        }}>Not Just a Calculator. An AI-Powered Advisor.</h2>
                        <p style={{ fontSize: 17, color: '#5A6A7A', maxWidth: 580, margin: '0 auto' }}>
                            Three AI models working together to predict, explain, and help you reduce
                            your household electricity carbon footprint — calibrated specifically for Sri Lanka.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
                        <FeatureCard
                            icon="🤖" color="#0D7680" delay={0.05}
                            title="AI Carbon Prediction"
                            desc="Our XGBoost model — trained on Sri Lankan household data — predicts your exact daily and monthly CO₂ emissions from electricity, accounting for CEB's 5-tier tariff and SLSEA 2024 emission factors." />
                        <FeatureCard
                            icon="🔍" color="#C8932A" delay={0.10}
                            title="SHAP Appliance Explainability"
                            desc="The only Sri Lankan tool that tells you exactly which appliances are responsible for your emissions. Powered by SHAP, your AC, fridge, and heater each get their own CO₂ contribution score." />
                        <FeatureCard
                            icon="👥" color="#7B3F9E" delay={0.15}
                            title="Personalised Profiles"
                            desc="K-Means clustering identifies your household type — Heavy AC User, Energy Efficient, or High Occupancy — and generates recommendations specific to your actual usage pattern." />
                        <FeatureCard
                            icon="🎛️" color="#1A7A4A" delay={0.20}
                            title="What-If Simulator"
                            desc="Model the impact of any behaviour change before committing to it. Set your AC to 26°C, replace old bulbs with LEDs, reduce washing loads — see the CO₂ and LKR saving instantly." />
                        <FeatureCard
                            icon="☀️" color="#E67E22" delay={0.25}
                            title="Solar ROI Calculator"
                            desc="Thinking about rooftop solar? Enter your roof area and city, and get your estimated annual kWh generation, CEB bill saving, lifetime CO₂ offset, and payback period." />
                        <FeatureCard
                            icon="📈" color="#C0392B" delay={0.30}
                            title="Emission History Tracker"
                            desc="Track your footprint over time. Every prediction is saved so you can see your monthly reduction trend and measure the real-world impact of your behaviour changes." />
                    </div>
                </div>
            </section>

            {/* ════════ HOW IT WORKS ════════ */}
            <section style={{ padding: '100px 0', background: '#fff' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
                        <div>
                            <div style={{
                                display: 'inline-block', padding: '6px 18px', borderRadius: 100,
                                background: '#E6F4F5', color: '#0D7680',
                                fontSize: 13, fontWeight: 600, marginBottom: 20,
                            }}>How It Works</div>
                            <h2 style={{
                                fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(26px,3vw,38px)',
                                fontWeight: 800, color: '#1B2A4A', marginBottom: 40,
                            }}>From Your CEB Bill to Actionable Insights in 60 Seconds</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                <StepBadge n="1" icon="📋" title="Enter Your Appliances"
                                    desc="Tell us what you own — AC, fridge, fans, TV, washing machine, bulbs. Takes about 3 minutes for the first time." delay={false} />
                                <StepBadge n="2" icon="🤖" title="AI Predicts Your CO₂"
                                    desc="Our XGBoost model instantly calculates your daily and monthly carbon footprint using SLSEA emission factors and your CEB tariff band." delay={false} />
                                <StepBadge n="3" icon="🔍" title="See Your Appliance Breakdown"
                                    desc="SHAP explainability shows exactly which appliance is your biggest carbon culprit. No vague totals — specific appliance scores." delay={false} />
                                <StepBadge n="4" icon="💡" title="Act on Personalised Recommendations" last
                                    desc="Get recommendations matched to your household profile, simulate scenarios, and track your reduction progress week by week." delay={false} />
                            </div>
                        </div>

                        {/* Right side — AI architecture visual */}
                        <div style={{
                            background: 'linear-gradient(145deg,#1B2A4A,#0D3B45)',
                            borderRadius: 24, padding: 40,
                            boxShadow: '0 16px 48px rgba(27,42,74,0.30)',
                        }}>
                            <div style={{
                                fontSize: 13, color: '#B2DDE0', fontWeight: 600,
                                textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 28
                            }}>
                                AI Architecture
                            </div>
                            {[
                                { label: 'Your Appliance Data', icon: '📥', dir: 'INPUT', color: '#8A9BB0' },
                                { label: 'XGBoost Regression', icon: '🤖', dir: 'MODEL 1', color: '#0D7680' },
                                { label: 'SHAP TreeExplainer', icon: '🔍', dir: 'EXPLAINABILITY', color: '#C8932A' },
                                { label: 'K-Means Clustering', icon: '👥', dir: 'MODEL 2', color: '#7B3F9E' },
                                { label: 'Your Carbon Dashboard', icon: '📊', dir: 'OUTPUT', color: '#1A7A4A' },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        background: `${item.color}22`,
                                        border: `1px solid ${item.color}40`,
                                        borderRadius: 12, padding: '14px 18px',
                                    }}>
                                        <span style={{ fontSize: 22 }}>{item.icon}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: 10, color: item.color, fontWeight: 700,
                                                textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2
                                            }}>
                                                {item.dir}
                                            </div>
                                            <div style={{ fontSize: 14, color: '#fff', fontWeight: 500 }}>{item.label}</div>
                                        </div>
                                    </div>
                                    {i < 4 && (
                                        <div style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                                            <div style={{ width: 2, height: 24, background: 'rgba(255,255,255,0.15)', borderRadius: 1 }} />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div style={{
                                marginTop: 24, padding: '14px 18px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: 10, fontSize: 12, color: 'rgba(255,255,255,0.50)',
                                borderTop: '1px solid rgba(255,255,255,0.10)',
                            }}>
                                🐳 FastAPI · Docker · Render.com · Vercel
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════ TESTIMONIALS ════════ */}
            <section style={{ padding: '100px 0', background: '#F4F6F8' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <h2 style={{
                            fontFamily: "'Poppins',sans-serif", fontSize: 'clamp(26px,3vw,36px)',
                            fontWeight: 800, color: '#1B2A4A', marginBottom: 12,
                        }}>What Urban Households Say</h2>
                        <p style={{ fontSize: 15, color: '#5A6A7A' }}>
                            Feedback from our User Acceptance Testing across Colombo, Kandy, and Galle
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
                        <TestimonialCard
                            emoji="👨" name="Ruwan S." area="Colombo 7"
                            quote="I had no idea my AC was responsible for 60% of my electricity bill AND my carbon footprint. The SHAP chart made it immediately obvious. I shifted the temperature to 26°C and saved LKR 1,800 last month." />
                        <TestimonialCard
                            emoji="👩" name="Priya N." area="Kandy"
                            quote="The solar calculator showed me my rooftop would pay back in 6.2 years. I've now applied for a solar loan. No other tool gave me this clearly with Sri Lankan data." />
                        <TestimonialCard
                            emoji="👨‍👩‍👧" name="Fernando Family" area="Galle"
                            quote="The what-if simulator let us experiment before making any changes. We replaced 4 old bulbs and reduced the washing machine loads — 0.7 kg CO₂ less per day, which we can see in the history chart." />
                    </div>
                </div>
            </section>

            {/* ════════ CTA BAND ════════ */}
            <section style={{
                padding: '80px 24px',
                background: 'linear-gradient(135deg,#0D7680 0%,#1B2A4A 60%,#0D3B45 100%)',
                textAlign: 'center',
            }}>
                <div style={{ maxWidth: 720, margin: '0 auto' }}>
                    <div style={{ fontSize: 48, marginBottom: 20 }}>🌿</div>
                    <h2 style={{
                        fontFamily: "'Poppins',sans-serif",
                        fontSize: 'clamp(28px,3.5vw,44px)',
                        fontWeight: 800, color: '#fff', marginBottom: 16,
                    }}>Ready to Know Your Carbon Footprint?</h2>
                    <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.70)', marginBottom: 40, lineHeight: 1.7 }}>
                        It takes 3 minutes. No registration. Free forever.
                        Built with Sri Lankan data for Sri Lankan households.
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Btn to="/calculate" variant="gold">⚡ Calculate My Footprint</Btn>
                        <Btn to="/solar" variant="secondary">☀️ Solar ROI Calculator</Btn>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 28 }}>
                        Data source: SLSEA Grid Emission Factor 2024 · CEB Domestic Tariff 2024 · IPCC AR6
                    </p>
                </div>
            </section>

        </div>
    );
}