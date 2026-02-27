/* src/components/Header.jsx */
import React from 'react';
import ReputationDashboard from './ReputationDashboard';

const Header = ({ role, setRole, identity, onProfileClick }) => {
    return (
        <header style={{
            padding: '1.5rem 5%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--glass-border)',
            backdropFilter: 'blur(10px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: 'rgba(10, 10, 12, 0.8)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                <div style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    letterSpacing: '-1.5px',
                    background: 'var(--accent-gradient)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textTransform: 'uppercase'
                }}>
                    SlipStreamAI
                </div>

                <div onClick={onProfileClick} style={{ cursor: 'pointer' }}>
                    <ReputationDashboard tier={identity.tier} proofsCount={identity.proofs.length} />
                </div>
            </div>

            <div style={{
                display: 'flex',
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                padding: '4px',
                borderRadius: '12px'
            }}>
                <button
                    onClick={() => setRole('engineer')}
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        background: role === 'engineer' ? 'var(--glass-border)' : 'transparent',
                        color: role === 'engineer' ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    Engineer
                </button>
                <button
                    onClick={() => setRole('sponsor')}
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        background: role === 'sponsor' ? 'var(--glass-border)' : 'transparent',
                        color: role === 'sponsor' ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    Sponsor
                </button>
            </div>

            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-award" style={{ color: 'var(--neon-purple)' }}></i>
                {identity.vouches} Logic Vouches
            </div>
        </header>
    );
};

export default Header;
