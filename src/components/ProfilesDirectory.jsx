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
                <div style={{ textAlign: 'center', color: 'var(--neon-blue)', padding: '3rem' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem' }}></i>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                    {profiles.map(profile => (
                        <div key={profile.id} className="glass-panel animate-fade" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--neon-blue), var(--neon-purple))',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '2rem',
                                color: 'white',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                boxShadow: '0 0 20px rgba(0, 142, 204, 0.4)'
                            }}>
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>@{profile.username}</h3>
                            <div style={{ color: 'var(--neon-blue)', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '1rem', letterSpacing: '1px' }}>
                                {profile.tier} TIER
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', width: '100%', justifyContent: 'center' }}>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <i className="fas fa-certificate" style={{ color: 'var(--neon-purple)' }}></i> {profile.vouches} Vouches
                                </span>
                            </div>

                            <button
                                onClick={() => onProfileSelect(profile.id)}
                                style={{
                                    marginTop: '1.5rem',
                                    width: '100%',
                                    background: 'transparent',
                                    border: '1px solid var(--neon-blue)',
                                    color: 'var(--neon-blue)',
                                    padding: '8px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s'
                                }}
                            >
                                View Solutions & Footprint
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfilesDirectory;
