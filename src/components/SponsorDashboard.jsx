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

            <h3 style={{ fontSize: '1.5rem', marginBottom: '2.5rem', color: 'var(--text-main)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Strategic Grant History</h3>
            {loading ? (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                    <p>Analyzing local ledger...</p>
                </div>
            ) : myTransactions.length === 0 ? (
                <div style={{ padding: '4rem', textAlign: 'center', border: '2px dashed var(--glass-border)', borderRadius: '32px', background: 'rgba(0,0,0,0.01)' }}>
                    <i className="fas fa-hand-holding-usd" style={{ fontSize: '3rem', color: 'var(--glass-border)', marginBottom: '1.5rem' }}></i>
                    <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>No Allocations Found</h4>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>You haven't deployed capital to any initiatives yet. Browse the Projects Board to scout high-impact engineering projects.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    {myTransactions.map(tx => (
                        <div key={tx.id} style={{ background: 'white', padding: '1.8rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid var(--glass-border)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.01)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(0, 255, 136, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--neon-green)', fontSize: '1.2rem' }}>
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <div>
                                    <h4 style={{ color: 'var(--text-main)', marginBottom: '4px', fontSize: '1.1rem' }}>{tx.projects?.name}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{tx.message || "Direct Strategic Grant"}</p>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <i className="far fa-clock"></i> {new Date(tx.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--neon-green)' }}>+${tx.amount.toLocaleString()}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>Deployment Success</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SponsorDashboard;
