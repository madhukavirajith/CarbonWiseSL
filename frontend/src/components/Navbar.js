import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { User, ArrowRight, Menu, X } from 'lucide-react';
import { useSpring, animated } from '@react-spring/web';

const S = {
    nav: (scrolled, isOpen) => ({
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: (scrolled || isOpen) ? 'rgba(27,42,74,0.97)' : 'transparent',
        backdropFilter: (scrolled || isOpen) ? 'blur(12px)' : 'none',
        borderBottom: (scrolled || isOpen) ? '1px solid rgba(178,221,224,0.15)' : 'none',
        transition: 'all 0.3s ease',
        padding: '0 24px',
    }),
    inner: {
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
    },
    logo: {
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: "'Poppins', sans-serif", fontWeight: 700,
        fontSize: 20, color: '#FFFFFF', textDecoration: 'none',
    },
    links: {
        display: 'flex', alignItems: 'center', gap: 8,
    },
    link: (active) => ({
        padding: '8px 16px', borderRadius: 8, fontSize: 14, fontWeight: 500,
        color: active ? '#B2DDE0' : 'rgba(255,255,255,0.8)',
        background: active ? 'rgba(13,118,128,0.2)' : 'transparent',
        transition: 'all 0.2s',
        textDecoration: 'none',
        border: active ? '1px solid rgba(13,118,128,0.4)' : '1px solid transparent',
    }),
    cta: {
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
        background: 'linear-gradient(135deg, #0D7680, #0a5d65)',
        color: '#fff', border: 'none', cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        textDecoration: 'none',
    },
    usernameText: {
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 14,
        fontWeight: 600,
        color: '#B2DDE0',
    },
    logoutBtn: {
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        background: 'rgba(255, 255, 255, 0.08)',
        color: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        cursor: 'pointer',
        transition: 'all 0.2s',
    },
};

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useContext(AppContext);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handler);
        return () => window.removeEventListener('scroll', handler);
    }, []);

    const isLanding = location.pathname === '/';
    const path = location.pathname;

    const [logoHovered, setLogoHovered] = useState(false);
    const logoSpring = useSpring({
        transform: logoHovered ? 'scale(1.15) rotate(15deg)' : 'scale(1) rotate(0deg)',
        config: { mass: 1, tension: 350, friction: 12 }
    });

    return (
        <nav style={S.nav(scrolled || !isLanding, isOpen)}>
            <div style={{
                maxWidth: 1200, margin: '0 auto',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 64,
            }}>
                <Link 
                    to="/" 
                    style={S.logo}
                    onMouseEnter={() => setLogoHovered(true)}
                    onMouseLeave={() => setLogoHovered(false)}
                    onClick={() => setIsOpen(false)}
                >
                    <animated.div style={{ ...logoSpring, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src="/logo.png" alt="CarbonWiseSL Logo" className="logo-glow" style={{ width: 34, height: 34, objectFit: 'contain' }} />
                    </animated.div>
                    CarbonWiseSL
                </Link>

                <button 
                    className="nav-toggle-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className={`nav-menu ${isOpen ? 'is-open' : ''}`}>
                    <Link to="/calculate" style={S.link(path === '/calculate')} onClick={() => setIsOpen(false)}>Calculate</Link>
                    <Link to="/solar" style={S.link(path === '/solar')} onClick={() => setIsOpen(false)}>Solar ROI</Link>
                    <Link to="/history" style={S.link(path === '/history')} onClick={() => setIsOpen(false)}>History</Link>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }} className="nav-user-section">
                            <span style={S.usernameText}>
                                <User size={14} /> {user.username}
                            </span>
                            <button
                                onClick={() => { logout(); navigate('/'); setIsOpen(false); }}
                                style={S.logoutBtn}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(192, 57, 43, 0.2)'; e.currentTarget.style.borderColor = 'rgba(192, 57, 43, 0.4)'; e.currentTarget.style.color = '#FF8A80'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }} className="nav-user-section">
                            <Link to="/auth" style={S.link(path === '/auth')} onClick={() => setIsOpen(false)}>Sign In</Link>
                            <Link to="/calculate" style={S.cta} onClick={() => setIsOpen(false)}>
                                Get Started <ArrowRight size={14} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}