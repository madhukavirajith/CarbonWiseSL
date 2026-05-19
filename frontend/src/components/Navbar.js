// frontend/src/components/Navbar.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';

const S = {
    nav: (scrolled) => ({
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(27,42,74,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(178,221,224,0.15)' : 'none',
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
    logoIcon: {
        width: 34, height: 34,
        background: 'linear-gradient(135deg, #0D7680, #1B2A4A)',
        borderRadius: 8, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 18,
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
        padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
        background: 'linear-gradient(135deg, #0D7680, #0a5d65)',
        color: '#fff', border: 'none', cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        textDecoration: 'none',
    },
    usernameText: {
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

    return (
        <nav style={S.nav(scrolled || !isLanding)}>
            <div style={S.inner}>
                <Link to="/" style={S.logo}>
                    <div style={S.logoIcon}>🌿</div>
                    CarbonWise SL
                </Link>

                <div style={S.links}>
                    <Link to="/calculate" style={S.link(path === '/calculate')}>Calculate</Link>
                    <Link to="/solar" style={S.link(path === '/solar')}>Solar ROI</Link>
                    <Link to="/history" style={S.link(path === '/history')}>History</Link>
                    
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 8 }}>
                            <span style={S.usernameText}>👤 {user.username}</span>
                            <button 
                                onClick={() => { logout(); navigate('/'); }} 
                                style={S.logoutBtn}
                                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(192, 57, 43, 0.2)'; e.currentTarget.style.borderColor = 'rgba(192, 57, 43, 0.4)'; e.currentTarget.style.color = '#FF8A80'; }}
                                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'; }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                            <Link to="/auth" style={S.link(path === '/auth')}>Sign In</Link>
                            <Link to="/calculate" style={S.cta}>Get Started →</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}