import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { checkProjectAccess, requestProjectAccess, fetchAccessRequests, updateAccessRequest } from '../services/ProjectAccessService';
import VentureRepoExplorer from './VentureRepoExplorer';

const ProjectDetail = ({ project, onClose, currentUser, identity }) => {
    const isOwner = identity && project.owner_id === identity.id;
    const isSponsor = identity?.role === 'sponsor';
    const isProducer = identity?.role === 'producer';


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
    const [showAgreementModal, setShowAgreementModal] = useState(false);
    const [sponsorAmount, setSponsorAmount] = useState('');
    const [sponsorMessage, setSponsorMessage] = useState('');

    const [agreementTerms, setAgreementTerms] = useState('');
    const [agreementExpires, setAgreementExpires] = useState('');

    // GitHub Access State
    const [accessStatus, setAccessStatus] = useState('loading'); // loading, owner, accepted, pending, none, rejected
    const [accessRequests, setAccessRequests] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        const fetchEconomyData = async () => {
            if (!project.id) return;
            setLoadingFunding(true);

            // Fetch Transactions (Funding) - ONLY for Owner or Sponsor
            const { data: txData, error: txError } = await supabase
                .from('transactions')
                .select('*, profiles!sponsor_id(username)')
                .eq('project_id', project.id)
                .order('created_at', { ascending: false });

            if (!txError && txData) {
                // RLS should handle visibility, but we filter in UI to be safe
                const visibleTransactions = txData.filter(tx =>
                    isOwner || tx.sponsor_id === identity?.id
                );
                setTransactions(visibleTransactions);
            }

            // Fetch Agreements ONLY for involved parties
            const { data: agData, error: agError } = await supabase
                .from('agreements')
                .select('*, producer:profiles!producer_id(username), founder:profiles!founder_id(username)')
                .eq('project_id', project.id)
                .order('created_at', { ascending: false });

            if (!agError && agData) {
                // Filter to only show if (isOwner) OR (involved party)
                const visibleAgreements = agData.filter(ag =>
                    isOwner || ag.producer_id === identity?.id || ag.founder_id === identity?.id
                );
                setAgreements(visibleAgreements);
            }

            setLoadingFunding(false);
        };

        const fetchAccessData = async () => {
            if (!project.id || !identity?.id) return;

            const access = await checkProjectAccess(project.id, identity.id);
            setAccessStatus(access.status);

            if (isOwner) {
                const { data } = await fetchAccessRequests(project.id);
                if (data) setAccessRequests(data);
            }
        };

        fetchEconomyData();
        fetchAccessData();
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
            expires_at: expiresAt,
            initiated_by: identity.id,
            type: 'bid'
        }]);

        if (error) {
            alert("Bid failed: " + error.message);
        } else {
            alert("Bid Placed for Project!");
            setShowAgreementModal(false);
            setAgreements([{
                id: Date.now().toString(),
                terms: agreementTerms,
                status: 'pending',
                producer: { username: identity.username },
                producer_id: identity.id,
                founder_id: project.owner_id,
                expires_at: expiresAt,
                created_at: new Date().toISOString(),
                type: 'bid'
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

    const handleRequestAccess = async () => {
        if (!identity?.id) return alert("Must be logged in!");
        setIsRequesting(true);
        const { success } = await requestProjectAccess(project.id, identity.id);
        if (success) {
            setAccessStatus('pending');
            alert("Access request sent to project owner.");
        } else {
            alert("Failed to send request.");
        }
        setIsRequesting(false);
    };

    const handleApproveAccess = async (requestId) => {
        const { success } = await updateAccessRequest(requestId, 'accepted');
        if (success) {
            setAccessRequests(accessRequests.map(r => r.id === requestId ? { ...r, status: 'accepted' } : r));
        }
    };

    const handleRejectAccess = async (requestId) => {
        const { success } = await updateAccessRequest(requestId, 'rejected');
        if (success) {
            setAccessRequests(accessRequests.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
        }
    };
    const handleDeleteProject = async () => {
        if (!window.confirm("CRITICAL: This will permanently delete the project and all associated data. Proceed?")) return;

        const { error } = await supabase.from('projects').delete().eq('id', project.id);
        if (error) {
            alert("Deletion failed: " + error.message);
        } else {
            alert("Project purged from system.");
            onClose(); // Close the detail view
            window.location.reload(); // Simple way to refresh the board
        }
    };

    return (
        <div style={{ padding: '2rem 10%', maxWidth: '1400px', margin: '0 auto', position: 'relative' }} className="animate-fade">
            {isOwner && (
                <button
                    onClick={handleDeleteProject}
                    style={{ position: 'absolute', top: '2.5rem', right: '14%', background: 'rgba(255,0,0,0.1)', border: '1px solid red', color: 'red', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }}
                >
                    <i className="fas fa-trash-alt"></i> Delete Project
                </button>
            )}
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
                    <span style={{ fontSize: '0.7rem', padding: '4px 12px', background: 'rgba(0,0,0,0.05)', border: '1px solid var(--glass-border)', borderRadius: '20px', color: 'var(--text-muted)' }}>
                        {project.isPublic ? 'Public' : 'Private'}
                    </span>
                </div>

                {project.githubLink && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--neon-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fab fa-github"></i> {project.githubLink.replace('https://github.com/', '')}
                    </div>
                )}
                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6' }}>{project.description}</p>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button style={{ background: 'var(--glass-bg)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="far fa-star"></i> Star {project.stars}
                    </button>
                    {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" style={{
                            background: 'rgba(0,0,0,0.05)', color: 'var(--text-main)', border: '1px solid var(--glass-border)',
                            padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem',
                            display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold'
                        }}>
                            <i className="fab fa-github"></i> View on GitHub
                        </a>
                    )}
                    {/* Unified Access Request / Join Button */}
                    {!isOwner && accessStatus === 'none' && (
                        <button
                            onClick={handleRequestAccess}
                            disabled={isRequesting}
                            style={{ background: 'var(--neon-blue)', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(0, 243, 255, 0.3)' }}>
                            <i className="fas fa-user-plus"></i> Request to Join Project
                        </button>
                    )}

                    {/* Pending/Rejected Status Indicators */}
                    {!isOwner && accessStatus === 'pending' && (
                        <div style={{ color: 'var(--neon-blue)', fontSize: '0.9rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0, 243, 255, 0.1)', borderRadius: '8px', border: '1px solid var(--neon-blue)' }}>
                            <i className="fas fa-clock"></i> Access Request Pending Review
                        </div>
                    )}

                    {!isOwner && accessStatus === 'rejected' && (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-times-circle" style={{ color: 'red' }}></i> Access request was declined.
                            <button onClick={handleRequestAccess} style={{ background: 'transparent', border: 'none', color: 'var(--neon-blue)', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.8rem' }}>Re-request?</button>
                        </div>
                    )}

                    {/* Role-based actions - Only available after access is granted (or for owner) */}
                    {(isOwner || accessStatus === 'accepted') && (
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            {isSponsor && !isOwner && (
                                <button
                                    onClick={() => setShowSponsorModal(true)}
                                    style={{ background: 'var(--neon-green)', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="fas fa-hand-holding-usd"></i> Sponsor
                                </button>
                            )}
                            {isProducer && !isOwner && (
                                <button
                                    onClick={() => setShowAgreementModal(true)}
                                    style={{ background: 'var(--neon-purple)', color: '#fff', border: '1px solid var(--neon-purple)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <i className="fas fa-gavel"></i> Place Bid / Proposal
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Venture Repository Explorer Section */}
                    <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-blue)' }}>
                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-microchip" style={{ color: 'var(--neon-blue)' }}></i>
                            Venture Source Control
                        </h3>

                        {accessStatus === 'loading' ? (
                            <div style={{ color: 'var(--text-muted)' }}><i className="fas fa-spinner fa-spin"></i> Verifying cryptographic access...</div>
                        ) : (accessStatus === 'owner' || accessStatus === 'accepted') ? (
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    Authorized access granted. Browsing live repository via GitHub API.
                                </p>
                                <VentureRepoExplorer githubLink={project.githubLink} />
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', border: '1px dashed var(--glass-border)' }}>
                                <i className="fas fa-lock" style={{ fontSize: '3rem', color: 'var(--glass-border)', marginBottom: '1rem' }}></i>
                                <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Restricted Repository</h4>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '300px', margin: '0 auto 1.5rem' }}>
                                    This repository contains proprietary architecture. Request access to view source files.
                                </p>
                                {accessStatus === 'pending' ? (
                                    <button disabled style={{ background: 'transparent', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)', padding: '10px 20px', borderRadius: '8px', cursor: 'not-allowed', fontStyle: 'italic' }}>
                                        <i className="fas fa-clock"></i> Request Pending Review
                                    </button>
                                ) : accessStatus === 'rejected' ? (
                                    <div style={{ color: 'red', fontSize: '0.85rem' }}>
                                        <i className="fas fa-times-circle"></i> Access request was declined by owner.
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleRequestAccess}
                                        disabled={isRequesting}
                                        style={{ background: 'var(--neon-blue)', color: 'black', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 800 }}
                                    >
                                        {isRequesting ? 'Sending...' : 'Request Repository Access'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Access Management Panel for Owners */}
                    {isOwner && (
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-orange)', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-user-shield" style={{ color: 'var(--neon-orange)' }}></i>
                                Access Management
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {accessRequests.filter(r => r.status === 'pending').map(req => (
                                    <div key={req.id} style={{ background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800 }}>
                                                {req.profiles?.username?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 'bold' }}>@{req.profiles?.username}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{req.profiles?.role}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => handleApproveAccess(req.id)} style={{ flex: 1, background: 'var(--neon-green)', color: 'black', border: 'none', padding: '6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>Approve</button>
                                            <button onClick={() => handleRejectAccess(req.id)} style={{ flex: 1, background: 'transparent', border: '1px solid red', color: 'red', padding: '6px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>Deny</button>
                                        </div>
                                    </div>
                                ))}
                                {accessRequests.filter(r => r.status === 'pending').length === 0 && (
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No pending repository requests.</p>
                                )}
                            </div>
                        </div>
                    )}
                    {/* Funding / Sponsorship Board */}
                    <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-green)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <i className="fas fa-chart-line" style={{ color: 'var(--neon-green)' }}></i>
                                Capital Board
                            </h3>
                            {isSponsor && !isOwner && accessStatus === 'accepted' && (
                                <button onClick={() => setShowSponsorModal(true)} style={{ background: 'rgba(0,0,0,0.05)', border: '1px solid var(--neon-green)', color: 'var(--neon-green)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', cursor: 'pointer' }}>Add Record</button>
                            )}
                        </div>
                        {loadingFunding ? (
                            <div style={{ color: 'var(--text-muted)' }}><i className="fas fa-spinner fa-spin"></i> Loading secure ledger...</div>
                        ) : transactions.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Private dashboard. No records visible or available.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {transactions.map(tx => (
                                    <div key={tx.id} style={{ background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '12px', borderLeft: '2px solid var(--neon-green)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--text-main)' }}>@{tx.profiles?.username || 'Record Agent'}</span>
                                            <span style={{ color: 'var(--neon-green)', fontWeight: 800, fontSize: '1.1rem' }}>${tx.amount.toLocaleString()}</span>
                                        </div>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>"{tx.message || 'Deployment record.'}"</p>
                                        <div style={{ fontSize: '0.65rem', color: 'gray', marginTop: '8px' }}>{new Date(tx.created_at).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Producer Agreements / Bids */}
                    {(isOwner || agreements.length > 0) && (
                        <div className="glass-panel" style={{ padding: '2rem', borderTop: '4px solid var(--neon-purple)' }}>
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                                <i className="fas fa-gavel" style={{ color: 'var(--neon-purple)' }}></i>
                                Project Bids & Proposals
                            </h3>
                            {agreements.length === 0 ? (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>Private Channel: No active bids.</div>
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
                                                <span style={{ color: 'var(--text-main)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                                    {ag.type === 'proposal' ? 'Owner Proposal' : 'Bid'} from @{ag.type === 'proposal' ? ag.founder?.username : ag.producer?.username}
                                                </span>
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

                                            {/* Action buttons */}
                                            {ag.status === 'pending' && (
                                                <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                                                    {/* If it's a bid, owner accepts. If it's a proposal, producer accepts. */}
                                                    {((ag.type === 'bid' && isOwner) || (ag.type === 'proposal' && identity?.id === ag.producer_id)) && (
                                                        <button onClick={() => updateAgreementStatus(ag.id, 'accepted')} style={{ background: 'var(--neon-green)', color: 'black', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Accept & Sign</button>
                                                    )}
                                                    {((ag.type === 'bid' && isOwner) || (ag.type === 'proposal' && identity?.id === ag.producer_id)) && (
                                                        <button onClick={() => updateAgreementStatus(ag.id, 'rejected')} style={{ background: 'transparent', color: 'red', border: '1px solid red', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Reject</button>
                                                    )}
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
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Secure Capital Deployment</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>Recording sponsorship for "{project.name}". This record is private.</p>
                            <input
                                type="number"
                                placeholder="Amount (USD)"
                                value={sponsorAmount}
                                onChange={e => setSponsorAmount(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }}
                            />
                            <textarea
                                placeholder="Terms / Message (Optional)"
                                value={sponsorMessage}
                                onChange={e => setSponsorMessage(e.target.value)}
                                rows="3"
                                style={{ width: '100%', padding: '10px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px', resize: 'vertical' }}
                            ></textarea>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowSponsorModal(false)} style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleSponsorSubmit} style={{ background: 'var(--neon-green)', color: 'black', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Authorize Transaction</button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Bid Modal (rebranded Agreement Modal) */}
            {
                showAgreementModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', zIndex: 2000, overflowY: 'auto', display: 'block', padding: '2rem 1rem' }}>
                        <div style={{ background: 'var(--bg-dark)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--neon-purple)', width: '90%', maxWidth: '500px', margin: '0 auto', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>Place Project Bid</h3>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>Submit your operational bid to the Founder. This channel is private.</div>

                            <textarea
                                placeholder="Propose your terms, infrastructure commitment, or funding requirements."
                                value={agreementTerms}
                                onChange={e => setAgreementTerms(e.target.value)}
                                rows="6"
                                style={{ width: '100%', padding: '10px', marginBottom: '1rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px', resize: 'vertical', fontSize: '0.9rem', lineHeight: '1.5' }}
                            ></textarea>

                            <label style={{ color: 'var(--text-main)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Bid Expiration Date</label>
                            <input
                                type="date"
                                value={agreementExpires}
                                onChange={e => setAgreementExpires(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', color: 'var(--text-main)', borderRadius: '8px' }}
                            />

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <button onClick={() => setShowAgreementModal(false)} style={{ background: 'transparent', color: 'var(--text-main)', border: 'none', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleAgreementSubmit} style={{ background: 'var(--neon-purple)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Submit Secure Bid</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default ProjectDetail;
