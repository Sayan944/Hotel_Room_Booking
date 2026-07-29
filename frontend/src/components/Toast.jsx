import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Toast() {
    const { toast } = useAuth();

    if (!toast) return null;

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-600" style={{ color: '#16a34a', width: '20px', height: '20px' }} />,
        error: <AlertCircle className="w-5 h-5 text-rose-600" style={{ color: '#b91c1c', width: '20px', height: '20px' }} />,
        info: <Info className="w-5 h-5 text-amber-600" style={{ color: '#b45309', width: '20px', height: '20px' }} />
    };

    return (
        <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 18px',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(15, 46, 30, 0.15)',
            color: '#111827',
            maxWidth: '380px',
            animation: 'fadeIn 0.3s ease-out'
        }}>
            {icons[toast.type] || icons.info}
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{toast.message}</span>
        </div>
    );
}
