import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Zap } from 'lucide-react';

export default function EmptyState({
    icon = <BarChart3 size={52} color="#0D7680" />,
    title = 'Nothing here yet',
    desc = 'Start by calculating your footprint.',
    actionLabel = 'Calculate Now',
    actionTo = '/calculate',
}) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: 340, textAlign: 'center', padding: 40,
            background: '#fff', borderRadius: 20,
            border: '2px dashed #D0D7E0',
        }}>
            <div style={{ marginBottom: 20 }}>{icon}</div>
            <h3 style={{
                fontSize: 20, fontWeight: 700, color: '#1B2A4A',
                fontFamily: "'Poppins',sans-serif", marginBottom: 10,
            }}>{title}</h3>
            <p style={{ fontSize: 14, color: '#8A9BB0', maxWidth: 320, lineHeight: 1.7, marginBottom: 28 }}>
                {desc}
            </p>
            <Link to={actionTo} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 10,
                background: 'linear-gradient(135deg,#0D7680,#0a5d65)',
                color: '#fff', fontWeight: 600, fontSize: 14,
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(13,118,128,0.30)',
            }}>
                <Zap size={14} /> {actionLabel}
            </Link>
        </div>
    );
}