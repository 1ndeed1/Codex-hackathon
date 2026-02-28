/* src/components/ReputationDashboard.jsx */
import React from 'react';

const ReputationDashboard = ({ tier, proofsCount, isVerified }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '8px 16px',
            borderRadius: '12px',
            border: '1px solid var(--glass-border)'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expert Tier</span>
                <span style={{
                    color: 'var(--neon-blue)',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textShadow: '0 0 10px rgba(0, 242, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    {tier} Rank
                    {isVerified && <i className="fas fa-check-circle" style={{ color: 'var(--neon-blue)', fontSize: '0.81rem' }} title="Verified Identity"></i>}
                </span>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }}></div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ingenuity Proofs</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <i className="fas fa-certificate" style={{ color: 'var(--neon-purple)', fontSize: '0.7rem' }}></i>
                    <span style={{ fontWeight: 800 }}>{proofsCount} Collected</span>
                </div>
            </div>
        </div>
    );
};

export default ReputationDashboard;
