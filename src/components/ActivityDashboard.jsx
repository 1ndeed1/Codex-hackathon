/* src/components/ActivityDashboard.jsx */
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ActivityDashboard = ({ identity }) => {
    const [activeSection, setActiveSection] = useState('proposals'); // 'proposals', 'solutions', 'transactions'
    const [sentProposals, setSentProposals] = useState([]);
    const [receivedProposals, setReceivedProposals] = useState([]);
    const [solutions, setSolutions] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            if (!identity?.id) return;
            setLoading(true);

            // Fetch Sent Proposals
            const { data: sent } = await supabase
                .from('agreements')
                .select('*, projects(name), founder:founder_id(username)')
                .eq('producer_id', identity.id)
                .order('created_at', { ascending: false });

            // Fetch Received Proposals
            const { data: received } = await supabase
                .from('agreements')
                .select('*, projects(name), producer:producer_id(username)')
                .eq('founder_id', identity.id)
                .order('created_at', { ascending: false });

            // Fetch Solutions
            const { data: sols } = await supabase
                .from('solutions')
                .select('*, opportunities(title)')
                .eq('user_id', identity.id)
                .order('created_at', { ascending: false });

            // Fetch Transactions
            const { data: txs } = await supabase
                .from('transactions')
                .select('*, projects(name)')
                .or(`sponsor_id.eq.${identity.id}`) // Both sent and received if applicable? 
                .order('created_at', { ascending: false });

            setSentProposals(sent || []);
            setReceivedProposals(received || []);
            setSolutions(sols || []);
            setTransactions(txs || []);
            setLoading(false);
        };

        fetchActivity();
    }, [identity]);

    const renderProposal = (ag, type) => (
        <div key={ag.id} className="glass-panel" style={{
            padding: '1.5rem',
            marginBottom: '1rem',
            borderLeft: `4px solid ${ag.status === 'accepted' ? 'var(--neon-green)' : 'var(--neon-blue)'}`
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ color: 'white', margin: 0 }}>{ag.projects?.name}</h4>
                <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.05)',
                    color: ag.status === 'accepted' ? 'var(--neon-green)' : 'var(--neon-blue)',
                    textTransform: 'uppercase'
                }}>{ag.status}</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                {type === 'sent' ? `Sent to: @${ag.founder?.username}` : `Received from: @${ag.producer?.username}`}
            </p>
            <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '8px', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                {ag.terms.substring(0, 150)}...
            </div>
            <div style={{ fontSize: '0.7rem', color: 'gray' }}>Timestamp: {new Date(ag.created_at).toLocaleString()}</div>
        </div>
    );

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
            <section style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Activity Command Center</h1>
                <p style={{ color: 'var(--text-muted)' }}>Track all proposals, solutions, and strategic transactions across the network.</p>
            </section>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveSection('proposals')}
                    style={{
                        padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: activeSection === 'proposals' ? 'var(--neon-blue)' : 'var(--glass-bg)',
                        color: activeSection === 'proposals' ? '#000' : 'white', fontWeight: 600
                    }}>Proposals</button>
                <button
                    onClick={() => setActiveSection('solutions')}
                    style={{
                        padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: activeSection === 'solutions' ? 'var(--neon-purple)' : 'var(--glass-bg)',
                        color: activeSection === 'solutions' ? '#000' : 'white', fontWeight: 600
                    }}>Solutions</button>
                <button
                    onClick={() => setActiveSection('transactions')}
                    style={{
                        padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: activeSection === 'transactions' ? 'var(--neon-green)' : 'var(--glass-bg)',
                        color: activeSection === 'transactions' ? '#000' : 'white', fontWeight: 600
                    }}>Transactions</button>
            </div>

            {loading ? (
                <div style={{ color: 'var(--text-muted)' }}>Synchronizing activity stream...</div>
            ) : (
                <div style={{ background: 'var(--glass-bg)', padding: '2rem', borderRadius: '20px', border: '1px solid var(--glass-border)' }}>
                    {activeSection === 'proposals' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--neon-blue)' }}>Sent Proposals</h3>
                                    {sentProposals.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No sent proposals.</p> :
                                        sentProposals.map(p => renderProposal(p, 'sent'))}
                                </div>
                                <div>
                                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--neon-purple)' }}>Received Proposals</h3>
                                    {receivedProposals.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No received proposals.</p> :
                                        receivedProposals.map(p => renderProposal(p, 'received'))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'solutions' && (
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--neon-purple)' }}>Submitted Solutions</h3>
                            {solutions.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No solutions submitted yet.</p> : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
                                    {solutions.map(sol => (
                                        <div key={sol.id} className="glass-panel" style={{ padding: '1.5rem', borderTop: '2px solid var(--neon-purple)' }}>
                                            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>{sol.opportunities?.title}</h4>
                                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Status: {sol.status.toUpperCase()}</div>
                                            <div style={{ fontSize: '0.8rem', background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', color: 'var(--text-main)', fontStyle: 'italic' }}>
                                                {sol.content.substring(0, 200)}...
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeSection === 'transactions' && (
                        <div>
                            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', color: 'var(--neon-green)' }}>Strategic Funding Logs</h3>
                            {transactions.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No transaction history found.</p> : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {transactions.map(tx => (
                                        <div key={tx.id} className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ color: 'var(--neon-blue)', marginBottom: '2px' }}>{tx.projects?.name}</h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tx.message || "Grant contribution"}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neon-green)' }}>+${tx.amount.toLocaleString()}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'gray' }}>{new Date(tx.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivityDashboard;
