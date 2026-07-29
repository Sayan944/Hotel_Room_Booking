import React, { useState } from 'react';
import GuestPoliciesModal from './GuestPoliciesModal';

export default function Footer() {
    const [showTerms, setShowTerms] = useState(false);
    const [showPolicies, setShowPolicies] = useState(false);

    const handleReset = () => {
        if (window.confirm('Reset the system sandbox? This will clear all session data and reload the app.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    return (
        <>
            <footer style={{
                backgroundColor: '#0f2e1e',
                color: '#cbd5e1',
                padding: '2rem',
                textAlign: 'center',
                borderTop: '1px solid #14532d',
                fontSize: '0.85rem',
            }}>
                {/* Links */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setShowTerms(true)}
                        style={{ background: 'none', border: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.25s' }}
                        onMouseEnter={e => e.target.style.color = '#ffffff'}
                        onMouseLeave={e => e.target.style.color = '#cbd5e1'}
                    >
                        Terms &amp; Conditions
                    </button>
                    <button
                        onClick={() => setShowPolicies(true)}
                        style={{ background: 'none', border: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.25s' }}
                        onMouseEnter={e => e.target.style.color = '#ffffff'}
                        onMouseLeave={e => e.target.style.color = '#cbd5e1'}
                    >
                        Guest &amp; Privacy Policies
                    </button>
                    <button
                        onClick={handleReset}
                        style={{ background: 'none', border: 'none', padding: 0, color: '#cbd5e1', fontSize: '0.85rem', cursor: 'pointer', transition: 'color 0.25s' }}
                        onMouseEnter={e => e.target.style.color = '#ffffff'}
                        onMouseLeave={e => e.target.style.color = '#cbd5e1'}
                    >
                        ↺ Reset System Sandbox
                    </button>
                </div>

                {/* Copyright */}
                <p style={{ margin: 0 }}>
                    &copy; {new Date().getFullYear()} LUXESTAY Hotels Ltd. All rights reserved. Designed for premium professional excellence.
                </p>
            </footer>

            {/* Terms & Conditions Modal */}
            {showTerms && (
                <div
                    style={{ position:'fixed',inset:0,zIndex:1000,background:'rgba(15,46,30,0.65)',backdropFilter:'blur(4px)',display:'flex',alignItems:'center',justifyContent:'center',padding:'1rem' }}
                    onClick={(e) => e.target === e.currentTarget && setShowTerms(false)}
                >
                    <div style={{ background:'#fff',width:'100%',maxWidth:'620px',borderRadius:'16px',overflow:'hidden',boxShadow:'0 24px 64px rgba(15,46,30,0.25)' }}>
                        {/* Header */}
                        <div style={{ background:'#0f2e1e',padding:'1.25rem 1.75rem',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                            <h3 style={{ margin:0,color:'#fff',fontFamily:'"Playfair Display",serif',fontSize:'1.2rem',fontWeight:600 }}>Terms &amp; Conditions of Stay</h3>
                            <button onClick={() => setShowTerms(false)} style={{ background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'#fff',borderRadius:'8px',padding:'6px 14px',cursor:'pointer',fontWeight:600,fontSize:'0.82rem' }}>✕ Close</button>
                        </div>
                        {/* Body */}
                        <div style={{ padding:'1.75rem',fontSize:'0.88rem',lineHeight:1.7,color:'#374151',maxHeight:'65vh',overflowY:'auto' }}>
                            <p style={{ marginTop:0,fontWeight:600,color:'#0f2e1e' }}>Welcome to LUXESTAY Hotels. By registering or reserving accommodations, guests agree to comply with the following regulations:</p>

                            <h4 style={{ color:'#0f2e1e',marginBottom:'0.25rem' }}>1. Booking Guarantee &amp; Deposit</h4>
                            <p>An advance booking requires deposit authorization. Cancellations made more than 48 hours prior to check-in will receive a full refund. Late cancellations or no-shows are subject to a 100% first-night tariff charge.</p>

                            <h4 style={{ color:'#0f2e1e',marginBottom:'0.25rem' }}>2. Check-In &amp; Check-Out Times</h4>
                            <p>Our official check-in time is scheduled from 15:00. Check-out must be completed by 11:00. Late check-out requests must be authorized with the Front Desk and may incur standard hourly fees.</p>

                            <h4 style={{ color:'#0f2e1e',marginBottom:'0.25rem' }}>3. Environmental &amp; Damage Policies</h4>
                            <p>Our locations are strictly non-smoking. Guests will be charged a penalty of ₹5,000 for violations. Damages to physical assets or room amenities will be invoiced to the credit card on file upon check-out.</p>

                            <h4 style={{ color:'#0f2e1e',marginBottom:'0.25rem' }}>4. Liability Disclaimer</h4>
                            <p style={{ marginBottom:0 }}>LUXESTAY assumes no responsibility for precious valuables left in guest rooms. In-room digital safes are provided for guest security.</p>
                        </div>
                        {/* Footer */}
                        <div style={{ padding:'1rem 1.75rem',borderTop:'1px solid #e5e7eb',display:'flex',justifyContent:'flex-end',background:'#f9fafb' }}>
                            <button
                                onClick={() => setShowTerms(false)}
                                style={{ background:'#16a34a',color:'#fff',border:'none',borderRadius:'8px',padding:'8px 20px',fontWeight:600,fontSize:'0.88rem',cursor:'pointer' }}
                            >
                                I Understand &amp; Accept
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guest Policies Modal */}
            {showPolicies && <GuestPoliciesModal onClose={() => setShowPolicies(false)} />}
        </>
    );
}
