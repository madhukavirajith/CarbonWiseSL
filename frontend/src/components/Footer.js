import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { Link } from 'react-router-dom';

export default function Footer() {
    const [logoHovered, setLogoHovered] = useState(false);
    
    // Newsletter states
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [submittingNewsletter, setSubmittingNewsletter] = useState(false);
    
    // Modal states
    const [activeModal, setActiveModal] = useState(null); // 'contact' | 'faq' | 'privacy' | 'terms' | 'cookie' | 'accessibility' | null
    const [activeFaq, setActiveFaq] = useState(null);
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
    const [contactStatus, setContactStatus] = useState(null); // 'sending' | 'success' | null

    const logoSpring = useSpring({
        transform: logoHovered ? 'scale(1.15) rotate(15deg)' : 'scale(1) rotate(0deg)',
        config: { mass: 1, tension: 350, friction: 12 }
    });

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail) return;
        setSubmittingNewsletter(true);
        setTimeout(() => {
            setSubmittingNewsletter(false);
            setSubscribed(true);
            setNewsletterEmail('');
        }, 1000);
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        if (!contactForm.name || !contactForm.email || !contactForm.message) return;
        setContactStatus('sending');
        setTimeout(() => {
            setContactStatus('success');
            setContactForm({ name: '', email: '', message: '' });
        }, 1000);
    };

    const renderModal = () => {
        if (!activeModal) return null;

        let modalTitle = '';
        let modalContent = null;

        switch (activeModal) {
            case 'faq':
                modalTitle = 'Frequently Asked Questions';
                modalContent = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                        {[
                            {
                                q: 'How does CarbonWiseSL predict household electricity emissions?',
                                a: 'We use machine learning models trained on Sri Lankan household electricity consumption profiles, historical seasonal weather variations, and utility emission factors to project future monthly carbon output.'
                            },
                            {
                                q: 'What is the Solar ROI Calculator?',
                                a: 'It calculates the payback duration, net savings, and carbon offsets of installing a domestic solar PV setup, custom-calibrated for CEB tariff blocks under Net Metering, Net Accounting, or Net Plus options.'
                            },
                            {
                                q: 'Is my data private and secure?',
                                a: 'Yes. All calculated inputs and results are encrypted and processed securely. We never sell, rent, or distribute individual household data to third parties.'
                            },
                            {
                                q: 'What actions can I take to reduce carbon emissions?',
                                a: 'Our platform recommends tailored steps based on your consumption, such as moving high-energy tasks to off-peak slots, upgrading to inverter appliances, or adopting smart power habits.'
                            },
                            {
                                q: 'What grid emission factor is used for Sri Lanka?',
                                a: 'We apply a grid factor of roughly 0.58 kg CO2 per kWh, based on Sri Lanka Sustainable Energy Authority values reflecting the national power generation mix.'
                            }
                        ].map((faq, idx) => {
                            const isOpen = activeFaq === idx;
                            return (
                                <div key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px' }}>
                                    <button
                                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                                        style={{
                                            width: '100%',
                                            background: 'none',
                                            border: 'none',
                                            textAlign: 'left',
                                            color: isOpen ? '#B2DDE0' : '#fff',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '8px 0',
                                            cursor: 'pointer',
                                            outline: 'none',
                                            transition: 'color 0.2s'
                                        }}
                                    >
                                        <span>{faq.q}</span>
                                        <span style={{ fontSize: '18px', marginLeft: '12px' }}>{isOpen ? '−' : '+'}</span>
                                    </button>
                                    {isOpen && (
                                        <div style={{
                                            fontSize: '13.5px',
                                            lineHeight: '1.6',
                                            color: 'rgba(255,255,255,0.7)',
                                            padding: '8px 0 4px',
                                            animation: 'fadeIn 0.3s ease both'
                                        }}>
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
                break;
            case 'contact':
                modalTitle = 'Contact Us';
                modalContent = (
                    <div>
                        {contactStatus === 'success' ? (
                            <div style={{
                                padding: '24px',
                                background: 'rgba(46, 204, 113, 0.1)',
                                border: '1px solid #2ecc71',
                                borderRadius: '8px',
                                textAlign: 'center',
                                marginTop: '16px'
                            }}>
                                <svg viewBox="0 0 24 24" width="48" height="48" stroke="#2ecc71" strokeWidth="2" fill="none" style={{ marginBottom: '12px', display: 'inline-block' }}>
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="22,4 12,14.01 9,11.01"></polyline>
                                </svg>
                                <h4 style={{ color: '#2ecc71', marginBottom: '8px', fontSize: '18px' }}>Message Sent!</h4>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                                    Thank you for reaching out. A CarbonWiseSL representative will respond to your inquiry within 24 hours.
                                </p>
                                <button
                                    onClick={() => setContactStatus(null)}
                                    style={{
                                        marginTop: '16px',
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        color: '#fff',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#B2DDE0', textTransform: 'uppercase' }}>Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={contactForm.name}
                                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                        placeholder="Your Name"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.04)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '6px',
                                            padding: '10px 14px',
                                            color: '#fff',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#B2DDE0', textTransform: 'uppercase' }}>Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={contactForm.email}
                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                        placeholder="name@example.com"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.04)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '6px',
                                            padding: '10px 14px',
                                            color: '#fff',
                                            fontSize: '14px',
                                            outline: 'none'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#B2DDE0', textTransform: 'uppercase' }}>Message</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={contactForm.message}
                                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                        placeholder="How can we help you today?"
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.04)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '6px',
                                            padding: '10px 14px',
                                            color: '#fff',
                                            fontSize: '14px',
                                            outline: 'none',
                                            resize: 'none'
                                        }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={contactStatus === 'sending'}
                                    style={{
                                        background: '#0D7680',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '12px',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        cursor: contactStatus === 'sending' ? 'not-allowed' : 'pointer',
                                        opacity: contactStatus === 'sending' ? 0.7 : 1,
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px'
                                    }}
                                >
                                    {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </form>
                        )}
                    </div>
                );
                break;
            case 'privacy':
                modalTitle = 'Privacy Policy';
                modalContent = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
                        <p>At CarbonWiseSL, we take your privacy seriously. This Policy outlines how we handle and protect your information.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>1. Information Collection</h4>
                        <p>We only collect data necessary to compute your electricity carbon footprint and solar ROI, such as monthly kilowatt-hour usage, tariff block, appliance distribution, and general location inside Sri Lanka.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>2. Data Utilization</h4>
                        <p>Your data is used solely for evaluating local predictive models, displaying visual analytics, and proposing carbon saving advice. We do not sell or monetize personal data.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>3. Data Storage & Security</h4>
                        <p>Calculated outputs are stored securely. We apply industrial standard transport layer security (HTTPS) and encryption at rest to guarantee that data remains inaccessible to unauthorized entities.</p>
                    </div>
                );
                break;
            case 'terms':
                modalTitle = 'Terms of Service';
                modalContent = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
                        <p>Welcome to CarbonWiseSL. By using our application, you agree to comply with and be bound by the following terms.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>1. Permitted Use</h4>
                        <p>This application is intended to serve as an educational and operational tool for predicting carbon emissions and solar payback periods. Visualizations are estimates based on standard math models and should not replace formal engineering consultations.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>2. Intellectual Property</h4>
                        <p>All design assets, layout systems, source code formulas, and training parameters remain the intellectual property of CarbonWiseSL.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>3. Limitation of Liability</h4>
                        <p>In no event shall CarbonWiseSL or its developers be held liable for discrepancies in utility bill differences, grid outage damages, or solar savings projections, as these factors fluctuate beyond system models.</p>
                    </div>
                );
                break;
            case 'cookie':
                modalTitle = 'Cookie Policy';
                modalContent = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
                        <p>This Cookie Policy explains how and why we use cookies on our web application.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>What are Cookies?</h4>
                        <p>Cookies are small text files stored on your local browser to track session information. We use them strictly to remember your authentication status, active calculations, and theme parameters.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>Managing Cookies</h4>
                        <p>You can choose to disable cookies in your browser settings. Note that parts of our carbon calculators may function with diminished capacity if cookies are fully blocked.</p>
                    </div>
                );
                break;
            case 'accessibility':
                modalTitle = 'Accessibility Statement';
                modalContent = (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px', fontSize: '14px', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
                        <p>CarbonWiseSL is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>Conformance Status</h4>
                        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility. CarbonWiseSL conforms to WCAG 2.1 Level AA guidelines.</p>
                        <h4 style={{ color: '#B2DDE0', fontSize: '15px', fontWeight: '600' }}>Feedback</h4>
                        <p>We welcome your feedback on the accessibility of CarbonWiseSL. Please let us know if you encounter accessibility barriers by contacting us via our form.</p>
                    </div>
                );
                break;
            default:
                return null;
        }

        return (
            <div
                onClick={() => setActiveModal(null)}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(6, 10, 21, 0.85)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                    animation: 'fadeIn 0.25s ease'
                }}
            >
                <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                        background: '#111e35',
                        border: '1px solid rgba(178, 221, 224, 0.2)',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '560px',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        padding: '28px',
                        position: 'relative',
                        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
                        color: '#fff',
                        animation: 'fadeUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#fff', fontFamily: "'Poppins', sans-serif" }}>
                            {modalTitle}
                        </h3>
                        <button
                            onClick={() => setActiveModal(null)}
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: 'none',
                                color: 'rgba(255,255,255,0.6)',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                            }}
                        >
                            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    <div>
                        {modalContent}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <footer className="premium-footer">
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '40px',
                    marginBottom: '48px',
                }}>
                    {/* Column 1: Brand & Socials */}
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '16px',
                                cursor: 'pointer'
                            }}
                            onMouseEnter={() => setLogoHovered(true)}
                            onMouseLeave={() => setLogoHovered(false)}
                        >
                            <animated.div style={{ ...logoSpring, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src="/logo.png" alt="CarbonWiseSL Logo" className="logo-glow" style={{ width: 36, height: 36, objectFit: 'contain' }} />
                            </animated.div>
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontWeight: 700,
                                fontSize: 18,
                                color: '#fff',
                            }}>
                                CarbonWiseSL
                            </span>
                        </div>
                        <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--grey4)', maxWidth: '280px', marginBottom: '20px' }}>
                            AI-Powered Household Electricity Carbon Prediction and Reduction Platform for Urban Sri Lankan Households.
                        </p>
                        
                        {/* Social Media Links */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-icon"
                                aria-label="GitHub Link"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                                </svg>
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-icon"
                                aria-label="LinkedIn Link"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                                    <rect x="2" y="9" width="4" height="12"></rect>
                                    <circle cx="4" cy="4" r="2"></circle>
                                </svg>
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social-icon"
                                aria-label="Twitter Link"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                                </svg>
                            </a>
                            <a
                                href="mailto:info@carbonwisesl.com"
                                className="footer-social-icon"
                                aria-label="Email Link"
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                    <polyline points="22,6 12,13 2,6"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Navigate */}
                    <div>
                        <div className="footer-section-title">Navigate</div>
                        <div className="footer-link-group">
                            <Link to="/" className="footer-link">Home</Link>
                            <Link to="/calculate" className="footer-link">Calculate Footprint</Link>
                            <Link to="/solar" className="footer-link">Solar ROI Calculator</Link>
                            <Link to="/history" className="footer-link">Emission History</Link>
                        </div>
                    </div>

                    {/* Column 3: Help & Support */}
                    <div>
                        <div className="footer-section-title">Help & Support</div>
                        <div className="footer-link-group">
                            <button
                                onClick={() => { setActiveModal('contact'); setContactStatus(null); }}
                                className="footer-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                Contact Us
                            </button>
                            <button
                                onClick={() => { setActiveModal('faq'); setActiveFaq(null); }}
                                className="footer-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                FAQs
                            </button>
                            <button
                                onClick={() => setActiveModal('accessibility')}
                                className="footer-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                            >
                                Accessibility
                            </button>
                        </div>
                    </div>

                    {/* Column 4: Newsletter */}
                    <div>
                        <div className="footer-section-title">Newsletter</div>
                        <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--grey4)', marginBottom: '12px' }}>
                            Subscribe to get carbon-saving tips, grid emission alerts, and platform updates.
                        </p>
                        {subscribed ? (
                            <div className="newsletter-success">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>Subscribed successfully!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
                                <input
                                    type="email"
                                    required
                                    className="newsletter-input"
                                    placeholder="Enter your email"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    aria-label="Email for newsletter subscription"
                                />
                                <button
                                    type="submit"
                                    disabled={submittingNewsletter}
                                    className="newsletter-btn"
                                    style={{ width: '100%' }}
                                >
                                    {submittingNewsletter ? 'Subscribing...' : 'Subscribe'}
                                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="22" y1="2" x2="11" y2="13"></line>
                                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                    </svg>
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                    paddingTop: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div style={{ fontSize: '13px', color: 'var(--grey4)' }}>
                        © 2026 CarbonWiseSL. All rights reserved.
                    </div>
                    
                    {/* Legal Links */}
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setActiveModal('privacy')}
                            className="footer-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => setActiveModal('terms')}
                            className="footer-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}
                        >
                            Terms of Service
                        </button>
                        <button
                            onClick={() => setActiveModal('cookie')}
                            className="footer-link"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px' }}
                        >
                            Cookie Policy
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Interactive Overlays */}
            {renderModal()}
        </footer>
    );
}