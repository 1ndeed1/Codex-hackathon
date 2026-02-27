/* src/components/AiAnalysisResult.jsx */
import React from 'react';

const AiAnalysisResult = ({ inference, logicGap, carbon, onPublish }) => {
    return (
        <div className="animate-fade" style={{ marginTop: '1rem' }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)',
                borderRadius: '20px',
                padding: '2rem',
                marginBottom: '2rem'
            }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--neon-blue)', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Inference</h4>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{inference}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: 'var(--neon-purple)', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>The Logic Gap</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{logicGap}</p>
                </div>

                <div style={{ display: 'flex', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>ENV. IMPACT</span>
                        <span style={{ color: '#4caf50', fontWeight: 800, fontSize: '0.8rem' }}>{carbon} CO2e</span>
                    </div>
                    <div>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>AI RESISTANCE</span>
                        <span style={{ color: 'var(--neon-orange)', fontWeight: 800, fontSize: '0.8rem' }}>100% (Human Only)</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onPublish}
                style={{
                    width: '100%',
                    background: 'var(--neon-blue)',
                    border: 'none',
                    color: '#000',
                    padding: '16px',
                    borderRadius: '14px',
                    fontWeight: 900,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 20px rgba(0, 242, 255, 0.2)'
                }}
            >
                Publish to Human Elite Network
            </button>
        </div>
    );
};

export default AiAnalysisResult;
