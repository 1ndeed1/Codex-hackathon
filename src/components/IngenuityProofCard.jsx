/* src/components/IngenuityProofCard.jsx */
import React from 'react';

const IngenuityProofCard = ({ proof, onClose }) => {
    if (!proof) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
            padding: '2rem'
        }} onClick={onClose}>
            <div
                className="animate-fade"
                style={{
                    background: 'linear-gradient(145deg, #1a1a1e 0%, #0a0a0c 100%)',
                    border: '2px solid var(--neon-blue)',
                    borderRadius: '32px',
                    padding: '3rem',
                    maxWidth: '550px',
                    width: '100%',
                    position: 'relative',
                    boxShadow: '0 0 50px rgba(0, 242, 255, 0.2)',
                    textAlign: 'center'
                }}
                onClick={e => e.stopPropagation()}
            >
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--neon-blue)',
                    padding: '8px 20px',
                    borderRadius: '20px',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: '0.75rem',
                    letterSpacing: '1px',
                    textTransform: 'uppercase'
                }}>
                    Proof of Ingenuity
                </div>

                <div style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <i className="fas fa-microchip" style={{ fontSize: '3rem', color: 'var(--neon-blue)', marginBottom: '1.5rem' }}></i>
                    <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>LOGIC VERIFIED</h2>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Issued to: @TechnicalMercenary</span>
                </div>

                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    textAlign: 'left'
                }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontSize: '0.65rem', color: 'var(--neon-blue)', textTransform: 'uppercase' }}>Context</label>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{proof.title}</p>
                    </div>
                    <div>
                        <label style={{ fontSize: '0.65rem', color: 'var(--neon-blue)', textTransform: 'uppercase' }}>Efficiency Gain</label>
                        <p style={{ fontSize: '0.9rem', color: '#4caf50', fontWeight: 700 }}>{proof.optimization || '+64% Computation Efficiency'}</p>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--glass-border)',
                    paddingTop: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REPUTATION GAIN</span>
                        <div style={{ color: 'var(--neon-orange)', fontWeight: 800 }}>+500 SPARK</div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-main)',
                            padding: '10px 24px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        Export to Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IngenuityProofCard;
