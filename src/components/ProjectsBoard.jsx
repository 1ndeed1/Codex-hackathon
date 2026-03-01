import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const ProjectsBoard = ({ onProjectSelect, identity }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewProject, setShowNewProject] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', isPublic: true, githubLink: '' });

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select(`
                    *,
                    profiles!owner_id ( username )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                const isSchemaError = error.message?.includes('column') || error.code === 'PGRST204';
                console.error(isSchemaError ? "Projects schema mismatch:" : "Projects connection error:", error);

                // Fallback: fetch without profiles
                const { data: simpleData, error: simpleError } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (simpleError) {
                    console.error("Projects fallback error:", simpleError);
                } else if (simpleData) {
                    setProjects(simpleData.map(p => ({
                        id: p.id,
                        name: p.name,
                        owner_id: p.owner_id,
                        owner: "Unknown",
                        description: p.description,
                        isPublic: p.is_public,
                        githubLink: p.github_link,
                        stars: p.stars || 0,
                        contributors: p.contributors || 1
                    })));
                }
            } else if (data) {
                setProjects(data.map(p => ({
                    id: p.id,
                    name: p.name,
                    owner_id: p.owner_id,
                    owner: p.profiles?.username || "Unknown",
                    description: p.description,
                    isPublic: p.is_public,
                    githubLink: p.github_link,
                    stars: p.stars || 0,
                    contributors: p.contributors || 1
                })));
            }
        } catch (err) {
            console.error("Unexpected projects error:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();

        if (!identity || !identity.id) {
            alert("You must be logged in to create a project.");
            return;
        }

        const { data, error } = await supabase.from('projects').insert([{
            name: newProject.name,
            description: newProject.description,
            is_public: newProject.isPublic,
            owner_id: identity.id,
            github_link: newProject.githubLink
        }]).select();

        if (error) {
            console.error("Error creating project:", error);
            alert("Failed to create project: " + error.message);
            return;
        }

        // Refresh the list to get the formatted join data
        fetchProjects();

        setShowNewProject(false);
        setNewProject({ name: '', description: '', isPublic: true, githubLink: '' });
    };

    return (
        <div style={{ padding: '2rem 10%', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Open Projects Network</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Collaborate on public initiatives, fix real-world scans, and build your engineering reputation.</p>
                </div>
                <button
                    onClick={() => setShowNewProject(true)}
                    style={{
                        background: 'var(--neon-purple)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(155, 12, 252, 0.3)' // Purple shadow
                    }}>
                    <i className="fas fa-plus"></i> Start Initiative
                </button>
            </div>

            {showNewProject && (
                <div className="glass-panel animate-fade" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--neon-purple)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--neon-purple)' }}>Initialize New Project</h3>
                    <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input
                            required
                            placeholder="Project Repository Name"
                            value={newProject.name}
                            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                            style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                        />
                        <input
                            placeholder="GitHub Repository URL (e.g., https://github.com/owner/repo)"
                            value={newProject.githubLink}
                            onChange={(e) => setNewProject({ ...newProject, githubLink: e.target.value })}
                            style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                        />
                        <textarea
                            required
                            placeholder="Description of the project or the problem it solves..."
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={newProject.isPublic}
                                    onChange={(e) => setNewProject({ ...newProject, isPublic: e.target.checked })}
                                />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Public (Anyone can view and request to help)</span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button type="button" onClick={() => setShowNewProject(false)} style={{ padding: '10px 20px', background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent-gradient)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Create Project</button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--neon-purple)' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem' }}></i>
                </div>
            ) : projects.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '16px' }}>
                    <p>No open projects found. Be the first to start an initiative!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {projects.map(proj => (
                        <div key={proj.id} className="glass-panel animate-fade" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', color: 'var(--neon-blue)', marginBottom: '4px', cursor: 'pointer' }} onClick={() => onProjectSelect(proj)}>{proj.name}</h3>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Maintained by <span style={{ color: 'var(--text-main)' }}>@{proj.owner}</span></div>
                                </div>
                                <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(0, 0, 0, 0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                                    {proj.isPublic ? 'Public' : 'Private'}
                                </span>
                            </div>

                            {proj.githubLink && (
                                <div style={{ fontSize: '0.75rem', color: 'var(--neon-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <i className="fab fa-github"></i> {proj.githubLink.replace('https://github.com/', '')}
                                </div>
                            )}

                            <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', flex: 1, marginBottom: '2rem', lineHeight: '1.5' }}>
                                {proj.description}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <i className="fas fa-star" style={{ color: 'var(--neon-orange)' }}></i> {proj.stars}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                        <i className="fas fa-code-branch" style={{ color: 'var(--neon-blue)' }}></i> {proj.contributors}
                                    </span>
                                </div>
                                <button
                                    onClick={() => onProjectSelect(proj)}
                                    style={{ background: 'transparent', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>
                                    View Repository
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProjectsBoard;
