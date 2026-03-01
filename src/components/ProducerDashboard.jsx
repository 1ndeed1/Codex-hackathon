/* src/components/ProducerDashboard.jsx */
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ProducerDashboard = ({ identity }) => {
    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAgreements = async () => {
            if (!identity?.id) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('agreements')
                .select('*, projects(name), founder:founder_id(username)')
                .eq('producer_id', identity.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setAgreements(data);
            }
            setLoading(false);
        };
        fetchAgreements();
    }, [identity]);

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
            <section style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Agreement Pipeline</h1>
                <p style={{ color: 'var(--text-muted)' }}>Monitor contract status, verify milestones, and scale project operations.</p>
            </section>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-file-signature" style={{ color: 'var(--neon-purple)' }}></i>
                        Active Contracts
                    </h3>
                    {loading ? (
                        <div style={{ color: 'var(--text-muted)' }}>Synchronizing secure channel...</div>
                    ) : agreements.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No active agreements. Scout projects to propose new contracts.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {agreements.map(ag => (
                                <div key={ag.id} style={{
                                    background: 'white',
                                    padding: '1.8rem',
                                    borderRadius: '20px',
                                    border: '1px solid var(--glass-border)',
                                    borderLeft: `6px solid ${ag.status === 'accepted' ? 'var(--neon-green)' : 'var(--neon-blue)'}`,
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                                }}>
<<<<<<< HEAD
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <h4 style={{ color: 'white' }}>{ag.projects?.name}</h4>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <span style={{
                                                fontSize: '0.6rem',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: ag.type === 'proposal' ? 'var(--neon-purple)' : 'var(--neon-blue)',
                                                color: 'white',
                                                textTransform: 'uppercase'
                                            }}>{ag.type || 'BID'}</span>
                                            <span style={{
                                                fontSize: '0.7rem',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                background: 'rgba(0,0,0,0.05)',
                                                color: ag.status === 'accepted' ? 'var(--neon-green)' : ag.status === 'rejected' ? 'red' : 'var(--neon-blue)'
                                            }}>{ag.status.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        {ag.type === 'proposal' ? `Offer from @${ag.founder?.username}` : `Your Bid to @${ag.founder?.username}`}
                                    </p>
                                    <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '8px', color: 'var(--text-main)', marginBottom: '1rem' }}>
                                        {ag.terms.substring(0, 100)}{ag.terms.length > 100 ? '...' : ''}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.7rem', color: 'gray' }}>Expires: {new Date(ag.expires_at).toLocaleDateString()}</div>
                                        {ag.type === 'proposal' && ag.status === 'pending' && (
                                            <button
                                                onClick={() => window.location.href = '#'}
                                                style={{ background: 'transparent', border: '1px solid var(--neon-purple)', color: 'var(--neon-purple)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>
                                                View & Respond
                                            </button>
                                        )}
=======
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', alignItems: 'center' }}>
                                        <h4 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.1rem' }}>{ag.projects?.name}</h4>
                                        <span style={{
                                            fontSize: '0.7rem',
                                            padding: '4px 10px',
                                            borderRadius: '6px',
                                            background: ag.status === 'accepted' ? 'rgba(0, 255, 0, 0.05)' : 'rgba(0, 142, 204, 0.05)',
                                            color: ag.status === 'accepted' ? 'var(--neon-green)' : 'var(--neon-blue)',
                                            fontWeight: 800,
                                            letterSpacing: '0.5px'
                                        }}>{ag.status.toUpperCase()}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.2rem', fontWeight: 500 }}>Founder: <span style={{ color: 'var(--neon-purple)' }}>@{ag.founder?.username || "Unknown"}</span></p>
                                    <div style={{ fontSize: '0.85rem', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '12px', color: 'var(--text-main)', marginBottom: '1.2rem', fontStyle: 'italic', border: '1px solid var(--glass-border)' }}>
                                        "{ag.terms.substring(0, 100)}..."
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="far fa-calendar-alt"></i> Expires: {new Date(ag.expires_at).toLocaleDateString()}
>>>>>>> 20f4aedcaa374254748e2eb4bab1e560f915991e
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-search-dollar" style={{ color: 'var(--neon-orange)' }}></i>
                        Scouting Radar
                    </h3>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <i className="fas fa-satellite-dish" style={{ fontSize: '3rem', color: 'var(--neon-orange)', marginBottom: '1rem', opacity: 0.5 }}></i>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>AI is currently identifying high-potential projects for protocol scaling.</p>
                        <button style={{
                            marginTop: '2rem',
                            background: 'transparent',
                            border: '1px solid var(--neon-orange)',
                            color: 'var(--neon-orange)',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}>Initialize Deep Scan</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProducerDashboard;
