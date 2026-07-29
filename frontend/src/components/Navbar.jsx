import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCheck, ShieldCheck } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <header style={{
            height: '110px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <img src="/logo.png" alt="LUXESTAY Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
                <span className="font-serif" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f2e1e' }}>
                    LUXESTAY
                </span>
            </div>

            {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '4px 12px',
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #dcfce7',
                        borderRadius: '20px'
                    }}>
                        {user.role === 'admin' ? (
                            <ShieldCheck style={{ width: '18px', height: '18px', color: '#0f2e1e' }} />
                        ) : (
                            <UserCheck style={{ width: '18px', height: '18px', color: '#16a34a' }} />
                        )}
                        <div style={{ fontSize: '0.85rem' }}>
                            <span style={{ fontWeight: 600, color: '#0f2e1e' }}>{user.name}</span>
                            <span style={{
                                marginLeft: '6px',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                backgroundColor: user.role === 'admin' ? '#0f2e1e' : '#16a34a',
                                color: '#ffffff'
                            }}>
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={logout}
                        className="btn btn-outline"
                        style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                    >
                        <LogOut style={{ width: '15px', height: '15px' }} />
                        Sign Out
                    </button>
                </div>
            )}
        </header>
    );
}
