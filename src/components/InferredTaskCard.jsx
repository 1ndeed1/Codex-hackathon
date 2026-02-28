/* src/components/InferredTaskCard.jsx */
import React from 'react';

const InferredTaskCard = ({ task, onClick }) => {
    return (
        <div
            className="glass-panel animate-fade"
            onClick={onClick}
            style={{
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                borderLeft: '4px solid var(--neon-blue)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'linear-gradient(135deg, rgba(0, 242, 255, 0.1) 0%, rgba(255,255,255,0.8) 100%)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{ position: 'absolute', top: '10px', right: '15px' }}>
                <span style={{
                    fontSize: '0.6rem',
                    background: 'var(--neon-blue)',
                    color: '#000',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 900
                }}>AI MINED</span>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    <i className="fas fa-radar" style={{ color: 'var(--neon-blue)', marginRight: '6px' }}></i>
                    {task.source} / {task.channel}
                </span>
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{task.title}</h3>

            <div style={{
                background: 'rgba(255,255,255,0.8)',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                border: '1px dashed var(--neon-blue)'
            }}>
                <label style={{ fontSize: '0.6rem', color: 'var(--neon-blue)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Detected Signal</label>
                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{task.signal}"</p>
            </div>

            <div style={{ marginBottom: '1.5rem', flex: 1 }}>
                <label style={{ fontSize: '0.6rem', color: 'var(--neon-purple)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>AI Inference</label>
                <p style={{ fontSize: '0.85rem' }}>{task.inference}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>EST. BUDGET</span>
                    <span style={{ color: 'var(--neon-orange)', fontWeight: 800 }}>{task.estimated_price || 'Evaluating...'}</span>
                </div>
                <button style={{
                    background: 'transparent',
                    border: '1px solid var(--neon-blue)',
                    color: 'var(--neon-blue)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                }}>Build Proposal</button>
            </div>
        </div>
    );
};

export default InferredTaskCard;
