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
                                            <span style={{ color: 'var(--neon-purple)', fontWeight: 800 }}>{profileData.avgIngenuityScore || 0}% AI Ingenuity Score</span>
                                            <span style={{ color: 'var(--neon-blue)', fontWeight: 700 }}>92% Acceptance Rate</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {isOwnProfile ? (
                                    <>
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
                                    </>
                                ) : (profileData.role === 'producer' && myProjects.length > 0) && (
                                    <button
                                        onClick={() => setShowProposalModal(true)}
                                        style={{ background: 'var(--neon-purple)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', height: 'fit-content' }}>
                                        <i className="fas fa-file-export"></i> Send Project Proposal
                                    </button>
                                )}
                            </div>
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
                                    <div style={{ position: 'absolute', top: '15px', right: '15px', color: 'var(--neon-purple)', fontWeight: 900, fontSize: '0.7rem' }}>
                                        SCORE: {proof.score || 0}
                                    </div>
                                    <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem', paddingRight: '60px' }}>{proof.title}</h4>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>Submitted: {proof.date}</div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1rem', fontStyle: proof.abstract ? 'normal' : 'italic' }}>
                                        {proof.abstract || proof.optimization}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ fontSize: '0.7rem', color: proof.status === 'accepted' ? 'var(--neon-blue)' : 'var(--neon-orange)', fontWeight: 800 }}>STATUS: {proof.status.toUpperCase()}</div>
                                        <button
                                            onClick={() => setViewingSolution(proof)}
                                            style={{ background: 'transparent', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}>
                                            View Elaborate Proof
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', border: '1px dashed var(--glass-border)', borderRadius: '20px' }}>
                                    <p style={{ color: 'var(--text-muted)' }}>No ingenuity proofs collected yet. {isOwnProfile ? "Start solving predictive opportunities!" : "This engineer hasn't solved any problems yet."}</p>
                                </div>
                            )}
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
                    <div style={{ textAlign: 'center', color: 'red' }}>Profile not found.</div>
                )}

                {showProposalModal && (
                    <div style={{
                        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'var(--bg-dark)', border: '1px solid var(--neon-purple)', borderRadius: '16px', padding: '2rem',
                        width: '90%', maxWidth: '600px', zIndex: 1200, boxShadow: '0 10px 40px rgba(188, 19, 254, 0.2)'
                    }}>
                        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>Send Project Proposal to @{profileData.name}</h3>

                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Select Project</label>
                        <select
                            value={selectedProjectId}
                            onChange={e => setSelectedProjectId(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginBottom: '1rem' }}
                        >
                            <option value="">-- Choose Initiative --</option>
                            {myProjects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Proposal Terms</label>
                        <textarea
                            placeholder="Describe what you need from this Producer (e.g. Protocol scaling, infrastructure management, funding offer)."
                            value={proposalTerms}
                            onChange={e => setProposalTerms(e.target.value)}
                            rows={5}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginBottom: '1rem', resize: 'vertical' }}
                        />

                        <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Expiration Date</label>
                        <input
                            type="date"
                            value={proposalExpires}
                            onChange={e => setProposalExpires(e.target.value)}
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.8)', color: 'var(--text-main)', border: '1px solid var(--glass-border)', borderRadius: '8px', marginBottom: '2rem' }}
                        />

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => setShowProposalModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={handleSendProposal} style={{ background: 'var(--neon-purple)', border: 'none', color: 'white', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Send Secure Proposal</button>
                        </div>
                    </div>
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
                        background: 'var(--bg-dark)', border: '1px solid var(--neon-blue)', borderRadius: '16px', padding: '2.5rem',
                        width: '90%', maxWidth: '800px', zIndex: 1200, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 10px 40px rgba(0, 242, 255, 0.2)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h3 style={{ color: 'var(--text-main)', margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>Solution Proof: {viewingSolution.title}</h3>
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--neon-purple)', fontWeight: 900, fontSize: '0.8rem', background: 'rgba(155, 12, 252, 0.1)', padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--neon-purple)' }}>
                                        INGENUITY SCORE: {viewingSolution.score || 0}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Submitted: {viewingSolution.date}</span>
                                </div>
                            </div>
                            <button onClick={() => setViewingSolution(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '2rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
                        </div>

                        {viewingSolution.abstract && (
                            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0, 242, 255, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--neon-blue)' }}>
                                <h4 style={{ color: 'var(--neon-blue)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '1px' }}>Technical Abstract</h4>
                                <p style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0, fontWeight: 500 }}>{viewingSolution.abstract}</p>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: viewingSolution.architecture_plan ? '1.2fr 0.8fr' : '1fr', gap: '2rem', marginBottom: '2rem' }}>
                            <div>
                                <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '10px' }}>Detailed Explanation</h4>
                                <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{viewingSolution.explanation || viewingSolution.content}</p>
                            </div>
                            {viewingSolution.architecture_plan && (
                                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}>
                                    <h4 style={{ color: 'var(--neon-blue)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '12px' }}>High-Level Architecture</h4>
                                    <pre style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap', fontFamily: "'Fira Code', monospace", lineHeight: '1.5' }}>{viewingSolution.architecture_plan}</pre>
                                </div>
                            )}
                        </div>

                        {viewingSolution.review_feedback && (
                            <div style={{ marginBottom: '2rem', background: 'rgba(0, 242, 255, 0.08)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--neon-blue)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                    <i className="fas fa-robot" style={{ color: 'var(--neon-blue)', fontSize: '1.2rem' }}></i>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--neon-blue)', textTransform: 'uppercase', letterSpacing: '1px' }}>AI Technical Analysis & Feedback</span>
                                </div>
                                <p style={{ fontSize: '1rem', color: 'var(--text-main)', margin: 0, fontStyle: 'italic', lineHeight: '1.5' }}>"{viewingSolution.review_feedback}"</p>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0 0 0', borderTop: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '0.85rem', color: viewingSolution.status === 'accepted' ? 'var(--neon-blue)' : 'var(--neon-orange)', fontWeight: 800 }}>
                                CERTIFICATION STATUS: {viewingSolution.status.toUpperCase()}
                            </div>
                            <button
                                onClick={() => setViewingSolution(null)}
                                style={{ background: 'var(--neon-blue)', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                            >
                                Close Proof
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngineerProfile;
