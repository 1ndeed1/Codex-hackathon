/* src/components/Header.jsx */
import React from 'react';
import ReputationDashboard from './ReputationDashboard';

const Header = ({ role, setRole, identity, activeTab, setActiveTab, onProfileClick, onLogout }) => {
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
                    <ReputationDashboard
                        tier={identity.tier}
                        proofsCount={identity.proofs.length}
                        isVerified={identity.is_verified}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
                <button
                    onClick={() => setActiveTab('radar')}
                    style={{ background: 'transparent', border: 'none', color: activeTab === 'radar' ? 'var(--neon-blue)' : 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === 'radar' ? '2px solid var(--neon-blue)' : 'none', paddingBottom: '4px' }}>
                    Discovery Radar
                </button>
                <button
                    onClick={() => setActiveTab('gapstart')}
                    style={{ background: 'transparent', border: 'none', color: activeTab === 'gapstart' ? 'var(--neon-blue)' : 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === 'gapstart' ? '2px solid var(--neon-blue)' : 'none', paddingBottom: '4px' }}>
                    GapStart
                </button>
                <button
                    onClick={() => setActiveTab('projects')}
                    style={{ background: 'transparent', border: 'none', color: activeTab === 'projects' ? 'var(--neon-purple)' : 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === 'projects' ? '2px solid var(--neon-purple)' : 'none', paddingBottom: '4px' }}>
                    Open Projects
                </button>
                <button
                    onClick={() => setActiveTab('community')}
                    style={{ background: 'transparent', border: 'none', color: activeTab === 'community' ? 'var(--neon-orange)' : 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === 'community' ? '2px solid var(--neon-orange)' : 'none', paddingBottom: '4px' }}>
                    Community
                </button>
                <button
                    onClick={() => setActiveTab('activity')}
                    style={{ background: 'transparent', border: 'none', color: activeTab === 'activity' ? 'var(--neon-green)' : 'var(--text-muted)', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', borderBottom: activeTab === 'activity' ? '2px solid var(--neon-green)' : 'none', paddingBottom: '4px' }}>
                    Activity
                </button>
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
                <button
                    onClick={() => setRole('producer')}
                    style={{
                        padding: '8px 16px',
                        border: 'none',
                        background: role === 'producer' ? 'var(--glass-border)' : 'transparent',
                        color: role === 'producer' ? 'var(--text-main)' : 'var(--text-muted)',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        fontWeight: 600,
                        transition: 'all 0.3s ease'
                    }}
                >
                    Producer
                </button>
            </div>

            <div style={{ color: 'var(--text-main)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-award" style={{ color: 'var(--neon-purple)' }}></i>
                    {identity.vouches} Logic Vouches
                </div>
                <button
                    onClick={onLogout}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem' }}
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
