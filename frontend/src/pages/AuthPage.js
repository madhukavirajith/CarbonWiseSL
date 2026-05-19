import React, { useState, useContext } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AppContext } from '../App';
import { loginUser, signupUser } from '../api';

const S = {
    container: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A1128 0%, #101F42 50%, #0D3B45 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 40px',
        fontFamily: "'Poppins', sans-serif",
        color: '#fff',
    },
    card: {
        background: 'rgba(255, 255, 255, 0.04)',
        backdropFilter: 'blur(20px)',
        borderRadius: 24,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: 440,
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    header: {
        textAlign: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 800,
        marginBottom: 8,
        background: 'linear-gradient(135deg, #ffffff 30%, #B2DDE0 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: 600,
        color: '#B2DDE0',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    input: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: '12px 16px',
        color: '#fff',
        fontSize: 14,
        outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s',
    },
    button: {
        background: 'linear-gradient(135deg, #0D7680, #0a5d65)',
        border: 'none',
        borderRadius: 12,
        padding: '14px',
        color: '#fff',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(13, 118, 128, 0.3)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    switchText: {
        textAlign: 'center',
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
    },
    switchLink: {
        color: '#B2DDE0',
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'underline',
        marginLeft: 4,
    },
    errorAlert: {
        background: 'rgba(192, 57, 43, 0.15)',
        border: '1px solid rgba(192, 57, 43, 0.3)',
        borderRadius: 12,
        padding: '12px 16px',
        color: '#FF8A80',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    successAlert: {
        background: 'rgba(26, 122, 74, 0.15)',
        border: '1px solid rgba(26, 122, 74, 0.3)',
        borderRadius: 12,
        padding: '12px 16px',
        color: '#80CBC4',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
    },
    spinner: {
        width: 18,
        height: 18,
        border: '2px solid rgba(255,255,255,0.3)',
        borderTop: '2px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    }
};

export default function AuthPage() {
    const { user, login } = useContext(AppContext);
    const [isSignUp, setIsSignUp] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // If already logged in, redirect to calculate
    if (user) {
        return <Navigate to="/calculate" replace />;
    }

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError('');
        setSuccess('');
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validations
        if (!email) return setError('Email or Username is required.');
        if (!password) return setError('Password is required.');

        if (isSignUp) {
            if (!username) return setError('Username is required.');
            if (password.length < 6) return setError('Password must be at least 6 characters.');
            if (password !== confirmPassword) return setError('Passwords do not match.');
        }

        setLoading(true);
        try {
            if (isSignUp) {
                // Register
                const res = await signupUser({ username, email, password });
                setSuccess('Account created successfully! Logging you in...');
                setTimeout(() => {
                    login(res.data);
                    navigate('/calculate');
                }, 1500);
            } else {
                // Login
                const res = await loginUser({ email, password });
                login(res.data);
                navigate('/calculate');
            }
        } catch (err) {
            setError(err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={S.container}>
            <div style={S.card}>
                <div style={S.header}>
                    <h2 style={S.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
                    <p style={S.subtitle}>
                        {isSignUp 
                            ? 'Sign up to track and reduce your carbon footprint' 
                            : 'Sign in to access your saved emission history'}
                    </p>
                </div>

                {error && (
                    <div style={S.errorAlert}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                {success && (
                    <div style={S.successAlert}>
                        <span>✅</span> {success}
                    </div>
                )}

                <form style={S.form} onSubmit={handleSubmit}>
                    {isSignUp && (
                        <div style={S.inputGroup}>
                            <label style={S.label}>Username</label>
                            <input 
                                style={S.input} 
                                type="text"
                                placeholder="e.g. green_household"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <div style={S.inputGroup}>
                        <label style={S.label}>{isSignUp ? 'Email Address' : 'Email or Username'}</label>
                        <input 
                            style={S.input} 
                            type="text"
                            placeholder={isSignUp ? "e.g. user@example.com" : "Enter email or username"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={S.inputGroup}>
                        <label style={S.label}>Password</label>
                        <input 
                            style={S.input} 
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div style={S.inputGroup}>
                            <label style={S.label}>Confirm Password</label>
                            <input 
                                style={S.input} 
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                    )}

                    <button 
                        style={S.button} 
                        type="submit" 
                        disabled={loading}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                    >
                        {loading && <div style={S.spinner} />}
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <div style={S.switchText}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <span style={S.switchLink} onClick={toggleMode}>
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </span>
                </div>
            </div>
        </div>
    );
}
