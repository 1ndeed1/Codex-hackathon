import React, { useState } from 'react';
import { supabase } from '../services/supabase';

const ProfileSettings = ({ identity, onClose, onUpdate }) => {
    const [username, setUsername] = useState(identity?.name || '');
    const [bio, setBio] = useState(identity?.bio || '');
    const [role, setRole] = useState(identity?.role || 'engineer');
    const [location, setLocation] = useState(identity?.location || '');
    const [experienceYears, setExperienceYears] = useState(identity?.experience_years?.toString() || '0');
    const [githubUrl, setGithubUrl] = useState(identity?.github_url || '');
    const [portfolioUrl, setPortfolioUrl] = useState(identity?.portfolio_url || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        const { error } = await supabase.from('profiles').update({
            username,
            bio,
            role,
            location,
            experience_years: parseInt(experienceYears),
            github_url: githubUrl,
            portfolio_url: portfolioUrl
        }).eq('id', identity.id);

        setLoading(false);
        if (error) {
            setMessage('Error: ' + error.message);
        } else {
            setMessage('Profile updated successfully!');
            setTimeout(() => {
                onUpdate({
                    ...identity,
                    name: username,
                    bio,
                    role,
                    location,
                    experience_years: parseInt(experienceYears),
                    github_url: githubUrl,
                    portfolio_url: portfolioUrl
                });
                onClose();
            }, 1000);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("CRITICAL WARNING: This will permanently delete your Auth user, Profile, and all associated Projects/Agreements. Are you absolute sure?")) return;

        // Supabase typically requires server-side admin keys to delete an Auth user entirely,
        // but if RLS allows, we can delete the profile (which might cascade or leave auth orphaned).
        // Best approach for a hackathon: Delete profile, then sign out.
        const { error } = await supabase.from('profiles').delete().eq('id', identity.id);
        if (error) {
            alert("Delete failed: " + error.message);
        } else {
            alert("Profile deleted permanently. Signing out...");
            await supabase.auth.signOut();
            window.location.reload();
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.8)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--neon-blue)', borderRadius: '24px', padding: '3rem', width: '90%', maxWidth: '500px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>

                <h2 style={{ fontSize: '1.8rem', marginBottom: '2rem', color: 'var(--text-main)' }}>Profile Settings</h2>

                {message && (
                    <div style={{ padding: '10px', background: message.includes('Error') ? 'rgba(255,0,0,0.1)' : 'rgba(0,255,0,0.1)', color: message.includes('Error') ? 'red' : 'green', borderRadius: '8px', marginBottom: '1.5rem' }}>
                        {message}
                    </div>
                )}

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--neon-purple)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--neon-blue)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>Current Role</label>
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '1rem', appearance: 'none', cursor: 'pointer' }}
                    >
                        <option value="engineer">Engineer (Solver)</option>
                        <option value="producer">Producer (Agreements)</option>
                        <option value="sponsor">Sponsor (Funding)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', color: 'var(--neon-orange)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>Bio / Mission Statement</label>
                    <textarea
                        value={bio}
                        onChange={e => setBio(e.target.value)}
                        rows="3"
                        placeholder="Tell the community about your goals or investment thesis..."
                        style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', resize: 'vertical' }}
                    ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: 'var(--neon-blue)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>GitHub URL</label>
                        <input
                            type="url"
                            value={githubUrl}
                            onChange={e => setGithubUrl(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', color: 'var(--neon-purple)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 'bold' }}>Portfolio</label>
                        <input
                            type="url"
                            value={portfolioUrl}
                            onChange={e => setPortfolioUrl(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={handleDeleteAccount} style={{ background: 'transparent', border: '1px solid red', color: 'red', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
                        Delete Profile
                    </button>
                    <button onClick={handleSave} disabled={loading} style={{ background: 'var(--neon-blue)', border: 'none', color: 'white', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}>
                        {loading ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
