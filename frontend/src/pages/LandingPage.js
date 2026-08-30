// frontend/src/pages/LandingPage.js
import React, { useEffect, useRef, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart3,
    Home,
    Lightbulb,
    CheckCircle2,
    Cpu,
    Search,
    Users,
    Sliders,
    Sun,
    TrendingUp,
    ClipboardList,
    User,
    Leaf,
    Zap
} from 'lucide-react';
import { useSpring, useTrail, animated, config } from '@react-spring/web';
import { AppContext } from '../App';

/* ── custom hooks ─────────────────────────────────────────────── */
function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                if (options.triggerOnce) {
                    observer.unobserve(el);
                }
            } else if (!options.triggerOnce) {
                setInView(false);
            }
        }, options);

        observer.observe(el);
        return () => {
            if (el) observer.unobserve(el);
        };
    }, [options.triggerOnce, options.threshold, options.rootMargin]);

    return [ref, inView];
}

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

const StatCard = ({ value, label, icon: Icon }) => {
    // Determine if the value has a numeric part to animate
    const numericMatch = typeof value === 'string' ? value.match(/^([0-9.]+)(.*)$/) : null;
    const startValue = numericMatch ? parseFloat(numericMatch[1]) : null;
    const suffix = numericMatch ? numericMatch[2] : '';
    const isDecimal = numericMatch && numericMatch[1].includes('.');

    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

    const springs = useSpring({
        from: { opacity: 0, transform: 'translateY(25px)', num: 0 },
        to: {
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0px)' : 'translateY(25px)',
            num: inView && startValue !== null ? startValue : 0
        },
        config: { mass: 1, tension: 70, friction: 20 },
    });

    return (
        <animated.div ref={ref} style={{
            opacity: springs.opacity,
            transform: springs.transform,
            background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16,
            padding: '28px 24px', textAlign: 'center', flex: 1, minWidth: 160,
        }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: '#B2DDE0', marginBottom: 12 }}>
                <Icon size={32} />
            </div>
            <div style={{
                fontSize: 36, fontWeight: 700, color: '#B2DDE0',
                fontFamily: "'Poppins',sans-serif", lineHeight: 1
            }}>
                {startValue !== null ? (
                    <animated.span>
                        {springs.num.to(n => isDecimal ? n.toFixed(2) + suffix : Math.floor(n) + suffix)}
                    </animated.span>
                ) : value}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 1.4 }}>{label}</div>
        </animated.div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

    const revealStyle = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0px)' : 'translateY(30px)',
        config: config.gentle,
    });

    const [hoverStyle, setHover] = useSpring(() => ({
        transform: 'translateY(0px) scale(1)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
        config: { mass: 1, tension: 300, friction: 18 }
    }));

    return (
        <animated.div ref={ref} style={revealStyle}>
            <animated.div
                style={{
                    ...hoverStyle,
                    background: '#fff', borderRadius: 20, padding: '32px 28px',
                    borderTop: `4px solid ${color}`,
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}
                onMouseEnter={() => setHover.start({ transform: 'translateY(-6px) scale(1.02)', boxShadow: '0 12px 32px rgba(0,0,0,0.12)' })}
                onMouseLeave={() => setHover.start({ transform: 'translateY(0px) scale(1)', boxShadow: '0 4px 20px rgba(0,0,0,0.07)' })}
            >
                <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: `${color}18`, color: color, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', marginBottom: 20,
                }}>
                    <Icon size={26} />
                </div>
                <h3 style={{
                    fontSize: 18, fontWeight: 700, color: '#1B2A4A', marginBottom: 10,
                    fontFamily: "'Poppins',sans-serif"
                }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7, flex: 1 }}>{desc}</p>
            </animated.div>
        </animated.div>
    );
};

const StepBadge = ({ n, title, desc, icon: Icon, last }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const revealStyle = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0px)' : 'translateX(-25px)',
        config: config.gentle,
    });

    return (
        <animated.div ref={ref} style={{ ...revealStyle, display: 'flex', gap: 20, alignItems: 'flex-start', position: 'relative' }}>
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
                <div style={{ color: '#0D7680', marginBottom: 10 }}>
                    <Icon size={24} />
                </div>
                <h4 style={{
                    fontSize: 17, fontWeight: 700, color: '#1B2A4A', marginBottom: 6,
                    fontFamily: "'Poppins',sans-serif"
                }}>{title}</h4>
                <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.7, maxWidth: 380 }}>{desc}</p>
            </div>
        </animated.div>
    );
};

const TestimonialCard = ({ quote, name, area, icon: Icon }) => {
    const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const revealStyle = useSpring({
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0px) scale(1)' : 'translateY(25px) scale(0.96)',
        config: config.gentle,
    });

    return (
        <animated.div ref={ref} style={{
            ...revealStyle,
            background: '#fff', borderRadius: 16, padding: '28px 24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
            border: '1px solid #E8ECF0',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
        }}>
            <div>
                <div style={{ fontSize: 32, color: '#0D7680', marginBottom: 12, lineHeight: 1 }}>"</div>
                <p style={{ fontSize: 14, color: '#5A6A7A', lineHeight: 1.8, marginBottom: 20 }}>{quote}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                    width: 42, height: 42, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#E6F4F5,#B2DDE0)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0D7680',
                }}>
                    <Icon size={20} />
                </div>
                <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: '#1B2A4A' }}>{name}</div>
                    <div style={{ fontSize: 12, color: '#8A9BB0' }}>{area}</div>
                </div>
            </div>
        </animated.div>
    );
};

/* ── MAIN PAGE ──────────────────────────────────────────────────── */
export default function LandingPage() {
    const { lang, t } = useContext(AppContext);
    const heroRef = useRef(null);
    const [particles, setParticles] = useState([]);

    const heroT = t?.hero || {};
    const statsT = t?.stats || {};
    const featuresT = t?.features || {};
    const howT = t?.howItWorks || {};
    const testT = t?.testimonials || {};
    const ctaT = t?.cta || {};

    const trail = useTrail(5, {
        from: { opacity: 0, transform: 'translateY(25px)' },
        to: { opacity: 1, transform: 'translateY(0)' },
        config: config.gentle,
    });

    const mockupSpring = useSpring({
        from: { opacity: 0, transform: 'translateY(35px) scale(0.97)' },
        to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
        delay: 350,
        config: config.gentle,
    });

    const [bannerHover, setBannerHover] = useState(false);
    const bannerHoverSpring = useSpring({
        transform: bannerHover ? 'scale(1.025) translateY(-4px)' : 'scale(1) translateY(0px)',
        boxShadow: bannerHover
            ? '0 32px 80px rgba(0,0,0,0.50), 0 10px 30px rgba(13,118,128,0.15)'
            : '0 24px 64px rgba(0,0,0,0.40), 0 0px 0px rgba(13,118,128,0)',
        config: { mass: 1, tension: 180, friction: 20 }
    });

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

    const featureIcons = [
        { icon: Cpu, color: "#0D7680" },
        { icon: Search, color: "#C8932A" },
        { icon: Users, color: "#7B3F9E" },
        { icon: Sliders, color: "#1A7A4A" },
        { icon: Sun, color: "#E67E22" },
        { icon: TrendingUp, color: "#C0392B" }
    ];

    const stepIcons = [ClipboardList, Cpu, Search, Lightbulb];
    const testimonialIcons = [User, User, Users];

    return (
        <div style={{ overflowX: 'hidden' }} className={lang === 'si' ? 'lang-si' : ''}>

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
                        <div className="responsive-hero-grid">

                            {/* Left - copy */}
                            <div>

                                <animated.div style={trail[1]}>
                                    <h1 style={{
                                        fontFamily: lang === 'si' ? 'var(--font-sinhala)' : "'Poppins',sans-serif",
                                        fontSize: 'clamp(32px,4.2vw,56px)',
                                        fontWeight: 800, lineHeight: lang === 'si' ? 1.3 : 1.15,
                                        color: '#FFFFFF', marginBottom: 24,
                                        letterSpacing: lang === 'si' ? '0px' : '-0.5px',
                                    }}>
                                        {heroT.titlePrefix}{' '}
                                        <span style={{
                                            background: 'linear-gradient(90deg,#0D7680,#4ECDC4)',
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                        }}>
                                            {heroT.titleHighlight1}
                                        </span>
                                        {lang === 'si' ? ' ' : ''}{heroT.titleMiddle}{' '}
                                        <span style={{
                                            background: 'linear-gradient(90deg,#C8932A,#F5A623)',
                                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                        }}>
                                            {heroT.titleHighlight2}
                                        </span>
                                    </h1>
                                </animated.div>

                                <animated.div style={trail[2]}>
                                    <p style={{
                                        fontSize: 17, color: 'rgba(255,255,255,0.76)',
                                        lineHeight: 1.75, marginBottom: 40, maxWidth: 520,
                                    }}>
                                        {heroT.subtitle}
                                    </p>
                                </animated.div>

                                <animated.div style={trail[3]}>
                                    <div style={{
                                        display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48,
                                    }}>
                                        <Btn to="/calculate" variant="primary">
                                            <Zap size={16} /> {heroT.ctaCalculate || 'Calculate My Footprint'}
                                        </Btn>
                                        <Btn to="/solar" variant="secondary">
                                            <Sun size={16} /> {heroT.ctaSolar || 'Solar ROI Calculator'}
                                        </Btn>
                                    </div>
                                </animated.div>


                            </div>

                            {/* Right - animated banner image */}
                            <animated.div style={mockupSpring}>
                                <div className="animate-float">
                                    <animated.div
                                        style={{
                                            ...bannerHoverSpring,
                                            cursor: 'pointer',
                                            borderRadius: 24,
                                            overflow: 'hidden',
                                        }}
                                        onMouseEnter={() => setBannerHover(true)}
                                        onMouseLeave={() => setBannerHover(false)}
                                    >
                                        <img
                                            src="/banner.png"
                                            alt={heroT.imgAlt || "CarbonWiseSL Dashboard Preview"}
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                border: '1px solid rgba(255,255,255,0.12)',
                                                display: 'block',
                                            }}
                                        />
                                    </animated.div>
                                </div>
                            </animated.div>

                        </div>

                        {/* Stats row */}
                        <div className="responsive-stats-grid" style={{ marginTop: 72 }}>
                            <StatCard value={statsT.stat1Value || "0.52"} label={statsT.stat1Label || "kg CO₂ per kWh (SLSEA 2024)"} icon={BarChart3} />
                            <StatCard value={statsT.stat2Value || "38%"} label={statsT.stat2Label || "of SL electricity is residential"} icon={Home} />
                            <StatCard value={statsT.stat3Value || "Multi-Tier"} label={statsT.stat3Label || "CEB tariff modelled accurately"} icon={Lightbulb} />
                            <StatCard value={statsT.stat4Value || "Free"} label={statsT.stat4Label || "No registration required"} icon={CheckCircle2} />
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
                        }}>{featuresT.badge || 'What CarbonWiseSL Does'}</div>
                        <h2 style={{
                            fontFamily: lang === 'si' ? 'var(--font-sinhala)' : "'Poppins',sans-serif",
                            fontSize: 'clamp(26px,3.5vw,42px)',
                            fontWeight: 800, color: '#1B2A4A', marginBottom: 16,
                            lineHeight: 1.3,
                        }}>{featuresT.title || 'Not Just a Calculator. An AI-Powered Advisor.'}</h2>
                        <p style={{ fontSize: 16, color: '#5A6A7A', maxWidth: 620, margin: '0 auto', lineHeight: 1.7 }}>
                            {featuresT.subtitle}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
                        {featuresT.items?.map((item, idx) => {
                            const config = featureIcons[idx] || { icon: Cpu, color: '#0D7680' };
                            return (
                                <FeatureCard
                                    key={idx}
                                    icon={config.icon}
                                    color={config.color}
                                    title={item.title}
                                    desc={item.desc}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ════════ HOW IT WORKS ════════ */}
            <section style={{ padding: '100px 0', background: '#fff' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    <div className="responsive-grid-2" style={{ alignItems: 'center' }}>
                        <div>
                            <div style={{
                                display: 'inline-block', padding: '6px 18px', borderRadius: 100,
                                background: '#E6F4F5', color: '#0D7680',
                                fontSize: 13, fontWeight: 600, marginBottom: 20,
                            }}>{howT.badge || 'How It Works'}</div>
                            <h2 style={{
                                fontFamily: lang === 'si' ? 'var(--font-sinhala)' : "'Poppins',sans-serif",
                                fontSize: 'clamp(24px,3vw,38px)',
                                fontWeight: 800, color: '#1B2A4A', marginBottom: 40,
                                lineHeight: 1.3,
                            }}>{howT.title || 'From Your CEB Bill to Actionable Insights in 60 Seconds'}</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                {howT.steps?.map((step, idx) => (
                                    <StepBadge
                                        key={idx}
                                        n={step.n || String(idx + 1)}
                                        icon={stepIcons[idx] || ClipboardList}
                                        title={step.title}
                                        desc={step.desc}
                                        last={idx === (howT.steps.length - 1)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Right side - AI intro video */}
                        <div style={{
                            background: 'linear-gradient(145deg,#1B2A4A,#0D3B45)',
                            borderRadius: 24,
                            padding: 16,
                            boxShadow: '0 16px 48px rgba(27,42,74,0.40)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            overflow: 'hidden',
                        }}>
                            <video
                                src="/intro.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                controls
                                style={{
                                    width: '100%',
                                    borderRadius: 16,
                                    display: 'block',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════ TESTIMONIALS ════════ */}
            <section style={{ padding: '100px 0', background: '#F4F6F8' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <h2 style={{
                            fontFamily: lang === 'si' ? 'var(--font-sinhala)' : "'Poppins',sans-serif",
                            fontSize: 'clamp(24px,3vw,36px)',
                            fontWeight: 800, color: '#1B2A4A', marginBottom: 12,
                            lineHeight: 1.3,
                        }}>{testT.title || 'What Urban Households Say'}</h2>
                        <p style={{ fontSize: 15, color: '#5A6A7A' }}>
                            {testT.subtitle}
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
                        {testT.items?.map((item, idx) => (
                            <TestimonialCard
                                key={idx}
                                icon={testimonialIcons[idx] || User}
                                name={item.name}
                                area={item.area}
                                quote={item.quote}
                            />
                        ))}
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
                    <div style={{ display: 'flex', justifyContent: 'center', color: '#B2DDE0', marginBottom: 20 }}>
                        <Leaf size={48} />
                    </div>
                    <h2 style={{
                        fontFamily: lang === 'si' ? 'var(--font-sinhala)' : "'Poppins',sans-serif",
                        fontSize: 'clamp(26px,3.5vw,44px)',
                        fontWeight: 800, color: '#fff', marginBottom: 16,
                        lineHeight: 1.3,
                    }}>{ctaT.title || 'Ready to Know Your Carbon Footprint?'}</h2>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginBottom: 40, lineHeight: 1.7 }}>
                        {ctaT.subtitle}
                    </p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Btn to="/calculate" variant="gold"><Zap size={16} /> {ctaT.btnCalculate || 'Calculate My Footprint'}</Btn>
                        <Btn to="/solar" variant="secondary"><Sun size={16} /> {ctaT.btnSolar || 'Solar ROI Calculator'}</Btn>
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.40)', marginTop: 28 }}>
                        {ctaT.dataSource}
                    </p>
                </div>
            </section>

        </div>
    );
}