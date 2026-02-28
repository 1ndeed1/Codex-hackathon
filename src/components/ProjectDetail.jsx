import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ProjectDetail = ({ project, onClose, currentUser, identity }) => {
    const isOwner = identity && project.owner_id === identity.id;
    const isSponsor = identity?.role === 'sponsor';
    const isProducer = identity?.role === 'producer';

    const [hasRequested, setHasRequested] = useState(false);

    // Mock merge requests / submitted optimizations
    const [changes, setChanges] = useState([
        {
            id: 1,
            contributor: "CodeGenius",
            description: "Refactored the core logic to reduce time complexity from O(n^2) to O(n log n).",
            filesChanged: 3,
            status: 'pending' // pending, accepted
        }
    ]);

    // Sponsorship & Agreements State
    const [transactions, setTransactions] = useState([]);
    const [agreements, setAgreements] = useState([]);
    const [loadingFunding, setLoadingFunding] = useState(true);

    const [showSponsorModal, setShowSponsorModal] = useState(false);
    const [sponsorAmount, setSponsorAmount] = useState('');
    const [sponsorMessage, setSponsorMessage] = useState('');

    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [agreementTerms, setAgreementTerms] = useState('');
    const [agreementExpires, setAgreementExpires] = useState('');

    useEffect(() => {
        const fetchEconomyData = async () => {
            if (!project.id) return;
            setLoadingFunding(true);

            // Fetch Transactions (Funding)
            const { data: txData, error: txError } = await supabase
                .from('transactions')
                .select('*, profiles:sponsor_id(username)')
                .eq('project_id', project.id)
                .order('created_at', { ascending: false });

            if (!txError && txData) setTransactions(txData);

            // Fetch Agreements Only for Owner or Producers involved
            const { data: agData, error: agError } = await supabase
                .from('agreements')
                .select('*, producer:producer_id(username)')
                .eq('project_id', project.id)
                .order('created_at', { ascending: false });

            if (!agError && agData) {
                // Filter to only show if (isOwner) OR (ag.producer_id === identity.id)
                const visibleAgreements = agData.filter(ag => isOwner || ag.producer_id === identity?.id);
                setAgreements(visibleAgreements);
            }

            setLoadingFunding(false);
        };
        fetchEconomyData();
    }, [project.id, isOwner, identity]);

    const handleAcceptChange = (id) => {
        setChanges(changes.map(c => c.id === id ? { ...c, status: 'accepted' } : c));
    };

    const handleSponsorSubmit = async () => {
        if (!sponsorAmount || isNaN(sponsorAmount)) return alert("Invalid amount.");
        const { error } = await supabase.from('transactions').insert([{
            project_id: project.id,
            sponsor_id: identity.id,
            amount: parseFloat(sponsorAmount),
            message: sponsorMessage
        }]);

        if (error) {
            alert("Sponsorship failed: " + error.message);
        } else {
            alert("Sponsorship recorded!");
            setShowSponsorModal(false);
            // Quick local update to avoid full refetch
            setTransactions([{
                id: Date.now().toString(),
                amount: parseFloat(sponsorAmount),
                message: sponsorMessage,
                profiles: { username: identity.username },
                created_at: new Date().toISOString()
            }, ...transactions]);
        }
    };

    const handleAgreementSubmit = async () => {
        if (!agreementTerms || !agreementExpires) return alert("Fill out all fields.");

        const expiresAt = new Date(agreementExpires).toISOString();

        const { error } = await supabase.from('agreements').insert([{
            project_id: project.id,
            producer_id: identity.id,
            founder_id: project.owner_id,
            terms: agreementTerms,
            expires_at: expiresAt
        }]);

        if (error) {
            alert("Agreement proposal failed: " + error.message);
        } else {
            alert("Agreement Proposed to Founder!");
            setShowAgreementModal(false);
            setAgreements([{
                id: Date.now().toString(),
                terms: agreementTerms,
                status: 'pending',
                producer: { username: identity.username },
                producer_id: identity.id,
                expires_at: expiresAt,
                created_at: new Date().toISOString()
            }, ...agreements]);
        }
    };

    const updateAgreementStatus = async (agId, newStatus) => {
        const { error } = await supabase.from('agreements').update({ status: newStatus }).eq('id', agId);
        if (error) {
            alert("Update failed: " + error.message);
        } else {
            setAgreements(agreements.map(ag => ag.id === agId ? { ...ag, status: newStatus } : ag));
        }
    };

    return (
        <div style={{ padding: '2rem 10%', maxWidth: '1400px', margin: '0 auto', position: 'relative' }} className="animate-fade">
            <button
                onClick={onClose}
                style={{ position: 'absolute', top: '2rem', right: '10%', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer' }}
            >
                &times;
            </button>

            <div style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <i className="fas fa-book-open" style={{ fontSize: '2rem', color: 'var(--neon-blue)' }}></i>
                    <h2 style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>{project.owner} / <span style={{ color: 'var(--neon-blue)' }}>{project.name}</span></h2>
                    <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--glass-border)', borderRadius: '20px', color: 'var(--text-muted)' }}>
                        {project.isPublic ? 'Public' : 'Private'}
                    </span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6' }}>{project.description}</p>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button style={{ background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="far fa-star"></i> Star {project.stars}
                    </button>
                    {!isOwner && !hasRequested && project.is_public && identity?.role !== 'sponsor' && identity?.role !== 'producer' && (
                        <button
                            onClick={() => setHasRequested(true)}
                            style={{ background: 'var(--neon-blue)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-user-plus"></i> Request to Contribute
                        </button>
                    )}
                    {hasRequested && (
                        <button disabled style={{ background: 'var(--glass-bg)', color: 'var(--neon-blue)', border: '1px solid var(--neon-blue)', padding: '8px 16px', borderRadius: '8px', cursor: 'not-allowed', fontStyle: 'italic' }}>
                            <i className="fas fa-clock"></i> Access Pending
                        </button>
                    )}
                    {isSponsor && !isOwner && (
                        <button
                            onClick={() => setShowSponsorModal(true)}
                            style={{ background: 'var(--neon-green)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-hand-holding-usd"></i> Sponsor this Project
                        </button>
                    )}
                    {isProducer && !isOwner && (
                        <button
                            onClick={() => setShowAgreementModal(true)}
                            style={{ background: 'var(--neon-purple)', color: '#fff', border: '1px solid var(--neon-purple)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-file-contract"></i> Propose Agreement
                        </button>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                            <i className="fas fa-code-pull-request" style={{ color: 'var(--neon-blue)' }}></i>
                            Community Optimizations & Changes
                        </h3>

                        {changes.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No pending changes.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {changes.map(change => (
                                    <div key={change.id} style={{
                                        background: 'rgba(255,255,255,0.8)',
                                        border: change.status === 'accepted' ? '1px solid var(--neon-blue)' : '1px solid var(--glass-border)',
                                        borderRadius: '12px',
                                        padding: '1.5rem',
                                        position: 'relative'
                                    }}>
                                        {change.status === 'accepted' && (
                                            <div style={{ position: 'absolute', top: '15px', right: '20px', color: 'var(--neon-blue)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                <i className="fas fa-check-circle"></i> Merged Permanently
                                            </div>
                                        )}
                                        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{change.description}</h4>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                            Proposed by <span style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>@{change.contributor}</span> • {change.filesChanged} files changed
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-main)', padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                                                View Diff / Architecture
                                            </button>

                                            {isOwner && change.status === 'pending' && (
                                                <button
                                                    onClick={() => handleAcceptChange(change.id)}
                                                    style={{ background: 'var(--neon-blue)', border: 'none', color: '#000', padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>
                                                    Accept Changes
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Funding / Sponsorship Board */}
                    <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-green)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-chart-line" style={{ color: 'var(--neon-green)' }}></i>
                            Sponsorship & Funding Board
                        </h3>
                        {loadingFunding ? (
                            <div style={{ color: 'var(--text-muted)' }}><i className="fas fa-spinner fa-spin"></i> Loading blockchain receipts...</div>
                        ) : transactions.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No sponsorships recorded yet.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {transactions.map(tx => (
                                    <div key={tx.id} style={{ background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '12px', borderLeft: '2px solid var(--neon-green)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>@{tx.profiles?.username || 'Anonymous'}</span>
                                            <span style={{ color: 'var(--neon-green)', fontWeight: 800, fontSize: '1.1rem' }}>${tx.amount.toLocaleString()}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>"{tx.message || 'No message provided.'}"</p>
                                        <div style={{ fontSize: '0.65rem', color: 'gray', marginTop: '8px' }}>{new Date(tx.created_at).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Producer Agreements (Owner and Involved Producers only) */}
                    {(isOwner || agreements.length > 0) && (
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-purple)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                                <i className="fas fa-file-signature" style={{ color: 'var(--neon-purple)' }}></i>
                                Producer Agreements
                            </h3>
                            {agreements.length === 0 ? (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No active agreements or proposals.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {agreements.map(ag => (
                                        <div key={ag.id} style={{
                                            background: 'rgba(255,255,255,0.8)',
                                            padding: '1.2rem',
                                            borderRadius: '12px',
                                            border: `1px solid ${ag.status === 'accepted' ? 'var(--neon-green)' : ag.status === 'rejected' ? 'red' : 'var(--neon-purple)'}`
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <span style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '0.9rem' }}>Proposal from @{ag.producer?.username}</span>
                                                <span style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    color: ag.status === 'accepted' ? 'var(--neon-green)' : ag.status === 'rejected' ? 'red' : 'var(--neon-blue)',
                                                    background: 'rgba(0,0,0,0.05)',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px'
                                                }}>{ag.status}</span>
                                            </div>
                                            <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', marginBottom: '1rem', whiteSpace: 'pre-wrap', background: 'rgba(0,0,0,0.05)', padding: '10px', borderRadius: '8px' }}>
                                                {ag.terms}
                                            </div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                Expires: {new Date(ag.expires_at).toLocaleDateString()}
                                            </div>

                                            {/* Action buttons for Founders */}
                                            {isOwner && ag.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                                    <button onClick={() => updateAgreementStatus(ag.id, 'accepted')} style={{ background: 'var(--neon-green)', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Accept & Sign</button>
                                                    <button onClick={() => updateAgreementStatus(ag.id, 'rejected')} style={{ background: 'transparent', color: 'red', border: '1px solid red', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Reject</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Sponsor Modal */}
            {
                showSponsorModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', zIndex: 2000, overflowY: 'auto', display: 'block', padding: '2rem 1rem' }}>
                        <div style={{ background: 'var(--bg-dark)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--neon-green)', width: '90%', maxWidth: '400px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Sponsor "{project.name}"</h3>
                            <input
                                type="number"
                                placeholder="Amount (USD)"
                                value={sponsorAmount}
                                onChange={e => setSponsorAmount(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }}
                            />
                            <textarea
                                placeholder="Message of Support (Optional)"
                                value={sponsorMessage}
                                onChange={e => setSponsorMessage(e.target.value)}
                                rows="3"
                                style={{ width: '100%', padding: '10px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px', resize: 'vertical' }}
                            ></textarea>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowSponsorModal(false)} style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleSponsorSubmit} style={{ background: 'var(--neon-green)', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Simulate Transfer</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Agreement Modal */}
            {
                showAgreementModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', zIndex: 2000, overflowY: 'auto', display: 'block', padding: '2rem 1rem' }}>
                        <div style={{ background: 'var(--bg-dark)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--neon-purple)', width: '90%', maxWidth: '500px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Propose Agreement to Founder</h3>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>Propose funding, equity share, or a specific milestone contract.</div>

                            <textarea
                                placeholder="Enter comprehensive terms, expectations, and funding details (e.g. $50k for 5% equity upon MVP completion)."
                                value={agreementTerms}
                                onChange={e => setAgreementTerms(e.target.value)}
                                rows="6"
                                style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px', resize: 'vertical', fontSize: '0.9rem', lineHeight: '1.5' }}
                            ></textarea>

                            <label style={{ color: 'var(--text-main)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Proposal Expiration Date</label>
                            <input
                                type="date"
                                value={agreementExpires}
                                onChange={e => setAgreementExpires(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }}
                            />

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowAgreementModal(false)} style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleAgreementSubmit} style={{ background: 'var(--neon-purple)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Send Proposal via Contract</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ProjectDetail;
