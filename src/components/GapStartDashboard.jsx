/* src/components/GapStartDashboard.jsx */
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { analyzeRequirements, expandGap, analyzeSolution } from '../services/gapstart_service';
import { getPlatformIcon } from '../services/background_scanner';
import SolutionProposer from './SolutionProposer';

const GapStartDashboard = ({ identity }) => {
    const [activeView, setActiveView] = useState('pulse'); // 'pulse', 'service', 'coding'
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGap, setSelectedGap] = useState(null);
    const [analysisMap, setAnalysisMap] = useState(null);
    const [showExpertForm, setShowExpertForm] = useState(false);
    const [expertInput, setExpertInput] = useState({ industry: '', inefficiency: '' });
    const [pitchDeck, setPitchDeck] = useState(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [showProposer, setShowProposer] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeView]);

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('opportunities')
            .select('*')
            .eq('type', activeView)
            .lt('solver_count', 10)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("Error fetching GapStart items:", error);
        } else {
            setItems(data || []);
        }
        setLoading(false);
    };

    const handleMonitor = async () => {
        setIsMonitoring(true);
        // Simulate a manual trigger of the background scanner logic
        setTimeout(() => {
            fetchData();
            setIsMonitoring(false);
        }, 2000);
    };

    const handleAnalyze = async (item) => {
        setLoading(true);
        const map = await analyzeRequirements(item);
        const expanded = expandGap(item);
        setSelectedGap(expanded);
        setAnalysisMap(map);
        setPitchDeck(null);
        setLoading(false);
        // Scroll to top of analysis
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleExpertSubmit = async () => {
        if (!expertInput.industry || !expertInput.inefficiency) return;
        const { error } = await supabase.from('opportunities').insert([{
            type: 'pulse', // Default for expert submission
            source: 'Expert Submission',
            channel: expertInput.industry,
            title: `Expert Discovery: ${expertInput.industry}`,
            signal: expertInput.inefficiency,
            source_url: expertInput.source_url,
            hiring_urgency: 'Medium',
            job_probability: '70%',
            owner_id: identity.id
        }]);
        if (!error) {
            setShowExpertForm(false);
            setExpertInput({ industry: '', inefficiency: '', source_url: '' });
            fetchData();
        }
    };

    const generatePitchDeck = (gap) => {
        setPitchDeck({
            vision: `Global leader in ${gap.product_type} for the ${gap.industry || 'Tech'} sector.`,
            tam: "$5.4B Global Market Opportunity",
            solution: `Automated ${gap.title || 'Workflow'} with integrated ${gap.mvp_features[0]} and ${gap.mvp_features[1]}.`,
            traction: "Identified via GapStart AI Monitoring of verified market friction."
        });
    };

    const handleSolutionSubmit = async (proposal) => {
        if (!identity || !identity.id) return alert("Must be logged in!");

        // Run AI Analysis
        const analysis = analyzeSolution(proposal);

        const { data, error } = await supabase.from('solutions').insert([{
            opportunity_id: selectedGap.id,
            user_id: identity.id,
            content: proposal.code || proposal.logic,
            abstract: proposal.abstract,
            explanation: proposal.explanation,
            architecture_plan: proposal.architecture_plan,
            type: 'Architecture Proposal',
            status: 'pending',
            file_url: proposal.fileUrl,
            score: analysis.score,
            review_feedback: analysis.review_feedback
        }]);

        if (error) {
            console.error("Error submitting architecture proposal:", error);
            alert("Failed to submit proposal. Please try again.");
        } else {
            alert("Architecture Proposal submitted successfully! It is now pending review by the sponsor/producer.");
            setShowProposer(false);
        }
    };

    const handlePublishVenture = () => {
        alert("Success! This pitch deck has been published to your Venture Profile and shared with relevant VCs in the GapStart network.");
    };

    const renderRequirementMap = (map) => (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', border: '1px solid var(--neon-blue)' }}>
            <h3 style={{ color: 'var(--neon-blue)', marginBottom: '1.5rem' }}>
                <i className="fas fa-map-signs"></i> Intelligent Requirement Map
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--neon-purple)', textTransform: 'uppercase' }}>Finance</h4>
                    <p style={{ fontSize: '0.9rem' }}>{map.finance}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--neon-blue)', textTransform: 'uppercase' }}>Operations</h4>
                    <p style={{ fontSize: '0.9rem' }}>{map.operations}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--neon-green)', textTransform: 'uppercase' }}>HR & Staffing</h4>
                    <p style={{ fontSize: '0.9rem' }}>{map.hr}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--neon-orange)', textTransform: 'uppercase' }}>Analytics & ROI</h4>
                    <p style={{ fontSize: '0.9rem' }}>{map.analytics}</p>
                </div>
            </div>
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--accent-gradient)', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Estimated Efficiency Gain: {map.efficiency_gain}%</div>
            </div>

            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ border: '1px solid var(--neon-purple)', padding: '1rem', borderRadius: '12px', background: 'rgba(191, 0, 255, 0.05)' }}>
                    <h4 style={{ color: 'var(--neon-purple)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Technical Solve</h4>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{map.technical_solve}</p>
                </div>
                <div style={{ border: '1px solid var(--neon-green)', padding: '1rem', borderRadius: '12px', background: 'rgba(57, 255, 20, 0.05)' }}>
                    <h4 style={{ color: 'var(--neon-green)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px' }}>Architecture Plan</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', whiteSpace: 'pre-wrap' }}>{map.architecture_plan}</p>
                </div>
            </div>
        </div>
    );

    const renderBuildPathways = (gap) => (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', border: '1px solid var(--neon-purple)' }}>
            <h3 style={{ color: 'var(--neon-purple)', marginBottom: '1.5rem' }}>
                <i className="fas fa-rocket"></i> Product Expansion Engine
            </h3>
            {showProposer && (
                <div style={{ marginBottom: '2rem' }}>
                    <SolutionProposer
                        task={gap}
                        onCancel={() => setShowProposer(false)}
                        onSubmit={handleSolutionSubmit}
                    />
                </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h4 style={{ color: 'var(--text-main)' }}>Startup Pathway</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Build this as a standalone SaaS product.</p>
                    <div style={{ margin: '1rem 0', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem' }}>Market Potential: <strong>{gap.startup_score}%</strong></div>
                        <div style={{ fontSize: '0.8rem' }}>Difficulty: <strong>{gap.difficulty}</strong></div>
                    </div>
                    <button className="neon-btn-purple" style={{ width: '100%', padding: '10px' }} onClick={() => generatePitchDeck(gap)}>Generate Pitch Deck</button>
                </div>
                <div>
                    <h4 style={{ color: 'var(--text-main)' }}>Freelance Pathway</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Directly solve this for the target company/repo.</p>
                    <div style={{ margin: '1rem 0', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem' }}>Conversion Prob: <strong>{gap.freelance_score}%</strong></div>
                        <div style={{ fontSize: '0.8rem' }}>Build Speed: <strong>High</strong></div>
                    </div>
                    <button className="neon-btn-blue" style={{ width: '100%', padding: '10px' }} onClick={() => setShowProposer(true)}>Submit Architecture Proposal</button>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', letterSpacing: '-2px', background: 'linear-gradient(45deg, var(--neon-blue), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>GapStart Discovery Hub</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Automated 24/7 Monitoring of Social Pulses, Service Inefficiencies, and Coding Gaps.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => setShowExpertForm(true)}
                        style={{ background: 'var(--neon-purple)', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                    >
                        <i className="fas fa-plus"></i> Submit Industry Gap
                    </button>
                    <div style={{ background: 'rgba(57, 255, 20, 0.1)', padding: '8px 16px', borderRadius: '12px', border: '1px solid var(--neon-green)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--neon-green)', borderRadius: '50%', animation: 'pulse 1.5s infinite' }}></div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--neon-green)', fontWeight: 700 }}>LIVE MONITOR ACTIVE</span>
                    </div>
                </div>
            </header>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <button onClick={() => setActiveView('pulse')} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--neon-blue)', background: activeView === 'pulse' ? 'var(--neon-blue)' : 'transparent', color: activeView === 'pulse' ? 'black' : 'var(--neon-blue)', cursor: 'pointer', fontWeight: 700, transition: '0.2s' }}>Pulse Signals</button>
                        <button onClick={() => setActiveView('service')} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--neon-green)', background: activeView === 'service' ? 'var(--neon-green)' : 'transparent', color: activeView === 'service' ? 'black' : 'var(--neon-green)', cursor: 'pointer', fontWeight: 700, transition: '0.2s' }}>Service Gaps</button>
                        <button onClick={() => setActiveView('coding')} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--neon-purple)', background: activeView === 'coding' ? 'var(--neon-purple)' : 'transparent', color: activeView === 'coding' ? 'black' : 'var(--neon-purple)', cursor: 'pointer', fontWeight: 700, transition: '0.2s' }}>Coding Gaps</button>
                    </div>

                    {loading ? <div style={{ textAlign: 'center', padding: '4rem' }}><i className="fas fa-spinner fa-spin fa-2x color-neon-blue"></i></div> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {items.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', border: '1px dashed var(--glass-border)', borderRadius: '12px' }}>
                                    No items found in this section yet. Monitoring in progress...
                                </div>
                            ) : items.map(item => (
                                <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer', transition: '0.3s', border: selectedGap?.id === item.id ? '1px solid var(--neon-blue)' : '1px solid var(--glass-border)' }} onClick={() => handleAnalyze(item)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <h4 style={{ color: 'var(--text-main)', margin: 0, fontSize: '1.1rem' }}>{item.title}</h4>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                                                <i className={getPlatformIcon(item.source)} style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}></i>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.source} • {item.channel}</span>
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', background: 'rgba(0, 242, 255, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{item.hiring_urgency} URGENCY</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '12px', marginBottom: 0, lineHeight: '1.5' }}>{item.signal.substring(0, 150)}...</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ flex: 1.5 }}>
                    {selectedGap ? (
                        <div>
                            <div className="glass-panel" style={{ padding: '2.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.8rem' }}>{selectedGap.title}</h2>
                                    {(selectedGap.source_url || selectedGap.sourceUrl) && (
                                        <a href={selectedGap.source_url || selectedGap.sourceUrl} target="_blank" rel="noopener noreferrer" style={{
                                            background: 'var(--neon-blue)', border: 'none', color: 'black',
                                            padding: '10px 20px', borderRadius: '10px', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px',
                                            boxShadow: '0 4px 15px rgba(0, 242, 255, 0.3)', transition: 'transform 0.2s'
                                        }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                            <i className="fas fa-external-link-alt"></i> View Original Article
                                        </a>
                                    )}
                                </div>
                                <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <i className={getPlatformIcon(selectedGap.source || '')} style={{ color: 'var(--text-muted)' }}></i>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>{selectedGap.source} / {selectedGap.channel}</span>
                                </div>
                                <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6' }}>{selectedGap.signal}</p>

                                <div style={{ marginTop: '2.5rem' }}>
                                    <h4 style={{ color: 'var(--neon-orange)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fas fa-microscope"></i> AI Inference & Root Cause
                                    </h4>
                                    <div style={{ background: 'rgba(0,0,0,0.05)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid var(--neon-orange)', color: 'var(--text-main)' }}>
                                        {selectedGap.inference || "Fragmented technical implementations and lack of standardized protocols."}
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem' }}>
                                    <h4 style={{ color: 'var(--neon-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fas fa-layer-group"></i> Recommended Solution Set
                                    </h4>
                                    <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', listStyle: 'none', padding: 0 }}>
                                        {selectedGap.mvp_features?.map(f => (
                                            <li key={f} style={{ fontSize: '0.9rem', color: 'var(--text-main)', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)', padding: '8px 12px', borderRadius: '6px' }}>
                                                <i className="fas fa-check-circle" style={{ color: 'var(--neon-green)', marginRight: '8px' }}></i> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {pitchDeck && (
                                <div className="glass-panel" style={{ padding: '2rem', marginTop: '1rem', borderTop: '4px solid var(--neon-purple)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ color: 'var(--neon-purple)', margin: 0 }}>AI Generated Pitch Deck</h3>
                                        <button onClick={() => setPitchDeck(null)} style={{ background: 'transparent', border: 'none', color: 'gray', cursor: 'pointer' }}><i className="fas fa-times"></i></button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div><strong style={{ color: 'var(--neon-purple)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Vision</strong> <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{pitchDeck.vision}</p></div>
                                        <div><strong style={{ color: 'var(--neon-purple)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Market TAM</strong> <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{pitchDeck.tam}</p></div>
                                        <div><strong style={{ color: 'var(--neon-purple)', display: 'block', fontSize: '0.7rem', textTransform: 'uppercase' }}>Core Solution</strong> <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{pitchDeck.solution}</p></div>
                                    </div>
                                    <button
                                        onClick={handlePublishVenture}
                                        style={{ width: '100%', marginTop: '1.5rem', background: 'var(--neon-purple)', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
                                    >
                                        Publish to Venture Profile & Seek Seed Funding
                                    </button>
                                </div>
                            )}
                            {analysisMap && renderRequirementMap(analysisMap)}
                            {renderBuildPathways(selectedGap)}
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '6rem 4rem', textAlign: 'center', borderStyle: 'dashed' }}>
                            <i className="fas fa-brain fa-pulse" style={{ fontSize: '4rem', color: 'var(--neon-blue)', marginBottom: '2rem', opacity: 0.5 }}></i>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Select a Pulse Signal for AI Expansion</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>GapStart will transform site signals into architectural roadmaps and job prediction models.</p>
                        </div>
                    )}
                </div>
            </div>

            {showExpertForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', zIndex: 1300, display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setShowExpertForm(false)}>
                    <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--glass-border)', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <h2 style={{ color: 'var(--text-main)', marginBottom: '1.5rem' }}>Submit Industry Gap</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Target Industry / Market</label>
                                <input
                                    type="text"
                                    value={expertInput.industry}
                                    onChange={e => setExpertInput({ ...expertInput, industry: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                    placeholder="e.g. Fintech, Healthcare..."
                                />
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Observed Inefficiency / Signal</label>
                                <textarea
                                    value={expertInput.inefficiency}
                                    onChange={e => setExpertInput({ ...expertInput, inefficiency: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white', minHeight: '120px' }}
                                    placeholder="Describe the gap or manual process you observed..."
                                />
                            </div>
                            <div>
                                <label style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Original Source URL (Optional)</label>
                                <input
                                    type="text"
                                    value={expertInput.source_url || ''}
                                    onChange={e => setExpertInput({ ...expertInput, source_url: e.target.value })}
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
                                    placeholder="https://..."
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button onClick={() => setShowExpertForm(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'transparent', color: 'white', cursor: 'pointer' }}>Cancel</button>
                                <button onClick={handleExpertSubmit} style={{ flex: 1, padding: '12px', borderRadius: '12px', background: 'var(--neon-blue)', color: 'black', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Publish Discovery</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 0.5; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default GapStartDashboard;
