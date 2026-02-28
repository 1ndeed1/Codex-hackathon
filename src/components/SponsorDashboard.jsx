/* src/components/SponsorDashboard.jsx */
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const SponsorDashboard = ({ identity }) => {
    const [stats, setStats] = useState({
        totalInvested: 0,
        activeSponsorships: 0,
        pendingProposals: 0
    });
    const [loading, setLoading] = useState(true);
    const [myTransactions, setMyTransactions] = useState([]);

    useEffect(() => {
        const fetchSponsorData = async () => {
            if (!identity?.id) return;
            setLoading(true);

            const { data, error } = await supabase
                .from('transactions')
                .select('*, projects(name)')
                .eq('sponsor_id', identity.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setMyTransactions(data);
                const total = data.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
                setStats({
                    totalInvested: total,
                    activeSponsorships: data.length,
                    pendingProposals: 0 // Logic for pending can be added later
                });
            }
            setLoading(false);
        };
        fetchSponsorData();
    }, [identity]);

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
            <section style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Capital Allocation Command</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage your strategic investments and discover high-impact engineering initiatives.</p>
            </section>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
                marginBottom: '4rem'
            }}>
                <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-green)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Total Capital Deployed</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--neon-green)' }}>${stats.totalInvested.toLocaleString()}</div>
                </div>
                <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-blue)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Active Sponsorships</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--neon-blue)' }}>{stats.activeSponsorships}</div>
                </div>
                <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-purple)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Strategic Impact Score</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--neon-purple)' }}>94%</div>
                </div>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Recent Activity</h3>
            {loading ? (
                <div style={{ color: 'var(--text-muted)' }}>Analyzing ledger...</div>
            ) : myTransactions.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed' }}>
                    <i className="fas fa-hand-holding-usd" style={{ fontSize: '3rem', color: 'var(--glass-border)', marginBottom: '1.5rem' }}></i>
                    <p style={{ color: 'var(--text-muted)' }}>No investments recorded yet. Browse "Open Projects" to find initiatives to sponsor.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {myTransactions.map(tx => (
                        <div key={tx.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h4 style={{ color: 'var(--neon-blue)', marginBottom: '4px' }}>{tx.projects?.name}</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{tx.message || "Strategic grant"}</p>
                                <div style={{ fontSize: '0.7rem', color: 'gray', marginTop: '8px' }}>{new Date(tx.created_at).toLocaleDateString()}</div>
                            </div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neon-green)' }}>+${tx.amount.toLocaleString()}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SponsorDashboard;
