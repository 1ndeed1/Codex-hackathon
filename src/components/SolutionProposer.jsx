/* src/components/SolutionProposer.jsx */
import React, { useState } from 'react';

const SolutionProposer = ({ task, onCancel, onSubmit }) => {
    const [logic, setLogic] = useState('');
    const [code, setCode] = useState('');

    const handleSubmit = () => {
        if (!logic || !code) return;
        onSubmit({
            engineer: "Technical Mercenary",
            logic,
            code,
            timestamp: new Date().toLocaleTimeString()
        });
    };

    return (
        <div style={{
            marginTop: '2rem',
            padding: '2rem',
            background: 'rgba(0, 242, 255, 0.03)',
            border: '1px solid var(--neon-blue)',
            borderRadius: '16px',
            position: 'relative'
        }}>
            <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>
                <i className="fas fa-pen-nib"></i> Propose a Better Way
            </h4>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Human Logic (Thinking Process)</label>
                <textarea
                    value={logic}
                    onChange={(e) => setLogic(e.target.value)}
                    placeholder="Explain your unique out-of-the-box approach..."
                    rows="3"
                    style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                ></textarea>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Optimized Code (Diff)</label>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your optimized code here..."
                    rows="5"
                    style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontFamily: "'Fira Code', monospace",
                        fontSize: '0.85rem'
                    }}
                ></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={handleSubmit}
                    style={{
                        flex: 2,
                        background: 'var(--neon-blue)',
                        border: 'none',
                        color: '#000',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        cursor: 'pointer'
                    }}
                >
                    Submit Logic Pitch
                </button>
                <button
                    onClick={onCancel}
                    style={{
                        flex: 1,
                        background: 'transparent',
                        border: '1px solid var(--text-muted)',
                        color: 'var(--text-muted)',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default SolutionProposer;
