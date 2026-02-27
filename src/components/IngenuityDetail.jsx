/* src/components/IngenuityDetail.jsx */
import React, { useState } from 'react';
import SolutionProposer from './SolutionProposer';
import ProposalGenerator from './ProposalGenerator';

const IngenuityDetail = ({ task, role, onClose, onReward }) => {
    const [showProposer, setShowProposer] = useState(false);
    const [showProposalGenerator, setShowProposalGenerator] = useState(false);
    const isMined = task.type === 'mined';

    const [solutions, setSolutions] = useState([
        {
            id: 1,
            engineer: "LogicMaster_42",
            logic: "Identified a memory alignment issue in the 64-bit address space mapping.",
            vouchers: 8,
            isAccepted: true
        }
    ]);

    const handleSolutionSubmit = (proposal) => {
        setSolutions([{
            id: Date.now(),
            engineer: "TechnicalMercenary",
            logic: proposal.logic,
            vouchers: 0,
            isAccepted: false
        }, ...solutions]);
        setShowProposer(false);
    };

    const handleAccept = (sol) => {
        setSolutions(solutions.map(s => ({
            ...s,
            isAccepted: s.id === sol.id
        })));

        // Reward flow (now focusing on proof/reputation only)
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

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            padding: '2rem',
            overflowY: 'auto'
        }} onClick={onClose}>
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
                    margin: 'auto',
                    boxShadow: `0 0 40px ${isMined ? 'rgba(0, 242, 255, 0.1)' : 'rgba(188, 19, 254, 0.1)'}`
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

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        color: isMined ? 'var(--neon-blue)' : 'var(--neon-purple)',
                        letterSpacing: '1px'
                    }}>
                        <i className={`fas ${isMined ? 'fa-radar' : 'fa-briefcase'}`} style={{ marginRight: '6px' }}></i>
                        {task.source} / {task.channel}
                    </span>
                    {isMined && (
                        <span style={{ fontSize: '0.6rem', color: '#000', background: 'var(--neon-blue)', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>JOB PREDICTION ACTIVE</span>
                    )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '2.2rem', letterSpacing: '-1px', maxWidth: '70%' }}>{task.title}</h2>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--neon-orange)', fontWeight: 800, fontSize: '0.85rem' }}>Opening Likelihood: {task.jobProbability}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Urgency: {task.hiringUrgency}</div>
                    </div>
                </div>

                {isMined ? (
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem', border: '1px solid var(--glass-border)' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ color: 'var(--neon-blue)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Public Signal Detected</label>
                            <p style={{ color: '#fff', fontStyle: 'italic', marginTop: '4px', fontSize: '0.95rem' }}>"{task.signal}"</p>
                        </div>
                        <div>
                            <label style={{ color: 'var(--neon-purple)', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase' }}>Market Inference</label>
                            <p style={{ marginTop: '4px', fontSize: '1.05rem', lineHeight: '1.5' }}>{task.inference}</p>
                        </div>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', fontSize: '1.1rem' }}>{task.content}</p>
                )}

                <div style={{
                    background: 'linear-gradient(135deg, rgba(188, 19, 254, 0.03) 0%, transparent 100%)',
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

                {!isMined && (
                    <div style={{ marginTop: '3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--text-main)', fontSize: '1.3rem', fontWeight: 700 }}>Logic Validation</h4>
                            {role === 'engineer' && (
                                <button
                                    onClick={() => setShowProposer(true)}
                                    style={{
                                        background: 'transparent',
                                        border: '1px solid var(--neon-blue)',
                                        color: 'var(--neon-blue)',
                                        padding: '8px 20px',
                                        borderRadius: '10px',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Propose Verification logic
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
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{sol.vouchers} Community Vouches</span>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.5' }}>{sol.logic}</p>

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
