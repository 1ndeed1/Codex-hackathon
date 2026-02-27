import React, { useState } from 'react';

const ProjectDetail = ({ project, onClose, currentUser }) => {
    const isOwner = project.owner === currentUser;
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

    const handleAcceptChange = (id) => {
        setChanges(changes.map(c => c.id === id ? { ...c, status: 'accepted' } : c));
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
                    <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '20px', color: 'var(--text-muted)' }}>
                        {project.isPublic ? 'Public' : 'Private'}
                    </span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '1.1rem', maxWidth: '800px', lineHeight: '1.6' }}>{project.description}</p>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button style={{ background: 'var(--glass-bg)', color: 'white', border: '1px solid var(--glass-border)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="far fa-star"></i> Star {project.stars}
                    </button>
                    {!isOwner && !hasRequested && project.isPublic && (
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
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                        <i className="fas fa-code-pull-request" style={{ color: 'var(--neon-purple)' }}></i>
                        Community Optimizations & Changes
                    </h3>

                    {changes.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No pending changes.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {changes.map(change => (
                                <div key={change.id} style={{
                                    background: 'rgba(0,0,0,0.3)',
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
                                    <h4 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.1rem' }}>{change.description}</h4>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                                        Proposed by <span style={{ color: 'var(--neon-purple)', fontWeight: 'bold' }}>@{change.contributor}</span> • {change.filesChanged} files changed
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <button style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '6px 16px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
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
        </div>
    );
};

export default ProjectDetail;
