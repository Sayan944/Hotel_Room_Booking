import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('hms_token') || '');
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info') => {
        setToast({ message, type, id: Date.now() });
        setTimeout(() => setToast(null), 4000);
    };

    const logout = (silent = false) => {
        localStorage.removeItem('hms_token');
        setToken('');
        setUser(null);
        if (!silent) {
            showToast('Logged out successfully.', 'info');
        }
    };

    useEffect(() => {
        if (token) {
            api.getProfile()
                .then(data => {
                    if (data && data.user) {
                        setUser(data.user);
                    }
                })
                .catch(err => {
                    console.error('Failed to load profile:', err);
                    logout(true);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        try {
            const data = await api.login({ email, password });
            localStorage.setItem('hms_token', data.token);
            setUser(data.user);
            setToken(data.token);
            showToast(`Welcome back, ${data.user.name}!`, 'success');
            return data.user;
        } catch (err) {
            showToast(err.message, 'error');
            throw err;
        }
    };

    const register = async (userData) => {
        try {
            const data = await api.register(userData);
            localStorage.setItem('hms_token', data.token);
            setUser(data.user);
            setToken(data.token);
            showToast(`Account created successfully! Welcome, ${data.user.name}.`, 'success');
            return data.user;
        } catch (err) {
            showToast(err.message, 'error');
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            role: user ? user.role : null,
            loading,
            login,
            register,
            logout,
            toast,
            showToast
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
