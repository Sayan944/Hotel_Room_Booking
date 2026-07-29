import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import GuestDashboard from './pages/GuestDashboard';
import AdminDashboard from './pages/AdminDashboard';
import FrontDeskDashboard from './pages/FrontDeskDashboard';
import LandingPage from './pages/LandingPage';

function AppContent() {
    const { user, loading } = useAuth();
    const queryParams = new URLSearchParams(window.location.search);
    const hasSignupQuery = queryParams.get('signup') === 'true';

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                color: '#16a34a'
            }}>
                <img src="/logo.png" className="animate-bounce" style={{ width: '100px', height: '100px', objectFit: 'contain' }} alt="LUXESTAY Logo" />
                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: '#0f2e1e' }}>Loading LUXESTAY Systems...</p>
            </div>
        );
    }

    if (!user && !hasSignupQuery && window.location.pathname === '/') {
        return <LandingPage />;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1 }}>
                {!user ? (
                    <LoginPage />
                ) : user.role === 'admin' ? (
                    <AdminDashboard />
                ) : user.role === 'frontdesk' ? (
                    <FrontDeskDashboard />
                ) : (
                    <GuestDashboard />
                )}
            </main>
            {user && <Footer />}
            <Toast />
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}
