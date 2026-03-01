/* src/components/VentureRepoExplorer.jsx */
import React, { useState, useEffect } from 'react';

const VentureRepoExplorer = ({ githubLink }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPath, setCurrentPath] = useState('');

    const parseRepo = (link) => {
        if (!link) return null;

        // Handle cases like "owner/repo" or "https://github.com/owner/repo"
        let cleanLink = link.trim();
        if (!cleanLink.startsWith('http')) {
            cleanLink = 'https://github.com/' + cleanLink;
        }

        try {
            const url = new URL(cleanLink);
            if (url.hostname === 'github.com') {
                const parts = url.pathname.split('/').filter(p => p);
                if (parts.length >= 2) {
                    return { owner: parts[0], repo: parts[1] };
                }
            }
        } catch (e) {
            // Fallback for simple "owner/repo" string
            const parts = link.split('/').filter(p => p);
            if (parts.length === 2) {
                return { owner: parts[0], repo: parts[1] };
            }
        }
        return null;
    };
    const fetchContents = async (path = '') => {
        const repoInfo = parseRepo(githubLink);
        if (!repoInfo) {
            setError("Invalid or missing GitHub link.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            // Using a more robust fetch with necessary headers for GitHub API
            const response = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/contents/${path}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'GapStart-Venture-Explorer'
                }
            });

            if (response.status === 404) throw new Error("Repository or path not found.");
            if (response.status === 403) throw new Error("GitHub API rate limit exceeded or access forbidden.");
            if (!response.ok) throw new Error(`GitHub API Error: ${response.statusText}`);

            const data = await response.json();
            setFiles(Array.isArray(data) ? data : [data]);
            setCurrentPath(path);
        } catch (err) {
            console.error("Explorer Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (githubLink) fetchContents();
    }, [githubLink]);

    const handleFolderClick = (path) => {
        fetchContents(path);
    };

    const handleBack = () => {
        const parts = currentPath.split('/');
        parts.pop();
        fetchContents(parts.join('/'));
    };

    return (
        <div style={{ background: 'rgba(0,0,0,0.05)', borderRadius: '12px', padding: '1.5rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fab fa-github" style={{ fontSize: '1.2rem' }}></i>
                    Venture Repository Explorer
                </h4>
                {currentPath && (
                    <button onClick={handleBack} style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>
                        <i className="fas fa-arrow-left"></i> Back
                    </button>
                )}
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                Root / {currentPath}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--neon-blue)' }}>
                    <i className="fas fa-spinner fa-spin"></i> Synchronizing with GitHub...
                </div>
            ) : error ? (
                <div style={{ color: 'red', fontSize: '0.8rem', padding: '1rem', background: 'rgba(255,0,0,0.05)', borderRadius: '8px' }}>
                    <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {files.map(file => (
                        <div
                            key={file.sha}
                            onClick={() => file.type === 'dir' ? handleFolderClick(file.path) : null}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                background: 'rgba(255,255,255,0.7)',
                                cursor: file.type === 'dir' ? 'pointer' : 'default',
                                border: '1px solid transparent',
                                transition: '0.2s'
                            }}
                            onMouseEnter={(e) => file.type === 'dir' ? e.currentTarget.style.borderColor = 'var(--neon-blue)' : null}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
                        >
                            <i className={file.type === 'dir' ? "fas fa-folder" : "far fa-file-code"} style={{ color: file.type === 'dir' ? 'var(--neon-orange)' : 'var(--neon-blue)' }}></i>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', flex: 1 }}>{file.name}</span>
                            {file.size > 0 && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</span>}
                        </div>
                    ))}
                    {files.length === 0 && <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Empty directory.</p>}
                </div>
            )}
        </div>
    );
};

export default VentureRepoExplorer;
