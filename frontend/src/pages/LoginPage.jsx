import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, Phone, Shield, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const { login, register } = useAuth();
    const queryParams = new URLSearchParams(window.location.search);
    const [isSignUp, setIsSignUp] = useState(queryParams.get('signup') === 'true');
    const [loading, setLoading] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('guest');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                await register({ name, email, password, phone, role });
            } else {
                await login(email, password);
            }
        } catch (err) {
            // Handled in AuthContext toast
        } finally {
            setLoading(false);
        }
    };

    const handleQuickLogin = async (presetRole) => {
        setLoading(true);
        try {
            if (presetRole === 'admin') {
                await login('admin@grandresort.com', 'admin123');
            } else if (presetRole === 'frontdesk') {
                await login('frontdesk@grandresort.com', 'frontdesk123');
            } else {
                await login('jane.doe@example.com', 'guest123');
            }
        } catch (err) {
            // Handled
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 70px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.5rem',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 40%, #f9fafb 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Ambient Leaf Accents in Background */}
            <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(22, 163, 74, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-50px',
                left: '-50px',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(15, 46, 30, 0.1) 0%, rgba(255, 255, 255, 0) 70%)',
                pointerEvents: 'none'
            }} />

            <div className="glass-panel animate-fade-in" style={{
                width: '100%',
                maxWidth: '480px',
                padding: '2.8rem 2.2rem',
                borderRadius: '24px',
                backgroundColor: '#ffffff',
                border: '1px solid #dcfce7',
                boxShadow: '0 20px 40px -15px rgba(15, 46, 30, 0.12)',
                position: 'relative',
                zIndex: 2
            }}>
                {/* Logo & Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#16a34a',
                        backgroundColor: '#f0fdf4',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        letterSpacing: '0.1em',
                        display: 'inline-block',
                        marginBottom: '10px',
                        border: '1px solid #dcfce7'
                    }}>
                        🌿 Welcome to Botanical Hospitality
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '6px' }}>
                        <img src="/logo.png" alt="LUXESTAY Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
                        <h2 className="font-serif" style={{ fontSize: '2rem', color: '#0f2e1e', fontWeight: 700 }}>
                            LUXESTAY
                        </h2>
                    </div>
                    <p style={{ color: '#4b5563', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto', lineHeight: 1.4 }}>
                        {isSignUp ? 'Begin your journey to serene resort retreats & personalized stays across India.' : 'Sign in to access your hotel reservation portal & management dashboard.'}
                    </p>
                </div>

                {/* Tab Switcher */}
                <div style={{
                    display: 'flex',
                    backgroundColor: '#f0fdf4',
                    padding: '5px',
                    borderRadius: '30px',
                    marginBottom: '1.8rem',
                    border: '1px solid #dcfce7'
                }}>
                    <button
                        onClick={() => setIsSignUp(false)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            borderRadius: '25px',
                            backgroundColor: !isSignUp ? '#0f2e1e' : 'transparent',
                            color: !isSignUp ? '#ffffff' : '#16a34a',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.25s',
                            boxShadow: !isSignUp ? '0 4px 10px rgba(15, 46, 30, 0.2)' : 'none'
                        }}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setIsSignUp(true)}
                        style={{
                            flex: 1,
                            padding: '10px',
                            border: 'none',
                            borderRadius: '25px',
                            backgroundColor: isSignUp ? '#0f2e1e' : 'transparent',
                            color: isSignUp ? '#ffffff' : '#16a34a',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.25s',
                            boxShadow: isSignUp ? '0 4px 10px rgba(15, 46, 30, 0.2)' : 'none'
                        }}
                    >
                        Sign Up
                    </button>
                </div>



                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {isSignUp && (
                        <div>
                            <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                                Full Name
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                                <input
                                    type="text"
                                    required
                                    placeholder="Jane Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field"
                                    style={{ paddingLeft: '38px' }}
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                            Email Address
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                            <input
                                type="email"
                                required
                                placeholder="name@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
                                style={{ paddingLeft: '38px' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field"
                                style={{ paddingLeft: '38px' }}
                            />
                        </div>
                    </div>

                    {isSignUp && (
                        <>
                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                                    Phone Number
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Phone style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                                    <input
                                        type="tel"
                                        placeholder="+1 555-0199"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="input-field"
                                        style={{ paddingLeft: '38px' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '0.8rem', color: '#0f2e1e', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                                    Account Role
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Shield style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#9ca3af' }} />
                                    <select
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        className="input-field"
                                        style={{ paddingLeft: '38px' }}
                                    >
                                        <option value="guest">Guest / Traveler</option>
                                        <option value="frontdesk">Front Desk Staff</option>
                                        <option value="admin">Hotel Administrator</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                        style={{ marginTop: '8px', padding: '12px', width: '100%', borderRadius: '8px' }}
                    >
                        {loading ? 'Processing...' : (
                            <>
                                {isSignUp ? 'Create Account' : 'Sign In'}
                                <ArrowRight style={{ width: '16px', height: '16px' }} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
