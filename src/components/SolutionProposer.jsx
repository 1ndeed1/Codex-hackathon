import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const SolutionProposer = ({ task, onCancel, onSubmit }) => {
    const [solutionData, setSolutionData] = useState({
        abstract: '',
        logic: '',
        explanation: '',
        architecture_plan: '',
        code: ''
    });
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!solutionData.abstract || !solutionData.logic || !solutionData.explanation) {
            setErrorMsg("Please provide an abstract, logic outline, and detailed explanation.");
            return;
        }

        setErrorMsg('');
        setUploading(true);
        let publicUrl = null;

        if (file) {
            // Upload file to Supabase Storage bucket 'solution_files'
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${task.id}/${fileName}`;

            const { data, error } = await supabase.storage
                .from('solution_files')
                .upload(filePath, file);

            if (error) {
                console.error("Upload error:", error);
                setErrorMsg("Failed to upload file: " + error.message);
                setUploading(false);
                return;
            }

            // Get Public URL
            const { data: urlData } = supabase.storage
                .from('solution_files')
                .getPublicUrl(filePath);

            publicUrl = urlData.publicUrl;
        }

        onSubmit({
            ...solutionData,
            fileUrl: publicUrl
        });
        setUploading(false);
    };

    return (
        <div style={{
            marginTop: '2rem',
            padding: '2rem',
            background: 'rgba(0, 142, 204, 0.05)', // Light blue tint
            border: '1px solid var(--neon-blue)',
            borderRadius: '16px',
            position: 'relative'
        }}>
            <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem' }}>
                <i className="fas fa-pen-nib"></i> Propose a Better Way
            </h4>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Technical Abstract (Quick Summary)</label>
                <input
                    value={solutionData.abstract}
                    onChange={(e) => setSolutionData({ ...solutionData, abstract: e.target.value })}
                    placeholder="E.g., Reducing DB latency via Redis caching layer..."
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Approach / Logic Outline</label>
                <textarea
                    value={solutionData.logic}
                    onChange={(e) => setSolutionData({ ...solutionData, logic: e.target.value })}
                    placeholder="Explain your unique out-of-the-box approach or reference architecture..."
                    rows="2"
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                ></textarea>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Detailed Solution Explanation</label>
                <textarea
                    value={solutionData.explanation}
                    onChange={(e) => setSolutionData({ ...solutionData, explanation: e.target.value })}
                    placeholder="Elaborate on the 'why' and 'how' of this solution..."
                    rows="3"
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '0.9rem'
                    }}
                ></textarea>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Architecture Plan</label>
                <textarea
                    value={solutionData.architecture_plan}
                    onChange={(e) => setSolutionData({ ...solutionData, architecture_plan: e.target.value })}
                    placeholder="1. Layer A... 2. Component B... etc."
                    rows="3"
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.8)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '12px',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: '0.9rem',
                        fontFamily: 'monospace'
                    }}
                ></textarea>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Optimized Code Snippet</label>
                <textarea
                    value={solutionData.code}
                    onChange={(e) => setSolutionData({ ...solutionData, code: e.target.value })}
                    placeholder="Paste code or repository link here..."
                    rows="4"
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.8)',
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

            <div style={{ marginBottom: '1.5rem', background: 'rgba(155, 12, 252, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px dashed var(--neon-purple)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: 'bold' }}>
                    <i className="fas fa-paperclip" style={{ marginRight: '6px' }}></i> Attach Architecture Diagram or Zipped Code (.zip, .png, .pdf)
                </label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}
                />
                {file && <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--neon-blue)' }}>Selected: {file.name}</div>}
            </div>

            {errorMsg && (
                <div style={{ color: 'var(--neon-orange)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {errorMsg}
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    onClick={handleSubmit}
                    disabled={uploading}
                    style={{
                        flex: 2,
                        background: uploading ? 'var(--text-muted)' : 'var(--neon-blue)',
                        border: 'none',
                        color: '#000',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        transition: '0.2s'
                    }}
                >
                    {uploading ? 'Uploading & Submitting...' : 'Submit Fix / Pitch'}
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
