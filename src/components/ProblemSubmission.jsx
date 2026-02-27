/* src/components/ProblemSubmission.jsx */
import React, { useState } from 'react';
import AiAnalysisResult from './AiAnalysisResult';
import { OPPORTUNITY_TYPES } from '../services/discovery_service';

const ProblemSubmission = ({ onClose, onPublish }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [abstract, setAbstract] = useState('');
    const [codeSnippet, setCodeSnippet] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleAnalyze = () => {
        if (!title || !description) return;
        setIsAnalyzing(true);

        setTimeout(() => {
            setAnalysis({
                inference: "The description reveals a deep logic collision in the buffer management layer.",
                logicGap: "Standard JS garbage collection cannot clear these allocated C++ pointers. Requires custom manual pointer-tracking hook.",
                carbon: "4.2kg CO2e / request"
            });
            setIsAnalyzing(false);
        }, 2000);
    };

    const handlePublish = () => {
        onPublish({
            type: OPPORTUNITY_TYPES.DIRECT,
            source: 'Direct Signal',
            channel: 'Local Node',
            title,
            content: description,
            tags: ['Logic Spike', 'Verified'],
            difficulty: 'High',
            jobProbability: 'Internal Escalation',
            hiringUrgency: 'High',
            logicGap: analysis.logicGap,
            abstract: abstract,
            codeSnippet: codeSnippet,
            isAnonymous: isAnonymous
        });
        onClose();
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
            padding: '2rem'
        }}>
            <div
                className="animate-fade"
                style={{
                    background: 'var(--bg-dark)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '32px',
                    padding: '3rem',
                    maxWidth: '800px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    position: 'relative'
                }}
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
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    &times;
                </button>

                <h2 style={{ marginBottom: '0.5rem', letterSpacing: '-1px' }}>Broadcast Signal Pulse</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', fontSize: '0.9rem' }}>
                    AI will benchmark your technical pain against global hiring signals to predict urgency.
                </p>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--neon-purple)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Signal Context</label>
                    <input
                        type="text"
                        placeholder="e.g. Memory leak in Node 20 worker threads"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '14px',
                            color: 'var(--text-main)',
                            outline: 'none',
                            fontSize: '1rem'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--neon-purple)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Technical Pain / Evidence</label>
                    <textarea
                        placeholder="Paste raw traces or logic frustrations here..."
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '14px',
                            color: 'var(--text-main)',
                            outline: 'none',
                            resize: 'vertical',
                            fontSize: '0.9rem',
                            lineHeight: '1.5'
                        }}
                    ></textarea>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--neon-blue)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Abstract (Optional)</label>
                    <textarea
                        placeholder="Provide a high-level summary of the bug or architectural goal..."
                        rows="2"
                        value={abstract}
                        onChange={(e) => setAbstract(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '14px',
                            color: 'var(--text-main)',
                            outline: 'none',
                            resize: 'vertical',
                            fontSize: '0.9rem',
                            lineHeight: '1.5'
                        }}
                    ></textarea>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--neon-blue)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>Code Snippet (Optional)</label>
                    <textarea
                        placeholder="Paste relevant problematic code..."
                        rows="4"
                        value={codeSnippet}
                        onChange={(e) => setCodeSnippet(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '12px',
                            padding: '14px',
                            color: 'var(--text-main)',
                            fontFamily: "'Fira Code', monospace",
                            outline: 'none',
                            resize: 'vertical',
                            fontSize: '0.85rem',
                            lineHeight: '1.5'
                        }}
                    ></textarea>
                </div>

                <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                        type="checkbox"
                        id="anonPost"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                    />
                    <label htmlFor="anonPost" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                        Post Anonymously <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>(Hide my username and email)</span>
                    </label>
                </div>

                {!analysis && (
                    <button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing}
                        style={{
                            width: '100%',
                            background: isAnalyzing ? 'var(--glass-border)' : 'var(--accent-gradient)',
                            border: 'none',
                            color: 'white',
                            padding: '16px',
                            borderRadius: '14px',
                            fontWeight: 800,
                            fontSize: '1rem',
                            cursor: isAnalyzing ? 'default' : 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        {isAnalyzing ? 'Analyzing Urgency Metrics...' : 'Benchmark Logic Gap'}
                    </button>
                )}

                {analysis && (
                    <AiAnalysisResult
                        inference={analysis.inference}
                        logicGap={analysis.logicGap}
                        carbon={analysis.carbon}
                        onPublish={handlePublish}
                    />
                )}
            </div>
        </div>
    );
};

export default ProblemSubmission;
