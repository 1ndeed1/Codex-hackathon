/* src/components/EngineerProfile.jsx */
import React, { useState } from 'react';

const EngineerProfile = ({ identity, onClose }) => {
    const [showLinkedInPrompt, setShowLinkedInPrompt] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState("");

    const handlePublishToLinkedIn = () => {
        setShowLinkedInPrompt(true);
        setGenerating(true);
        setTimeout(() => {
            setGeneratedPrompt(`🚀 Stoked to share that I've successfully optimized a critical bottleneck regarding memory leaks in React Native!

By analyzing market signals via Discovery Radar, I identified a core issue affecting thousands of users. I engineered a custom hook to manage background syncs, effectively reducing the battery drain by 45%. 

It's amazing what we can achieve when we solve problems proactively. Code is public on my SlipStreamAI portfolio!
#Engineering #React #ProblemSolving #Tech`);
            setGenerating(false);
        }, 1500);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
            padding: '2rem'
        }} onClick={onClose}>
            <div
                className="animate-fade"
                style={{
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '32px',
                    padding: '3rem',
                    maxWidth: '800px',
                    width: '100%',
                    position: 'relative',
                    maxHeight: '85vh',
                    overflowY: 'auto'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '25px',
                        right: '25px',
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '2rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'var(--accent-gradient)',
                        borderRadius: '24px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '2.5rem',
                        color: 'white',
                        fontWeight: 800
                    }}>
                        {identity.name ? identity.name.substring(0, 2).toUpperCase() : 'TM'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>@{identity.name || 'TechnicalMercenary'}</h2>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <span style={{ color: 'var(--neon-blue)', fontWeight: 700 }}>{identity.tier} Rank</span>
                            <span style={{ color: 'var(--neon-purple)', fontWeight: 700 }}>{identity.vouches} Logic Vouches</span>
                            <span style={{ color: 'var(--text-muted)' }}>{identity.proofs.length} Problems Solved</span>
                            <span style={{ color: 'var(--neon-orange)', fontWeight: 700 }}>92% Acceptance Rate</span>
                            <span style={{ color: 'var(--text-muted)' }}>2 Open Projects</span>
                        </div>
                    </div>
                    <button
                        onClick={handlePublishToLinkedIn}
                        style={{ background: '#0077b5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', height: 'fit-content' }}>
                        <i className="fab fa-linkedin"></i> Publish to LinkedIn
                    </button>
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Verified Solutions & Architecture</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {identity.proofs.length > 0 ? identity.proofs.map((proof, i) => (
                        <div key={i} style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid var(--neon-blue)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            position: 'relative'
                        }}>
                            <i className="fas fa-certificate" style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--neon-blue)' }}></i>
                            <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{proof.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Impact: {proof.optimization}</p>
                            <div style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', fontWeight: 800 }}>STATUS: VERIFIED BY SYSTEM</div>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', border: '1px dashed var(--glass-border)', borderRadius: '20px' }}>
                            <p style={{ color: 'var(--text-muted)' }}>No ingenuity proofs collected yet. Start solving predictive opportunities!</p>
                        </div>
                    )}
                </div>

                {showLinkedInPrompt && (
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--bg-dark)', border: '1px solid #0077b5', borderRadius: '16px', padding: '2rem',
                        width: '90%', maxWidth: '600px', zIndex: 1200, boxShadow: '0 0 40px rgba(0, 119, 181, 0.2)'
                    }}>
                        <h3 style={{ color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fab fa-linkedin" style={{ color: '#0077b5' }}></i> AI Generated Professional Post</h3>
                        {generating ? (
                            <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', padding: '2rem', textAlign: 'center' }}>
                                <i className="fas fa-spinner fa-spin" style={{ marginRight: '8px' }}></i> AI is analyzing your portfolio to draft the perfect non-boring, company-friendly post...
                            </div>
                        ) : (
                            <>
                                <textarea
                                    readOnly
                                    value={generatedPrompt}
                                    rows={8}
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}
                                />
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setShowLinkedInPrompt(false)} style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={() => { alert('Post published to LinkedIn mock!'); setShowLinkedInPrompt(false); }} style={{ background: '#0077b5', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Publish Now</button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngineerProfile;
