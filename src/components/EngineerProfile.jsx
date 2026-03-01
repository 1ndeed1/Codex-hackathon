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
    const [assessmentHistory, setAssessmentHistory] = useState([]);

    const [myProjects, setMyProjects] = useState([]);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [proposalTerms, setProposalTerms] = useState('');
    const [proposalExpires, setProposalExpires] = useState('');

    const isOwnProfile = currentUser && currentUser.id === userId;
    const isOwnerOfSomething = currentUser?.role === 'engineer' || currentUser?.role === 'producer'; // Simplified check

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
                abstract: sol.abstract,
                explanation: sol.explanation,
                architecture_plan: sol.architecture_plan,
                score: sol.score,
                review_feedback: sol.review_feedback,
                status: sol.status,
                date: new Date(sol.created_at).toLocaleString(),
                optimization: sol.abstract || (sol.content.substring(0, 100) + '...')
            }));

            const totalScore = proofs.reduce((acc, curr) => acc + (curr.score || 0), 0);
            const avgScore = proofs.length > 0 ? Math.round(totalScore / proofs.length) : 0;

            setProfileData({
                id: userId,
                name: pData?.username || 'Unknown',
                tier: pData?.tier || 'Unranked',
                vouches: pData?.vouches || 0,
                role: pData?.role || 'engineer',
                bio: pData?.bio || 'This user prefers to keep their ingenuity mysterious.',
                location: pData?.location || 'Unknown Sector',
                experience: pData?.experience_years || 0,
                github: pData?.github_url || '',
                portfolio: pData?.portfolio_url || '',
                proofs: proofs,
                avgIngenuityScore: avgScore
            });

            // Fetch current user's projects if they are viewing a producer
            if (currentUser?.id && pData?.role === 'producer' && !isOwnProfile) {
                const { data: projData } = await supabase
                    .from('projects')
                    .select('id, name')
                    .eq('owner_id', currentUser.id);
                setMyProjects(projData || []);
            }

            // Fetch Proctored Assessment History
            if (userId) {
                const history = JSON.parse(localStorage.getItem(`assessment_history_${userId}`) || "[]");
                history.sort((a, b) => new Date(b.date) - new Date(a.date));
                setAssessmentHistory(history);
            }

            setLoading(false);
        };
        fetchProfile();
    }, [userId, currentUser, isOwnProfile]);

    const handleSendProposal = async () => {
        if (!selectedProjectId || !proposalTerms || !proposalExpires) return alert("Fill out all fields.");

        const { error } = await supabase.from('agreements').insert([{
            project_id: selectedProjectId,
            producer_id: userId,
            founder_id: currentUser.id,
            terms: proposalTerms,
            expires_at: new Date(proposalExpires).toISOString(),
            initiated_by: currentUser.id,
            type: 'proposal'
        }]);

        if (error) {
            alert("Failed to send proposal: " + error.message);
        } else {
            alert("Project Proposal Sent!");
            setShowProposalModal(false);
        }
    };

    const handlePublishToLinkedIn = () => {
        setShowLinkedInPrompt(true);
        setGenerating(true);
        setTimeout(() => {
            setGeneratedPrompt(`🚀 Stoked to share that I've successfully optimized a critical bottleneck regarding memory leaks!

By analyzing market signals via Discovery Radar, I identified a core issue affecting performance. I engineered a solution reducing latency by 45%. 

It's amazing what we can achieve when we solve problems proactively. Code is public on my portfolio!
#Engineering #ProblemSolving #Tech`);
            setGenerating(false);
        }, 1500);
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1100, padding: '2rem'
        }} onClick={onClose}>

            <div
                className="animate-fade"
                style={{
                    background: 'var(--bg-dark)', border: '1px solid var(--neon-blue)',
                    borderRadius: '32px', padding: '3rem', maxWidth: '800px', width: '100%',
                    position: 'relative', maxHeight: '85vh', overflowY: 'auto',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                }}
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '25px', right: '25px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer' }}
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
                                width: '100px', height: '100px', background: 'var(--accent-gradient)',
                                borderRadius: '24px', display: 'flex', justifyContent: 'center',
                                alignItems: 'center', fontSize: '2.5rem', color: 'white', fontWeight: 800
                            }}>
                                {profileData.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '2rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)' }}>
                                    @{profileData.name}
                                    <span style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.05)', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                        {profileData.role}
                                    </span>
                                </h2>
                                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', marginBottom: '1rem', fontStyle: 'italic', maxWidth: '500px', opacity: 0.8 }}>"{profileData.bio}"</p>
                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                                    <span style={{ color: 'var(--neon-blue)', fontWeight: 700, fontSize: '0.9rem' }}>{profileData.tier} Rank</span>
                                    <span style={{ color: 'var(--neon-purple)', fontWeight: 700, fontSize: '0.9rem' }}>{profileData.vouches} Logic Vouches</span>
                                    <span style={{ color: 'var(--neon-orange)', fontWeight: 700, fontSize: '0.9rem' }}>{profileData.experience}Y EXP</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><i className="fas fa-location-dot"></i> {profileData.location}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
                                    {profileData.role === 'engineer' && (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <i className="fas fa-check-circle" style={{ color: 'var(--neon-green)', fontSize: '0.8rem' }}></i>
                                                <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>{profileData.proofs?.length || 0} Problems Solved</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <i className="fas fa-brain" style={{ color: 'var(--neon-purple)', fontSize: '0.8rem' }}></i>
                                                <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>{profileData.avgIngenuityScore || 0}% AI Ingenuity</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <i className="fas fa-chart-pie" style={{ color: 'var(--neon-blue)', fontSize: '0.8rem' }}></i>
                                                <span style={{ color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>92% Acceptance Rate</span>
                                            </div>
                                        </>
                                    )}
                                    <div style={{ display: 'flex', gap: '15px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '24px' }}>
                                        {profileData.github && (
                                            <a href={profileData.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                                <i className="fab fa-github" style={{ marginRight: '6px' }}></i> GitHub
                                            </a>
                                        )}
                                        {profileData.portfolio && (
                                            <a href={profileData.portfolio} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'var(--text-main)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
                                                <i className="fas fa-globe" style={{ marginRight: '6px' }}></i> Portfolio
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '160px' }}>
                                {isOwnProfile ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditingProfile(true)}
                                            style={{ background: 'white', color: 'var(--text-main)', border: '1px solid var(--glass-border)', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.08)'; }}
                                            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'; }}
                                        >
                                            <i className="fas fa-cog"></i> Edit Profile
                                        </button>
                                        <button
                                            onClick={handlePublishToLinkedIn}
                                            style={{ background: '#0077b5', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(0, 119, 181, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                                            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 119, 181, 0.3)'; }}
                                            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 119, 181, 0.2)'; }}
                                        >
                                            <i className="fab fa-linkedin"></i> Share Stats
                                        </button>
                                    </>
                                ) : (profileData.role === 'producer' && myProjects.length > 0) && (
                                    <button
                                        onClick={() => setShowProposalModal(true)}
                                        style={{ background: 'var(--neon-purple)', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '14px', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(188, 19, 254, 0.2)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}
                                        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <i className="fas fa-file-export"></i> Send Proposal
                                    </button>
                                )}
                            </div>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', marginBottom: '1.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Verified Solutions & Architecture</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                            {profileData.proofs.map((proof, i) => (
                                <div key={i} style={{ background: 'white', border: '1px solid var(--glass-border)', borderRadius: '24px', padding: '1.8rem', transition: 'all 0.3s', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }} onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--neon-blue)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 142, 204, 0.1)'; }} onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)'; }}>
                                    <h4 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--text-main)' }}>{proof.title}</h4>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{proof.optimization}</p>
                                    <button onClick={() => setViewingSolution(proof)} style={{ background: 'transparent', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)', padding: '6px 16px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700, transition: 'all 0.2s' }} onMouseOver={e => { e.currentTarget.style.background = 'var(--neon-blue)'; e.currentTarget.style.color = 'white'; }} onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--neon-blue)'; }}>View Details</button>
                                </div>
                            ))}
                        </div>

                        {/* Verified Assessments Section */}
                        {assessmentHistory.length > 0 && (
                            <div style={{ marginTop: '3rem' }}>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>
                                    <i className="fas fa-shield-alt" style={{ color: 'var(--neon-purple)', marginRight: '8px' }}></i>
                                    Proctored Industry Assessments
                                </h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {assessmentHistory.map((exam, idx) => (
                                        <div key={idx} style={{
                                            background: exam.score >= 60 ? 'rgba(0, 255, 128, 0.05)' : 'rgba(255, 60, 60, 0.05)',
                                            border: `1px solid ${exam.score >= 60 ? 'rgba(0, 255, 128, 0.3)' : 'rgba(255, 60, 60, 0.3)'}`,
                                            borderRadius: '20px',
                                            padding: '1.5rem',
                                            position: 'relative'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                                        {new Date(exam.date).toLocaleDateString()}
                                                    </div>
                                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginTop: '4px' }}>
                                                        {exam.company} Requirements
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                                        {exam.role} - {exam.week}
                                                    </div>
                                                </div>
                                                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: exam.score >= 60 ? '#00ff80' : '#ff3c3c' }}>
                                                    {exam.score}%
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: exam.score >= 60 ? 'rgba(0, 255, 128, 0.1)' : 'rgba(255, 60, 60, 0.1)', color: exam.score >= 60 ? '#00ff80' : '#ff3c3c' }}>
                                                    {exam.status}
                                                </span>
                                                {exam.score >= 85 && <i className="fas fa-medal" style={{ color: '#fbbf24', fontSize: '1.2rem' }} title="Expert Level Selection"></i>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.3 }}></i>
                        <p>Profile not found.</p>
                        <button onClick={onClose} style={{ background: 'var(--neon-blue)', border: 'none', color: 'white', padding: '8px 20px', borderRadius: '8px', marginTop: '1rem', cursor: 'pointer' }}>Close</button>
                    </div>
                )}

                {/* Modals - Structured inside the main container */}
                {showProposalModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1300, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowProposalModal(false)}>
                        <div style={{ background: 'white', border: '1px solid var(--neon-purple)', borderRadius: '32px', padding: '2.5rem', maxWidth: '600px', width: '90%', boxShadow: '0 20px 60px rgba(188, 19, 254, 0.15)' }} onClick={e => e.stopPropagation()}>
                            <h3 style={{ color: 'var(--neon-purple)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fas fa-paper-plane"></i> Send Project Proposal</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>You are proposing an initiative to <strong>@{profileData?.name}</strong>.</p>

                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Select Your Project</label>
                            <select
                                value={selectedProjectId}
                                onChange={e => setSelectedProjectId(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.95rem' }}
                            >
                                <option value="">-- Choose Initiative --</option>
                                {myProjects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>

                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Proposal Terms & Scope</label>
                            <textarea
                                placeholder="Detail the technical requirements and value proposition..."
                                value={proposalTerms}
                                onChange={e => setProposalTerms(e.target.value)}
                                rows={4}
                                style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.95rem', resize: 'none' }}
                            />

                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Expiration Date</label>
                            <input
                                type="date"
                                value={proposalExpires}
                                onChange={e => setProposalExpires(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'white', border: '1px solid var(--glass-border)', borderRadius: '12px', marginBottom: '2.5rem', fontSize: '0.95rem' }}
                            />

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button onClick={() => setShowProposalModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleSendProposal} style={{ background: 'var(--neon-purple)', border: 'none', color: 'white', padding: '12px 28px', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(188, 19, 254, 0.2)' }}>Deploy Proposal</button>
                            </div>
                        </div>
                    </div>
                )}

                {showLinkedInPrompt && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1200, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowLinkedInPrompt(false)}>
                        <div style={{ background: 'white', border: '1px solid #0077b5', borderRadius: '32px', padding: '2.5rem', maxWidth: '600px', width: '90%', boxShadow: '0 20px 60px rgba(0, 119, 181, 0.15)' }} onClick={e => e.stopPropagation()}>
                            <h3 style={{ color: '#0077b5', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}><i className="fab fa-linkedin"></i> LinkedIn Post Draft</h3>
                            <textarea readOnly value={generatedPrompt} rows={8} style={{ width: '100%', padding: '1.2rem', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', borderRadius: '16px', color: 'var(--text-main)', marginBottom: '1.8rem', fontSize: '0.95rem', lineHeight: '1.6', outline: 'none', resize: 'none' }} />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button onClick={() => setShowLinkedInPrompt(false)} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--glass-border)', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Discard</button>
                                <button onClick={() => { alert('Shared!'); setShowLinkedInPrompt(false); }} style={{ background: '#0077b5', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0, 119, 181, 0.2)' }}>Post to Feed</button>
                            </div>
                        </div>
                    </div>
                )}

                {isEditingProfile && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 1210, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setIsEditingProfile(false)}>
                        <div onClick={e => e.stopPropagation()}>
                            <ProfileSettings
                                identity={identity}
                                onClose={() => setIsEditingProfile(false)}
                                onUpdate={(updatedData) => {
                                    if (onProfileUpdate) onProfileUpdate(updatedData);
                                    setProfileData(prev => ({
                                        ...prev,
                                        name: updatedData.username || updatedData.name,
                                        bio: updatedData.bio,
                                        role: updatedData.role,
                                        location: updatedData.location,
                                        experience: updatedData.experience_years
                                    }));
                                }}
                            />
                        </div>
                    </div>
                )}

                {viewingSolution && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', zIndex: 1220, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setViewingSolution(null)}>
                        <div style={{ background: 'white', border: '1px solid var(--neon-blue)', borderRadius: '32px', padding: '3rem', maxWidth: '750px', width: '90%', maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 25px 70px rgba(0, 142, 204, 0.15)' }} onClick={e => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem' }}>Solution Infrastructure</h3>
                                <button onClick={() => setViewingSolution(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
                            </div>
                            <div style={{ background: 'rgba(0, 142, 204, 0.05)', padding: '2rem', borderRadius: '24px', borderLeft: '6px solid var(--neon-blue)', whiteSpace: 'pre-wrap', fontFamily: '"JetBrains Mono", monospace', fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '2rem', lineHeight: '1.7', border: '1px solid rgba(0, 142, 204, 0.1)', borderLeftWidth: '6px' }}>
                                {viewingSolution.content}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={() => setViewingSolution(null)} style={{ background: 'var(--neon-blue)', color: 'white', border: 'none', padding: '12px 32px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(0, 142, 204, 0.2)' }}>Return to Profile</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngineerProfile;
