import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pathfinder.css';

const PathfinderTrackSelector = () => {
    const navigate = useNavigate();

    const tracks = [
        {
            id: 'classic',
            title: 'Classic Post-Grad',
            subtitle: 'Proven IT Career Paths',
            description: 'Focus on high-volume, established roles like Software Engineering, DevOps, and Data Science. The standard route for immediate industry entry.',
            icon: 'fa-user-graduate',
            color: 'var(--neon-purple)',
            stats: 'High Volume | Stable Growth'
        },
        {
            id: 'blooming',
            title: 'Blooming Hybrids',
            subtitle: 'High-Impact Frontier Sectors',
            description: 'Target the skills gap in Digital Health, Agri-Tech, Smart Factories, and Climate-Tech. Combine tech with domain expertise for maximum leverage.',
            icon: 'fa-seedling',
            color: 'var(--neon-blue)',
            stats: 'High Impact | Rapid Growth'
        }
    ];

    return (
        <div className="pathfinder-container" style={{ padding: '4rem 5%', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem', letterSpacing: '-2px' }}>Pick Your Career Velocity</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                    The industry is split. Do you want to compete in the established tech markets, or dominate the new, domain-heavy blooming sectors?
                </p>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '3rem',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                {tracks.map(track => (
                    <div
                        key={track.id}
                        onClick={() => navigate(`/pathfinder/track/${track.id}`)}
                        style={{
                            background: 'var(--glass-bg)',
                            border: `2px solid ${track.color}40`,
                            borderRadius: '24px',
                            padding: '3rem',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            boxShadow: `0 10px 30px ${track.color}10`
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.02)';
                            e.currentTarget.style.borderColor = track.color;
                            e.currentTarget.style.boxShadow = `0 20px 50px ${track.color}20`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = `${track.color}40`;
                            e.currentTarget.style.boxShadow = `0 10px 30px ${track.color}10`;
                        }}
                    >
                        <div style={{
                            width: '80px', height: '80px', borderRadius: '20px',
                            background: `${track.color}15`, color: track.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2.5rem'
                        }}>
                            <i className={`fas ${track.icon}`}></i>
                        </div>

                        <div>
                            <span style={{ color: track.color, fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                {track.subtitle}
                            </span>
                            <h2 style={{ fontSize: '2.2rem', margin: '0.5rem 0', color: 'var(--text-main)' }}>{track.title}</h2>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1.05rem' }}>{track.description}</p>
                        </div>

                        <div style={{
                            marginTop: 'auto',
                            padding: '1rem 1.5rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>{track.stats}</span>
                            <i className="fas fa-chevron-right" style={{ color: track.color }}></i>
                        </div>

                        {/* Decorative background glow */}
                        <div style={{
                            position: 'absolute',
                            top: '-20%',
                            right: '-20%',
                            width: '200px',
                            height: '200px',
                            background: `radial-gradient(circle, ${track.color}15 0%, transparent 70%)`,
                            zIndex: 0,
                            pointerEvents: 'none'
                        }}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PathfinderTrackSelector;
