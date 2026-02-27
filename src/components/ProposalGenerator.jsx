/* src/components/ProposalGenerator.jsx */
import React, { useState } from 'react';

const ProposalGenerator = ({ task, onCancel }) => {
    const [proposal, setProposal] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const generateAIProposal = () => {
        setIsGenerating(true);
        setTimeout(() => {
            const text = `Subject: Strategic Technical Solution regarding ${task.title}\n\nHi Team,\n\nI noticed high-intensity signals regarding ${task.signal}. Predictive analysis indicates an immediate technical bottleneck in your ${task.tags[0]} infrastructure, with a ${task.jobProbability} likelihood of evolving into a formal role opening.\n\nProposed Proactive Solution: ${task.inference}\n\nBy addressing this Logic Gap now, you can mitigate the ${task.hiringUrgency} urgency before it scales. I have documented specialized logic handling for ${task.logicGap}.\n\nDeliverables:\n1. Architecture recovery for ${task.tags[1]}\n2. Logic Benchmarking report\n3. Zero-downtime implementation roadmap\n\nBest,\n@TechnicalMercenary\n[Logic Portfolio attached]`;
            setProposal(text);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--neon-blue)',
            borderRadius: '16px',
            padding: '2rem',
            marginTop: '2rem'
        }}>
            <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', letterSpacing: '1px' }}>
                <i className="fas fa-paper-plane"></i> PREDICTIVE OUTREACH ENGINE
            </h4>

            {!proposal ? (
                <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                        Generating a proactive offer based on the predicted job opening probability ({task.jobProbability}).
                    </p>
                    <button
                        onClick={generateAIProposal}
                        disabled={isGenerating}
                        style={{
                            background: 'var(--neon-blue)',
                            color: '#000',
                            border: 'none',
                            padding: '12px 28px',
                            borderRadius: '10px',
                            fontWeight: 800,
                            cursor: 'pointer'
                        }}
                    >
                        {isGenerating ? 'Analyzing Market Signals...' : 'Construct Predictive Proposal'}
                    </button>
                </div>
            ) : (
                <div className="animate-fade">
                    <textarea
                        value={proposal}
                        onChange={(e) => setProposal(e.target.value)}
                        style={{
                            width: '100%',
                            height: '320px',
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            color: '#aed581',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            padding: '1.5rem',
                            outline: 'none',
                            marginBottom: '1rem',
                            lineHeight: '1.6'
                        }}
                    ></textarea>
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={onCancel}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            style={{
                                background: 'var(--accent-gradient)',
                                border: 'none',
                                color: 'white',
                                padding: '10px 24px',
                                borderRadius: '10px',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                            onClick={() => {
                                const nav = navigator;
                                nav.clipboard.writeText(proposal);
                                alert('Proposal Copied. Redirecting to Outreach CRM...');
                                onCancel();
                            }}
                        >
                            Copy & Launch Outreach
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalGenerator;
