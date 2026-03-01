/* src/components/IngenuityDetail.jsx */
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import SolutionProposer from './SolutionProposer';
import ProposalGenerator from './ProposalGenerator';

const IngenuityDetail = ({ task, role, identity, onClose, onReward, onDelete, onEdit, onAccept }) => {
    const [showProposer, setShowProposer] = useState(false);
    const [showProposalGenerator, setShowProposalGenerator] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Edit States
    const [editTitle, setEditTitle] = useState(task.title);
    const [editAbstract, setEditAbstract] = useState(task.abstract || '');
    const [editCodeSnippet, setEditCodeSnippet] = useState(task.codeSnippet || '');
    const [editIsAnonymous, setEditIsAnonymous] = useState(task.isAnonymous || false);

    const isMined = task.type === 'mined';
    const isScanned = task.type === 'scanned';

    let accentColor = 'var(--neon-purple)';
    if (isMined) accentColor = 'var(--neon-blue)';
    if (isScanned) accentColor = 'var(--neon-orange)';

    const [solutions, setSolutions] = useState([]);
    const [loadingSolutions, setLoadingSolutions] = useState(true);

    useEffect(() => {
        const fetchSolutions = async () => {
            setLoadingSolutions(true);
            const { data, error } = await supabase
                .from('solutions')
                .select(`
                    id, content, status, vouchers, created_at, type, file_url,
                    profiles!user_id ( username )
                `)
                .eq('opportunity_id', task.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setSolutions(data.map(d => ({
                    id: d.id,
                    engineer: d.profiles?.username || "Unknown",
                    logic: d.content,
                    vouchers: d.vouchers || 0,
                    isAccepted: d.status === 'accepted',
                    type: d.type,
                    fileUrl: d.file_url
                })));
            }
            setLoadingSolutions(false);
        };
        fetchSolutions();
    }, [task.id]);

    const handleSolutionSubmit = async (proposal) => {
        if (!identity || !identity.id) return alert("Must be logged in!");

        const contentToSave = `APPROACH:\n${proposal.logic}\n\nIMPLEMENTATION/ARCHITECTURE:\n${proposal.code}`;

        const { data, error } = await supabase.from('solutions').insert([{
            opportunity_id: task.id,
            user_id: identity.id,
            content: contentToSave,
            type: 'Architecture/Code',
            status: 'pending',
            file_url: proposal.fileUrl
        }]).select(`*, profiles!user_id(username)`);

        if (!error && data && data.length > 0) {
            const newSol = data[0];
            setSolutions([{
                id: newSol.id,
                engineer: newSol.profiles?.username || identity.name,
                logic: newSol.content,
                vouchers: 0,
                isAccepted: false,
                type: 'Architecture/Code',
                fileUrl: newSol.file_url
            }, ...solutions]);
        }
        setShowProposer(false);
    };

    const handleAccept = async (sol) => {
        const { error } = await supabase
            .from('solutions')
            .update({ status: 'accepted' })
            .eq('id', sol.id);

        if (error) {
            alert("Failed to accept logic: " + error.message);
            return;
        }

        setSolutions(solutions.map(s => ({
            ...s,
            isAccepted: s.id === sol.id
        })));

        if (onReward) {
            onReward({
                tokens: 0, // Bounties removed
                proof: {
                    title: task.title,
                    engineer: sol.engineer,
                    optimization: "+45% Logic Recovery"
                }
            });
        }
    };

    const handleSaveEdit = async () => {
        if (onEdit) {
            await onEdit(task.id, {
                title: editTitle,
                abstract: editAbstract,
                codeSnippet: editCodeSnippet,
                isAnonymous: editIsAnonymous
            });
            setIsEditing(false);
        }
    };

    const isOwner = identity && identity.id && task.ownerId === identity.id;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            padding: '2rem 1rem',
            overflowY: 'auto',
            display: 'block'
        }} onClick={onClose}>
            <style>{`
            .likelihood-tooltip-container:hover .likelihood-tooltip {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(-5px) !important;
            }
        `}</style>
            <div
                className="animate-fade"
                style={{
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '24px',
                    padding: '3rem',
                    maxWidth: '900px',
                    width: '100%',
                    position: 'relative',
                    margin: '0 auto',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '2rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        color: accentColor,
                        letterSpacing: '1px'
                    }}>
                        <i className={`fas ${isScanned ? 'fa-search-location' : (isMined ? 'fa-radar' : 'fa-briefcase')}`} style={{ marginRight: '6px' }}></i>
                        {task.source} / {task.channel}
                    </span>
                    {isMined && (
                        <span style={{ fontSize: '0.6rem', color: '#000', background: 'var(--neon-blue)', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>JOB PREDICTION OVERRIDE</span>
                    )}
                    {isScanned && (
                        <span style={{ fontSize: '0.6rem', color: '#000', background: 'var(--neon-orange)', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>SCANNED ISSUE</span>
                    )}
                    {task.type === 'direct' && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            By: <span style={{ color: 'var(--text-main)' }}>
                                {task.isAnonymous
                                    ? 'Anonymous'
                                    : (task.authorProfile?.username || task.authorProfile?.email?.split('@')[0] || 'Unknown User')}
                            </span>
                        </span>
                    )}

                    {/* EDIT & DELETE ACTIONS FOR OWNER */}
                    {isOwner && (
                        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--neon-blue)',
                                    color: 'var(--neon-blue)',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                <i className="fas fa-edit"></i> {isEditing ? 'Cancel Edit' : 'Edit Post'}
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm("Are you sure you want to delete this signal?")) {
                                        onDelete && onDelete(task.id);
                                    }
                                }}
                                style={{
                                    background: 'rgba(255, 0, 0, 0.1)',
                                    border: '1px solid red',
                                    color: 'red',
                                    padding: '4px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                <i className="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: '1px solid var(--neon-blue)' }}>
                        <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>Editing Signal</h4>
                        <input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                            placeholder="Title"
                        />
                        <textarea
                            value={editAbstract}
                            onChange={(e) => setEditAbstract(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: 'rgba(255,255,255,0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px', resize: 'vertical' }}
                            placeholder="Abstract"
                            rows="2"
                        />
                        <textarea
                            value={editCodeSnippet}
                            onChange={(e) => setEditCodeSnippet(e.target.value)}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', background: 'rgba(240,240,240,0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px', resize: 'vertical', fontFamily: 'monospace' }}
                            placeholder="Code Snippet"
                            rows="4"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={editIsAnonymous}
                                onChange={(e) => setEditIsAnonymous(e.target.checked)}
                            />
                            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Post Anonymously</label>
                        </div>
                        <button onClick={handleSaveEdit} style={{ background: 'var(--neon-blue)', color: 'black', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '2.2rem', letterSpacing: '-1px', maxWidth: '70%', color: 'var(--text-main)' }}>{task.title}</h2>
                        <div style={{ textAlign: 'right' }}>
                            {isScanned ? (
                                <div style={{ color: 'var(--neon-orange)', fontWeight: 800, fontSize: '0.85rem' }}>Opportunity to Solve</div>
                            ) : task.type === 'direct' ? null : (
                                <div className="likelihood-tooltip-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                                    <div style={{
                                        background: 'rgba(255, 140, 0, 0.1)',
                                        border: '1px solid var(--neon-orange)',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'help',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 0 10px rgba(255, 140, 0, 0.2)'
                                    }}>
                                        <i className="fas fa-chart-line" style={{ color: 'var(--neon-orange)', fontSize: '0.8rem' }}></i>
                                    </div>
                                    <div className="likelihood-tooltip" style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        right: '0',
                                        marginBottom: '8px',
                                        background: 'rgba(0,0,0,0.9)',
                                        color: 'var(--neon-orange)',
                                        padding: '6px 12px',
                                        borderRadius: '6px',
                                        fontSize: '0.7rem',
                                        whiteSpace: 'nowrap',
                                        opacity: 0,
                                        visibility: 'hidden',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid var(--neon-orange)',
                                        zIndex: 10,
                                        fontWeight: 800
                                    }}>
                                        Hiring Likelihood: {task.jobProbability}
                                    </div>
                                </div>
                            )}
                            <div style={{ color: 'var(--neon-blue)', fontWeight: 800, fontSize: '0.75rem', marginTop: '4px' }}>
                                <i className="fas fa-users"></i> Solvers: {task.solverCount || 0}/{task.maxSolvers || 3}
                            </div>
                            {onAccept && (task.solverCount || 0) < (task.maxSolvers || 3) && (
                                <button
                                    onClick={() => onAccept(task.id)}
                                    style={{
                                        marginTop: '10px',
                                        background: 'var(--accent-gradient)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        fontSize: '0.8rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(188, 19, 254, 0.3)'
                                    }}>
                                    Enlist as Solver
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {(isMined || isScanned) ? (
                    <div style={{ background: 'rgba(255,255,255,0.8)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: accentColor, fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>
                                {isScanned ? 'Public Complaint/Review Signal' : 'Public Signal Detected'}
                            </label>
                            <p style={{ color: 'var(--text-main)', fontStyle: 'italic', marginTop: '4px', fontSize: '0.95rem' }}>"{task.signal}"</p>
                            {task.sourceUrl && (
                                <a href={task.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '12px', fontSize: '0.8rem', color: accentColor, textDecoration: 'none', fontWeight: 'bold' }}>
                                    <i className="fas fa-external-link-alt"></i> View Original Source
                                </a>
                            )}
                        </div>
                        <div>
                            <label style={{ color: 'var(--neon-purple)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Market Inference</label>
                            <p style={{ marginTop: '4px', fontSize: '1.05rem', lineHeight: '1.5', color: 'var(--text-main)' }}>{task.inference}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {task.abstract && (
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ color: 'var(--neon-purple)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>Abstract</label>
                                <p style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '4px', lineHeight: '1.5' }}>{task.abstract}</p>
                            </div>
                        )}
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', fontSize: '1.1rem' }}>{task.content}</p>

                        {task.codeSnippet && (
                            <div style={{ marginBottom: '2rem', background: 'rgba(240, 240, 240, 0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <label style={{ color: 'var(--neon-blue)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Code Snippet</label>
                                <pre style={{ fontFamily: 'monospace', color: 'var(--text-main)', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                    {task.codeSnippet}
                                </pre>
                            </div>
                        )}
                    </>
                )}

                <div style={{
                    background: 'rgba(188, 19, 254, 0.05)',
                    borderLeft: '4px solid var(--neon-purple)',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    margin: '2rem 0'
                }}>
                    <h4 style={{ color: 'var(--neon-purple)', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '1px' }}>
                        <i className="fas fa-brain"></i> THE LOGIC GAP
                    </h4>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)' }}>{task.logicGap}</p>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button
                        onClick={() => setShowProposalGenerator(!showProposalGenerator)}
                        style={{
                            width: '100%',
                            background: 'var(--accent-gradient)',
                            border: 'none',
                            color: 'white',
                            padding: '14px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        {showProposalGenerator ? 'Hide Proposal Engine' : 'Draft Proactive Technical Offer'}
                    </button>
                    {showProposalGenerator && (
                        <ProposalGenerator task={task} onCancel={() => setShowProposalGenerator(false)} />
                    )}
                </div>

                {(!isMined || isScanned) && (
                    <div style={{ marginTop: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-main)', fontSize: '1.3rem', fontWeight: 700 }}>
                                {isScanned ? 'Solutions & Architecture' : 'Logic Validation'}
                            </h4>
                            {role === 'engineer' && (
                                <button
                                    onClick={() => setShowProposer(true)}
                                    style={{
                                        background: 'transparent',
                                        border: `1px solid ${accentColor}`,
                                        color: accentColor,
                                        padding: '8px 20px',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isScanned ? 'Submit Fix / Architecture' : 'Propose Verification logic'}
                                </button>
                            )}
                        </div>

                        {showProposer && (
                            <SolutionProposer
                                onCancel={() => setShowProposer(false)}
                                onSubmit={handleSolutionSubmit}
                            />
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1.5rem' }}>
                            {solutions.map(sol => (
                                <div key={sol.id} style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: sol.isAccepted ? '1px solid var(--neon-blue)' : '1px solid var(--glass-border)',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    position: 'relative'
                                }}>
                                    {sol.isAccepted && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '-12px',
                                            right: '24px',
                                            background: 'var(--neon-blue)',
                                            color: '#000',
                                            fontSize: '0.7rem',
                                            fontWeight: 900,
                                            padding: '4px 14px',
                                            borderRadius: '20px',
                                            boxShadow: '0 0 10px rgba(0, 242, 255, 0.3)'
                                        }}>LOGIC VERIFIED</div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                                        <span style={{ color: 'var(--neon-blue)', fontWeight: 700, fontSize: '0.9rem' }}>@{sol.engineer}</span>
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>
                                            {sol.type}
                                        </span>
                                    </div>
                                    <pre style={{
                                        fontSize: '0.9rem',
                                        color: 'var(--text-main)',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: 'inherit',
                                        background: 'rgba(240, 240, 240, 0.8)',
                                        border: '1px solid var(--glass-border)',
                                        padding: '12px',
                                        borderRadius: '8px'
                                    }}>{sol.logic}</pre>

                                    {sol.fileUrl && (
                                        <div style={{ marginTop: '1rem' }}>
                                            <a
                                                href={sol.fileUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '8px',
                                                    background: 'rgba(188, 19, 254, 0.1)',
                                                    border: '1px solid var(--neon-purple)',
                                                    color: 'var(--neon-purple)',
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    textDecoration: 'none',
                                                    fontSize: '0.85rem',
                                                    fontWeight: 'bold',
                                                    transition: 'all 0.3s'
                                                }}
                                            >
                                                <i className="fas fa-download"></i> View Attached Architecture / File
                                            </a>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '1.2rem', display: 'flex', gap: '15px', alignItems: 'center' }}>
                                        <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer' }}>
                                            <i className="fas fa-certificate"></i> Vouch logic
                                        </button>

                                        {role === 'sponsor' && !sol.isAccepted && (
                                            <button
                                                onClick={() => handleAccept(sol)}
                                                style={{
                                                    marginLeft: 'auto',
                                                    background: 'var(--neon-blue)',
                                                    border: 'none',
                                                    color: '#000',
                                                    padding: '6px 16px',
                                                    borderRadius: '8px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: 800,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Accept Logic Fix
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IngenuityDetail;
