import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ProfilesDirectory = ({ onProfileSelect }) => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('vouches', { ascending: false });

            if (!error && data) {
                setProfiles(data);
            }
            setLoading(false);
        };
        fetchProfiles();
    }, []);

    return (
        <div style={{ padding: '2rem 10%', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Global Engineering Roster</h2>
                <p style={{ color: 'var(--text-muted)' }}>Browse verified problem solvers, view their public solutions, and explore their logic footprints.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'var(--neon-blue)', padding: '6rem' }}>
                    <i className="fas fa-radar fa-spin" style={{ fontSize: '3rem', opacity: 0.5 }}></i>
                    <h3 style={{ marginTop: '1.5rem', color: 'var(--text-muted)' }}>Scanning Global Roster...</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                    {profiles.map(profile => (
                        <div key={profile.id} className="animate-fade" style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '32px', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0, 142, 204, 0.12)'; e.currentTarget.style.borderColor = 'var(--neon-blue)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '28px',
                                background: 'var(--accent-gradient)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '2.5rem',
                                color: 'white',
                                fontWeight: 800,
                                marginBottom: '1.5rem',
                                boxShadow: '0 8px 25px rgba(155, 12, 252, 0.25)',
                                transform: 'rotate(-3deg)'
                            }}>
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-main)', marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>@{profile.username}</h3>
                            <div style={{ background: 'rgba(0, 142, 204, 0.05)', color: 'var(--neon-blue)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '8px', marginBottom: '1.5rem', letterSpacing: '1px' }}>
                                {profile.tier} TIER
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', width: '100%', justifyContent: 'center' }}>
                                <span style={{ color: 'var(--text-main)', fontSize: '0.95rem', fontWeight: 600 }}>
                                    <i className="fas fa-certificate" style={{ color: 'var(--neon-purple)', marginRight: '6px' }}></i> {profile.vouches} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Vouches</span>
                                </span>
                            </div>

                            <button
                                onClick={() => onProfileSelect(profile.id)}
                                style={{
                                    marginTop: '2rem',
                                    width: '100%',
                                    background: 'var(--text-main)',
                                    border: 'none',
                                    color: 'white',
                                    padding: '12px',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                                onMouseOver={e => e.currentTarget.style.background = 'var(--neon-blue)'}
                                onMouseOut={e => e.currentTarget.style.background = 'var(--text-main)'}
                            >
                                <i className="fas fa-fingerprint"></i> View Solutions
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilesDirectory;
