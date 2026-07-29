import React, { useState } from 'react';
import GuestPoliciesModal from '../components/GuestPoliciesModal';

export default function LandingPage() {
    const [showTerms, setShowTerms] = useState(false);
    const [showPolicies, setShowPolicies] = useState(false);
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: '"Jost", -apple-system, sans-serif',
            position: 'relative',
            overflowX: 'hidden',
            background: 'linear-gradient(125deg, #ffffff 0%, #f4faf9 38%, #d9f0ec 75%, #c7ebe4 100%)'
        }}>
            <style>{`
                .landing-cta {
                    display: inline-block;
                    background: #005461;
                    color: #F4F4F4;
                    text-decoration: none;
                    font-size: 0.85rem;
                    letter-spacing: 0.1em;
                    padding: 0.9rem 2.3rem;
                    border: 1px solid transparent;
                    border-radius: 999px;
                    cursor: pointer;
                    transition: background 0.25s ease, color 0.25s ease, transform 0.3s ease;
                }
                .landing-cta:hover {
                    background: #00B7B5;
                    color: #ffffff;
                    transform: translateX(-10px);
                }
                .slide-track {
                    display: flex;
                    width: 400%;
                    height: 100%;
                    animation: slide-move 18s infinite ease-in-out;
                }
                .slide {
                    flex: 0 0 25%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
                }
                .slide:nth-child(1), .slide:nth-child(4) {
                    background-image: url("https://images.unsplash.com/photo-1780283574760-e8d7fd944da5?fm=jpg&q=70&w=2400&auto=format&fit=crop");
                }
                .slide:nth-child(2) {
                    background-image: url("https://images.unsplash.com/photo-1758448500688-3ababa93fd67?fm=jpg&q=70&w=2400&auto=format&fit=crop");
                }
                .slide:nth-child(3) {
                    background-image: url("https://images.unsplash.com/photo-1716667282993-cd8f2bffb91f?fm=jpg&q=70&w=2400&auto=format&fit=crop");
                }
                @keyframes slide-move {
                    0%   { transform: translateX(0%); }
                    28%  { transform: translateX(0%); }
                    33%  { transform: translateX(-25%); }
                    61%  { transform: translateX(-25%); }
                    66%  { transform: translateX(-50%); }
                    94%  { transform: translateX(-50%); }
                    100% { transform: translateX(-75%); }
                }
                .footer-link {
                    all: unset;
                    cursor: pointer;
                    color: rgba(244, 244, 244, 0.85);
                    font-size: 0.85rem;
                    letter-spacing: 0.02em;
                    display: inline-block;
                    transition: color 0.2s ease, transform 0.3s ease;
                }
                .footer-link:hover {
                    color: #F4F4F4;
                    text-decoration: underline;
                    transform: translateX(-6px);
                }
                @media (max-width: 900px) {
                    .page-layout { padding-left: 1.75rem !important; padding-right: 1.75rem !important; }
                    .left-col, .right-col { align-items: center !important; text-align: center !important; flex-basis: 100% !important; }
                    .brand-row { justify-content: center !important; }
                    .shape-frame { max-width: 90vw !important; top: 0 !important; right: 0 !important; height: 500px !important; border-radius: 20px !important; margin-top: 2rem !important; }
                }
            `}</style>

            <div className="page-layout" style={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: '2rem', maxWidth: '1600px', width: '100%', margin: '0 auto', padding: '2rem 2.5rem 3rem 4rem' }}>
                <div className="left-col" style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', paddingTop: '67px', paddingLeft: '39px' }}>
                    <div className="brand-row" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                        <div style={{ width: '92px', height: '92px', padding: '8px', background: '#ffffff', borderRadius: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(0, 84, 97, 0.18)', flexShrink: 0 }}>
                            <img src="/logo.png" alt="LUXESTAY Hotel logo" style={{ width: '100%', height: '100%', borderRadius: '100%', objectFit: 'contain' }} />
                        </div>
                        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, fontSize: 'clamp(2.1rem, 4.5vw, 3.1rem)', letterSpacing: '0.06em', color: '#005461' }}>
                            LUXESTAY
                        </span>
                    </div>

                    <div style={{ maxWidth: '34rem', marginBottom: '2.25rem' }}>
                        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 600, fontSize: 'clamp(1.9rem, 4vw, 2.7rem)', lineHeight: 1.25, margin: '0 0 1rem', color: '#163B3C' }}>
                            An Elegant Escape into Botanical Luxury
                        </h1>
                        <p style={{ fontSize: '0.98rem', lineHeight: 1.75, fontWeight: 300, color: '#3E5453', margin: 0 }}>
                            Experience award-winning eco-resorts across top global cities, featuring
                            premium organic design, thermal spas, and sustainable dining.
                        </p>
                    </div>

                    <a className="landing-cta" href="LoginPage">Book your First Stay &rarr;</a>
                </div>

                <div className="right-col" style={{ flex: '1 1 50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="shape-frame" style={{ position: 'relative', width: '100%', maxWidth: '836px', minWidth: '320px', aspectRatio: '4/5', borderRadius: '42% 58% 65% 35% / 45% 40% 60% 55%', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0, 84, 97, 0.28)', height: '700px', top: '-192px', right: '-76px' }}>
                        <div className="slide-track">
                            <div className="slide"></div>
                            <div className="slide"></div>
                            <div className="slide"></div>
                            <div className="slide"></div>
                        </div>
                    </div>
                </div>
            </div>

            <footer style={{ background: '#005461', padding: '1.5rem 1.5rem', textAlign: 'center', position: 'fixed', bottom: 0, width: '100%', zIndex: 10 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.75rem', marginBottom: '0.85rem' }}>
                    <button onClick={() => setShowTerms(true)} className="footer-link" style={{ all: 'unset', cursor: 'pointer', color: 'rgba(244,244,244,0.85)', fontSize: '0.85rem', letterSpacing: '0.02em', display: 'inline-block', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => e.target.style.color = '#F4F4F4'} onMouseLeave={e => e.target.style.color = 'rgba(244,244,244,0.85)'}>
                        Terms &amp; Conditions
                    </button>
                    <button onClick={() => setShowPolicies(true)} className="footer-link" style={{ all: 'unset', cursor: 'pointer', color: 'rgba(244,244,244,0.85)', fontSize: '0.85rem', letterSpacing: '0.02em', display: 'inline-block', transition: 'color 0.2s ease' }}
                        onMouseEnter={e => e.target.style.color = '#F4F4F4'} onMouseLeave={e => e.target.style.color = 'rgba(244,244,244,0.85)'}>
                        Guest &amp; Privacy Policies
                    </button>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'rgba(244, 244, 244, 0.6)', margin: 0 }}>
                    &copy; 2026 LUXESTAY Hotels Ltd. All rights reserved. Designed for premium professional excellence.
                </p>
            </footer>

            {/* Terms & Conditions Modal */}
            {showTerms && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(15,46,30,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
                    onClick={(e) => e.target === e.currentTarget && setShowTerms(false)}>
                    <div style={{ background: '#fff', width: '100%', maxWidth: '620px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 24px 64px rgba(15,46,30,0.25)' }}>
                        <div style={{ background: '#0f2e1e', padding: '1.25rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontFamily: '"Playfair Display",serif', fontSize: '1.2rem', fontWeight: 600 }}>Terms &amp; Conditions of Stay</h3>
                            <button onClick={() => setShowTerms(false)} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem' }}>✕ Close</button>
                        </div>
                        <div style={{ padding: '1.75rem', fontSize: '0.88rem', lineHeight: 1.7, color: '#374151', maxHeight: '65vh', overflowY: 'auto' }}>
                            <p style={{ marginTop: 0, fontWeight: 600, color: '#0f2e1e' }}>Welcome to LUXESTAY Hotels. By registering or reserving accommodations, guests agree to comply with the following regulations:</p>
                            <h4 style={{ color: '#0f2e1e', marginBottom: '0.25rem' }}>1. Booking Guarantee &amp; Deposit</h4>
                            <p>An advance booking requires deposit authorization. Cancellations made more than 48 hours prior to check-in will receive a full refund. Late cancellations or no-shows are subject to a 100% first-night tariff charge.</p>
                            <h4 style={{ color: '#0f2e1e', marginBottom: '0.25rem' }}>2. Check-In &amp; Check-Out Times</h4>
                            <p>Our official check-in time is scheduled from 15:00. Check-out must be completed by 11:00. Late check-out requests must be authorized with the Front Desk and may incur standard hourly fees.</p>
                            <h4 style={{ color: '#0f2e1e', marginBottom: '0.25rem' }}>3. Environmental &amp; Damage Policies</h4>
                            <p>Our locations are strictly non-smoking. Guests will be charged a penalty of ₹5,000 for violations. Damages to physical assets or room amenities will be invoiced to the credit card on file upon check-out.</p>
                            <h4 style={{ color: '#0f2e1e', marginBottom: '0.25rem' }}>4. Liability Disclaimer</h4>
                            <p style={{ marginBottom: 0 }}>LUXESTAY assumes no responsibility for precious valuables left in guest rooms. In-room digital safes are provided for guest security.</p>
                        </div>
                        <div style={{ padding: '1rem 1.75rem', borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', background: '#f9fafb' }}>
                            <button onClick={() => setShowTerms(false)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 20px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>
                                I Understand &amp; Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guest Policies Modal */}
            {showPolicies && <GuestPoliciesModal onClose={() => setShowPolicies(false)} />}
        </div>
    );
}
