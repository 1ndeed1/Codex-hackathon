import React, { useState } from 'react';

const ProjectsBoard = ({ onProjectSelect }) => {
    const [projects, setProjects] = useState([
        {
            id: 1,
            name: "OpenRouter-UI",
            owner: "NeuralNinja",
            description: "An open-source custom dashboard for routing LLM APIs with lowest latency.",
            isPublic: true,
            stars: 128,
            contributors: 4
        },
        {
            id: 2,
            name: "React-Native-Background-Sync-Fix",
            owner: "TechnicalMercenary",
            description: "Solving the battery drain issue for background syncing. Forked from FinanSync problem.",
            isPublic: true,
            stars: 45,
            contributors: 2
        }
    ]);

    const [showNewProject, setShowNewProject] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '', isPublic: true });

    const handleCreateProject = (e) => {
        e.preventDefault();
        const project = {
            id: Date.now(),
            name: newProject.name,
            owner: "CurrentUser", // Mocked
            description: newProject.description,
            isPublic: newProject.isPublic,
            stars: 0,
            contributors: 1
        };
        setProjects([project, ...projects]);
        setShowNewProject(false);
        setNewProject({ name: '', description: '', isPublic: true });
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
                        boxShadow: '0 4px 15px rgba(188, 19, 254, 0.3)'
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
                            style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                        />
                        <textarea
                            required
                            placeholder="Description of the project or the problem it solves..."
                            value={newProject.description}
                            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                            style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit' }}
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
                            <button type="button" onClick={() => setShowNewProject(false)} style={{ padding: '10px 20px', background: 'transparent', color: 'white', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent-gradient)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Create Project</button>
                        </div>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {projects.map(proj => (
                    <div key={proj.id} className="glass-panel animate-fade" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1.2rem', color: 'var(--neon-blue)', marginBottom: '4px', cursor: 'pointer' }} onClick={() => onProjectSelect(proj)}>{proj.name}</h3>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Maintained by <span style={{ color: 'white' }}>@{proj.owner}</span></div>
                            </div>
                            <span style={{ fontSize: '0.7rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'var(--text-muted)' }}>
                                {proj.isPublic ? 'Public' : 'Private'}
                            </span>
                        </div>

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
        </div>
    );
};

export default ProjectsBoard;
