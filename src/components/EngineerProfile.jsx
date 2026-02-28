/* src/components/EngineerProfile.jsx */
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import ProfileSettings from './ProfileSettings';

const EngineerProfile = ({ userId, currentUser, onClose, identity, onProfileUpdate }) => {
    const [showLinkedInPrompt, setShowLinkedInPrompt] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedPrompt, setGeneratedPrompt] = useState("");
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [viewingSolution, setViewingSolution] = useState(null);

    const isOwnProfile = currentUser && currentUser.id === userId;

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userId) return;
            setLoading(true);
            const { data: pList } = await supabase.from('profiles').select('*').eq('id', userId);
            const pData = (pList && pList.length > 0) ? pList[0] : null;

            const { data: sData } = await supabase.from('solutions')
                .select('*, opportunities!opportunity_id(title, signal)')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            const proofs = (sData || []).map(sol => ({
                id: sol.id,
                title: sol.opportunities?.title || "Unknown Mission",
                taskSignal: sol.opportunities?.signal || "",
                content: sol.content,
                status: sol.status,
                date: new Date(sol.created_at).toLocaleString(),
                optimization: sol.content.substring(0, 100) + '...'
            }));

            setProfileData({
                name: pData?.username || 'Unknown',
                tier: pData?.tier || 'Unranked',
                vouches: pData?.vouches || 0,
                role: pData?.role || 'engineer',
                bio: pData?.bio || 'This user prefers to keep their ingenuity mysterious.',
                location: pData?.location || 'Unknown Sector',
                experience: pData?.experience_years || 0,
                github: pData?.github_url || '',
                portfolio: pData?.portfolio_url || '',
                proofs: proofs
            });
            setLoading(false);
        };
        fetchProfile();
    }, [userId]);

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
            background: 'rgba(255, 255, 255, 0.8)',
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
                    border: '1px solid var(--neon-blue)',
                    borderRadius: '32px',
                    padding: '3rem',
                    maxWidth: '800px',
                    width: '100%',
                    position: 'relative',
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
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

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--neon-blue)' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem' }}></i>
                    </div>
                ) : profileData ? (
                    <>
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
                                {profileData.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                    @{profileData.name}
                                    <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', textTransform: 'uppercase', verticalAlign: 'middle' }}>
                                        {profileData.role}
                                    </span>
                                </h2>
                                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic', maxWidth: '500px' }}>"{profileData.bio}"</p>

                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    <span style={{ color: 'var(--neon-blue)', fontWeight: 700 }}>{profileData.tier} Rank</span>
                                    <span style={{ color: 'var(--neon-purple)', fontWeight: 700 }}>{profileData.vouches} Logic Vouches</span>
                                    <span style={{ color: 'var(--neon-orange)', fontWeight: 700 }}>{profileData.experience}Y EXP</span>
                                    <span style={{ color: 'var(--text-muted)' }}><i className="fas fa-location-dot"></i> {profileData.location}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    {profileData.github && (
                                        <a href={profileData.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-blue)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="fab fa-github"></i> GitHub Profile
                                        </a>
                                    )}
                                    {profileData.portfolio && (
                                        <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--neon-purple)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <i className="fas fa-globe"></i> Portfolio Site
                                        </a>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                    {profileData.role === 'engineer' && (
                                        <>
                                            <span style={{ color: 'var(--text-muted)' }}>{profileData.proofs.length} Problems Solved</span>
                                            <span style={{ color: 'var(--neon-blue)', fontWeight: 700 }}>92% Acceptance Rate</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            {isOwnProfile && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', height: 'fit-content' }}>
                                        <i className="fas fa-cog"></i> Edit Profile
                                    </button>
                                    <button
                                        onClick={handlePublishToLinkedIn}
                                        style={{ background: '#0077b5', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', height: 'fit-content' }}>
                                        <i className="fab fa-linkedin"></i> Share Stats
                                    </button>
                                </div>
                            )}
                        </div>

                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Verified Solutions & Architecture</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {profileData.proofs.length > 0 ? profileData.proofs.map((proof, i) => (
                                <div key={i} style={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    border: '1px solid var(--neon-blue)',
                                    borderRadius: '20px',
                                    padding: '1.5rem',
                                    position: 'relative'
                                }}>
                                    <i className="fas fa-certificate" style={{ position: 'absolute', top: '15px', right: '15px', color: proof.status === 'accepted' ? 'var(--neon-blue)' : 'var(--text-muted)' }}></i>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{proof.title}</h4>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>Submitted: {proof.date}</div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{proof.optimization}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.7rem', color: proof.status === 'accepted' ? 'var(--neon-blue)' : 'var(--neon-orange)', fontWeight: 800 }}>STATUS: {proof.status.toUpperCase()}</div>
                                        <button
                                            onClick={() => setViewingSolution(proof)}
                                            style={{ background: 'transparent', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>
                                            View Full Solution
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', border: '1px dashed var(--glass-border)', borderRadius: '20px' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>No ingenuity proofs collected yet. {isOwnProfile ? "Start solving predictive opportunities!" : "This engineer hasn't solved any problems yet."}</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', color: 'red' }}>Profile not found.</div>
                )}

                {showLinkedInPrompt && (
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--bg-dark)', border: '1px solid #0077b5', borderRadius: '16px', padding: '2rem',
                        width: '90%', maxWidth: '600px', zIndex: 1200, boxShadow: '0 10px 40px rgba(0, 119, 181, 0.2)'
                    }}>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}><i className="fab fa-linkedin" style={{ color: '#0077b5' }}></i> AI Generated Professional Post</h3>
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
                                    style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1rem' }}
                                />
                                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                                    <button onClick={() => setShowLinkedInPrompt(false)} style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-main)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={() => { alert('Post published to LinkedIn mock!'); setShowLinkedInPrompt(false); }} style={{ background: '#0077b5', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Publish Now</button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {isEditingProfile && (
                    <ProfileSettings
                        identity={identity}
                        onClose={() => setIsEditingProfile(false)}
                        onUpdate={(updatedData) => {
                            if (onProfileUpdate) onProfileUpdate(updatedData);
                            setProfileData(prev => ({ ...prev, name: updatedData.username, bio: updatedData.bio, role: updatedData.role }));
                        }}
                    />
                )}

                {viewingSolution && (
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--bg-dark)', border: '1px solid var(--neon-blue)', borderRadius: '16px', padding: '2rem',
                        width: '90%', maxWidth: '700px', zIndex: 1200, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0, 242, 255, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ color: 'var(--text-main)', margin: 0 }}>Solution for: {viewingSolution.title}</h3>
                            <button onClick={() => setViewingSolution(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--neon-blue)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Mission Context</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{viewingSolution.taskSignal}</p>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ color: 'var(--neon-green)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Submitted Solution</h4>
                            <div style={{ background: 'rgba(240, 240, 240, 0.8)', padding: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--neon-green)', whiteSpace: 'pre-wrap', color: 'var(--text-main)', fontSize: '0.9rem', fontFamily: 'monospace' }}>
                                {viewingSolution.content}
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                            <span style={{ color: 'var(--text-muted)' }}>Submitted on {viewingSolution.date}</span>
                            <span style={{ color: viewingSolution.status === 'accepted' ? 'var(--neon-blue)' : 'var(--neon-orange)', fontWeight: 700 }}>STATUS: {viewingSolution.status.toUpperCase()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngineerProfile;
