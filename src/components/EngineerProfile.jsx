/* src/components/EngineerProfile.jsx */
import React from 'react';

const EngineerProfile = ({ identity, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
            padding: '2rem'
        }} onClick={onClose}>
            <div
                className="animate-fade"
                style={{
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '32px',
                    padding: '3rem',
                    maxWidth: '800px',
                    width: '100%',
                    position: 'relative',
                    maxHeight: '85vh',
                    overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '25px',
                        right: '25px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '2rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'var(--accent-gradient)',
                        borderRadius: '24px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '2.5rem',
                        color: 'white',
                        fontWeight: 800
                    }}>
                        TM
                    </div>
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>@TechnicalMercenary</h2>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <span style={{ color: 'var(--neon-blue)', fontWeight: 700 }}>{identity.tier} Rank</span>
                            <span style={{ color: 'var(--neon-purple)', fontWeight: 700 }}>{identity.vouches} Logic Vouches</span>
                            <span style={{ color: 'var(--text-muted)' }}>{identity.proofs.length} Proofs</span>
                        </div>
                    </div>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Ingenuity Portfolio</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {identity.proofs.length > 0 ? identity.proofs.map((proof, i) => (
                        <div key={i} style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--neon-blue)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            position: 'relative'
                        }}>
                            <i className="fas fa-certificate" style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--neon-blue)' }}></i>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{proof.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Impact: {proof.optimization}</p>
                            <div style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', fontWeight: 800 }}>STATUS: VERIFIED BY SYSTEM</div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', border: '1px dashed var(--glass-border)', borderRadius: '20px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No ingenuity proofs collected yet. Start solving predictive opportunities!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EngineerProfile;
