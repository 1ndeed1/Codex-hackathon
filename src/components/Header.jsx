/* src/components/Header.jsx */
import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import ReputationDashboard from './ReputationDashboard';

const Header = ({ role, setRole, identity, onProfileClick, onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [menuRef]);

    const navItems = [
        { path: '/', label: 'Discovery Radar', icon: 'fa-radar' },
        { path: '/gapstart', label: 'GapStart', icon: 'fa-rocket' },
        { path: '/pathfinder', label: 'Pathfinder', icon: 'fa-route' },
        { path: '/projects', label: 'Open Projects', icon: 'fa-folder-open' },
        { path: '/community', label: 'Community', icon: 'fa-users' },
        { path: '/activity', label: 'Activity', icon: 'fa-chart-line' },
    ];
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
                <Link to="/" style={{ textDecoration: 'none' }}>
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
                </Link>

                <div onClick={onProfileClick} style={{ cursor: 'pointer' }}>
                    <ReputationDashboard
                        tier={identity.tier}
                        proofsCount={identity.proofs.length}
                        isVerified={identity.is_verified}
                    />
                </div>
            </div>

            <div style={{ position: 'relative' }} ref={menuRef}>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.3s ease',
                        boxShadow: isMenuOpen ? '0 0 15px rgba(188, 19, 254, 0.4)' : 'none'
                    }}
                >
                    <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`} style={{ color: 'var(--neon-purple)' }}></i>
                    Modules
                </button>

                {/* Dropdown Menu */}
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 15px)',
                    left: '50%',
                    transform: `translateX(-50%) ${isMenuOpen ? 'translateY(0)' : 'translateY(-10px)'}`,
                    opacity: isMenuOpen ? 1 : 0,
                    visibility: isMenuOpen ? 'visible' : 'hidden',
                    background: 'rgba(15, 15, 20, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '16px',
                    padding: '1rem',
                    width: 'max-content',
                    minWidth: '220px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    zIndex: 200
                }}>
                    {/* Decorative Top Accent */}
                    <div style={{
                        position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
                        background: 'var(--accent-gradient)', borderRadius: '2px'
                    }}></div>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            style={({ isActive }) => ({
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'var(--text-muted)',
                                padding: '12px 16px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                fontWeight: isActive ? 'bold' : 'normal',
                                transition: 'all 0.2s ease',
                                background: isActive ? 'linear-gradient(90deg, rgba(188, 19, 254, 0.1) 0%, transparent 100%)' : 'transparent',
                                borderLeft: isActive ? '3px solid var(--neon-purple)' : '3px solid transparent'
                            })}
                            onMouseEnter={(e) => {
                                if (!e.currentTarget.style.borderLeft.includes('var(--neon-purple)')) {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!e.currentTarget.style.borderLeft.includes('var(--neon-purple)')) {
                                    e.currentTarget.style.background = 'transparent';
                                }
                            }}
                        >
                            <i className={`fas ${item.icon}`} style={{
                                width: '20px',
                                textAlign: 'center',
                                color: 'var(--neon-blue)',
                                opacity: 0.8
                            }}></i>
                            {item.label}
                        </NavLink>
                    ))}
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
