import React from 'react';
import { Wind, Leaf, Users, Home, Lightbulb } from 'lucide-react';

const clusterColors = {
    0: { primary: '#0D7680', bg: '#E6F4F5', border: '#B2DDE0' },
    1: { primary: '#1A7A4A', bg: '#E8F5EE', border: '#A8D8B9' },
    2: { primary: '#7B3F9E', bg: '#F3EBF8', border: '#D4A8E8' },
};

const iconMap = {
    '❄️': Wind,
    '🌿': Leaf,
    '👨‍👩‍👧‍👦': Users,
    '🏠': Home,
};

export default function ClusterCard({ cluster }) {
    if (!cluster) return null;

    const { cluster_id, cluster_name, cluster_icon, recommendations } = cluster;
    const colors = clusterColors[cluster_id] || clusterColors[0];
    const IconComponent = iconMap[cluster_icon] || Home;

    return (
        <div style={{
            background: '#fff',
            borderRadius: 16,
            border: `1.5px solid ${colors.border}`,
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '20px 24px',
                background: `linear-gradient(135deg, ${colors.bg}, #fff)`,
                borderBottom: `1px solid ${colors.border}`,
                display: 'flex', alignItems: 'center', gap: 14,
            }}>
                <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: colors.primary + '18',
                    border: `1.5px solid ${colors.primary}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: colors.primary,
                    flexShrink: 0,
                }}>
                    <IconComponent size={24} />
                </div>
                <div>
                    <div style={{
                        fontSize: 11, fontWeight: 700, color: colors.primary,
                        textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 3,
                    }}>
                        Your Household Profile
                    </div>
                    <div style={{
                        fontSize: 18, fontWeight: 800, color: '#1B2A4A',
                        fontFamily: "'Poppins', sans-serif",
                    }}>
                        {cluster_name}
                    </div>
                </div>
            </div>

            {/* Recommendations */}
            <div style={{ padding: '20px 24px' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    fontSize: 12, fontWeight: 700, color: '#8A9BB0',
                    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 14,
                }}>
                    <Lightbulb size={14} color="#C8932A" /> Personalised Recommendations
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {recommendations.map((rec, i) => (
                        <div key={i} style={{
                            display: 'flex', gap: 12, alignItems: 'flex-start',
                            padding: '14px 16px', borderRadius: 10,
                            background: i === 0 ? colors.bg : '#F4F6F8',
                            border: `1px solid ${i === 0 ? colors.border : '#E8ECF0'}`,
                        }}>
                            <div style={{
                                width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                                background: colors.primary, color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 12, fontWeight: 700,
                            }}>
                                {i + 1}
                            </div>
                            <p style={{
                                fontSize: 13, color: '#1B2A4A', lineHeight: 1.7, margin: 0,
                            }}>
                                {rec}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}