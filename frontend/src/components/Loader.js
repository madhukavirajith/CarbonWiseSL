// frontend/src/components/Loader.js
import React from 'react';
import { Leaf } from 'lucide-react';

export default function Loader({ message = 'Calculating your carbon footprint...' }) {
    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            minHeight: 320, gap: 24,
        }}>
            {/* Spinning ring */}
            <div style={{ position: 'relative', width: 72, height: 72 }}>
                <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    border: '4px solid #E8ECF0',
                    borderTop: '4px solid #0D7680',
                    animation: 'spin 0.9s linear infinite',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#0D7680',
                }}>
                    <Leaf size={26} />
                </div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    fontSize: 16, fontWeight: 600, color: '#1B2A4A', marginBottom: 6,
                }}>{message}</div>
                <div style={{ fontSize: 13, color: '#8A9BB0' }}>
                    Running XGBoost · SHAP · K-Means…
                </div>
            </div>
            {/* Animated dots */}
            <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                    <div key={i} style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: '#0D7680',
                        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                ))}
            </div>
        </div>
    );
}