/* src/components/GapStartDashboard.jsx */
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { analyzeRequirements, expandGap, discoverB2BGaps, monitorIndustryGaps } from '../services/gapstart_service';

const GapStartDashboard = ({ identity }) => {
    const [activeView, setActiveView] = useState('discovered'); // 'discovered', 'external', 'b2b'
    const [opportunities, setOpportunities] = useState([]);
    const [externalGaps, setExternalGaps] = useState([]);
    const [b2bGaps, setB2bGaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGap, setSelectedGap] = useState(null);
    const [analysisMap, setAnalysisMap] = useState(null);
    const [showExpertForm, setShowExpertForm] = useState(false);
    const [expertInput, setExpertInput] = useState({ industry: '', inefficiency: '' });
    const [pitchDeck, setPitchDeck] = useState(null);
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [dbError, setDbError] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data: opps } = await supabase.from('opportunities').select('*').order('created_at', { ascending: false });
        const { data: external, error: extError } = await supabase.from('external_gaps').select('*').order('created_at', { ascending: false });

        if (extError && extError.code === '42P01') { // Table does not exist
            setDbError(true);
        }

        setOpportunities(opps || []);
        setExternalGaps(external || []);
        setB2bGaps(discoverB2BGaps());
        setLoading(false);
    };

    const handleMonitor = async () => {
        setIsMonitoring(true);
        try {
            await monitorIndustryGaps(identity?.id);
            await fetchData();
        } catch (e) {
            console.error(e);
        }
        setIsMonitoring(false);
    };

    const handleAnalyze = async (item) => {
        setLoading(true);
        // Normalize B2B data for engines if necessary
        const normalizedItem = {
            ...item,
            title: item.title || item.missing_service || "B2B Service Gap",
            signal: item.signal || item.description || item.inefficiency || ""
        };
        const map = await analyzeRequirements(normalizedItem);
        const expanded = expandGap(normalizedItem);
        setSelectedGap(expanded);
        setAnalysisMap(map);
        setPitchDeck(null);
        setLoading(false);
    };

    const handleExpertSubmit = async () => {
        if (!expertInput.industry || !expertInput.inefficiency) return;
        const { error } = await supabase.from('external_gaps').insert([{
            source: 'Expert Submission',
            industry: expertInput.industry,
            inefficiency: expertInput.inefficiency,
            submitter_id: identity.id,
            status: 'pending'
        }]);
        if (!error) {
            setShowExpertForm(false);
            setExpertInput({ industry: '', inefficiency: '' });
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

    const renderRequirementMap = (map) => (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '2rem', border: '1px solid var(--neon-blue)' }}>
            <h3 style={{ color: 'var(--neon-blue)', marginBottom: '1.5rem' }}>
                <i className="fas fa-map-signs"></i> Intelligent Requirement Map
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--neon-purple)', textTransform: 'uppercase' }}>Finance</h4>
                    <p style={{ fontSize: '0.9rem' }}>{map.finance}</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--neon-blue)', textTransform: 'uppercase' }}>Operations</h4>
                    <p style={{ fontSize: '0.9rem' }}>{map.operations}</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--neon-green)', textTransform: 'uppercase' }}>HR & Staffing</h4>
                    <p style={{ fontSize: '0.9rem' }}>{map.hr}</p>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px' }}>
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
                    <p style={{ fontSize: '0.9rem', color: 'white' }}>{map.technical_solve}</p>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                    <h4 style={{ color: 'white' }}>Startup Pathway</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Build this as a standalone SaaS product.</p>
                    <div style={{ margin: '1rem 0', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem' }}>Market Potential: <strong>{gap.startup_score}%</strong></div>
                        <div style={{ fontSize: '0.8rem' }}>Difficulty: <strong>{gap.difficulty}</strong></div>
                    </div>
                    <button className="neon-btn-purple" style={{ width: '100%', padding: '10px' }} onClick={() => generatePitchDeck(gap)}>Generate Pitch Deck</button>
                </div>
                <div>
                    <h4 style={{ color: 'white' }}>Freelance Pathway</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Directly solve this for the target company.</p>
                    <div style={{ margin: '1rem 0', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '0.8rem' }}>Conversion Prob: <strong>{gap.freelance_score}%</strong></div>
                        <div style={{ fontSize: '0.8rem' }}>Build Speed: <strong>High</strong></div>
                    </div>
                    <button className="neon-btn-blue" style={{ width: '100%', padding: '10px' }}>Submit Proposal</button>
                </div>
            </div>
        </div>
    );

    const renderPitchDeck = () => (
        <div className="glass-panel" style={{ padding: '2rem', marginTop: '1rem', borderTop: '4px solid var(--neon-purple)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ color: 'var(--neon-purple)', margin: 0 }}>AI Generated Pitch Deck</h3>
                <button onClick={() => setPitchDeck(null)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><i className="fas fa-times"></i></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div><strong style={{ color: 'var(--neon-purple)' }}>Vision:</strong> <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{pitchDeck.vision}</p></div>
                <div><strong style={{ color: 'var(--neon-purple)' }}>Market (TAM):</strong> <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{pitchDeck.tam}</p></div>
                <div><strong style={{ color: 'var(--neon-purple)' }}>Solution:</strong> <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{pitchDeck.solution}</p></div>
                <div><strong style={{ color: 'var(--neon-purple)' }}>Traction:</strong> <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>{pitchDeck.traction}</p></div>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: '3rem', letterSpacing: '-2px', background: 'linear-gradient(45deg, var(--neon-blue), var(--neon-purple))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>Coding Architecture Engine</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Transforming technical bottlenecks into architectural solutions and job roles.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={handleMonitor}
                        disabled={isMonitoring || dbError}
                        className="neon-btn-purple"
                        style={{ fontSize: '0.8rem', opacity: isMonitoring ? 0.6 : 1 }}>
                        <i className={`fas fa-microchip ${isMonitoring ? 'fa-spin' : ''}`}></i> {isMonitoring ? 'Scanning Industries...' : 'Start AI Monitor'}
                    </button>
                    <button onClick={() => setShowExpertForm(true)} className="neon-btn-blue" style={{ fontSize: '0.8rem' }}>
                        <i className="fas fa-plus"></i> Expert Gap Submission
                    </button>
                </div>
            </header>

            {dbError && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', border: '2px solid var(--neon-orange)', background: 'rgba(255, 69, 0, 0.1)', boxShadow: '0 0 20px rgba(255, 69, 0, 0.2)' }}>
                    <h3 style={{ color: 'var(--neon-orange)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <i className="fas fa-hammer fa-bounce"></i> CRITICAL SETUP REQUIRED: Database Tables Missing
                    </h3>
                    <p style={{ fontSize: '1rem', color: 'white', fontWeight: 600, marginBottom: '1rem' }}>
                        The Coding Engine cannot start because the Supabase tables don't exist yet.
                    </p>
                    <pre style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--neon-blue)', overflowX: 'auto', border: '1px solid var(--glass-border)' }}>
                        {`-- Create GapStart Tables
CREATE TABLE IF NOT EXISTS external_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    inefficiency TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    submitter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS requirement_maps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    finance TEXT, hr TEXT, operations TEXT, customer_handling TEXT, analytics TEXT,
    automation_opps TEXT, efficiency_gain INTEGER,
    technical_solve TEXT, architecture_plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`}
                    </pre>
                    <button
                        onClick={() => { setDbError(false); fetchData(); }}
                        className="neon-btn-blue"
                        style={{ marginTop: '1rem', padding: '8px 20px', fontSize: '0.8rem' }}>
                        I've run the SQL, Refresh Data
                    </button>
                </div>
            )}

            {showExpertForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ width: '500px', padding: '2rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Submit Industry Inefficiency</h3>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Industry</label>
                        <input type="text" value={expertInput.industry} onChange={e => setExpertInput({ ...expertInput, industry: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', marginBottom: '1rem', outline: 'none' }} placeholder="e.g. Healthcare, Logistics" />
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inefficiency Description</label>
                        <textarea rows="4" value={expertInput.inefficiency} onChange={e => setExpertInput({ ...expertInput, inefficiency: e.target.value })} style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', marginBottom: '1.5rem', outline: 'none' }} placeholder="Describe the repetitive workflow issue or software missing in the market..." />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={handleExpertSubmit} className="neon-btn-blue" style={{ flex: 1, padding: '12px' }}>Submit for Review</button>
                            <button onClick={() => setShowExpertForm(false)} style={{ flex: 1, background: 'transparent', border: '1px solid gray', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <button onClick={() => setActiveView('discovered')} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--neon-blue)', background: activeView === 'discovered' ? 'var(--neon-blue)' : 'transparent', color: activeView === 'discovered' ? 'black' : 'var(--neon-blue)', cursor: 'pointer', fontWeight: 700, transition: '0.2s' }}>Pulse Signals</button>
                        <button onClick={() => setActiveView('b2b')} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--neon-green)', background: activeView === 'b2b' ? 'var(--neon-green)' : 'transparent', color: activeView === 'b2b' ? 'black' : 'var(--neon-green)', cursor: 'pointer', fontWeight: 700, transition: '0.2s' }}>Service Gaps</button>
                        <button onClick={() => setActiveView('external')} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--neon-purple)', background: activeView === 'external' ? 'var(--neon-purple)' : 'transparent', color: activeView === 'external' ? 'black' : 'var(--neon-purple)', cursor: 'pointer', fontWeight: 700, transition: '0.2s' }}>Coding Gaps</button>
                    </div>

                    {loading ? <div style={{ color: 'var(--text-muted)' }}>AI Processing...</div> : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {((activeView === 'discovered' ? opportunities : (activeView === 'external' ? externalGaps : b2bGaps))).map(item => (
                                <div key={item.id} className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer', transition: '0.3s', border: selectedGap?.id === item.id ? '1px solid var(--neon-blue)' : '1px solid var(--glass-border)' }} onClick={() => handleAnalyze(item)}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ color: 'white', margin: 0 }}>{item.title || item.missing_service || (item.inefficiency ? item.inefficiency.substring(0, 50) + '...' : 'Untitled Inefficiency')}</h4>
                                        <span style={{ fontSize: '0.7rem', color: activeView === 'b2b' ? 'var(--neon-green)' : 'var(--neon-blue)', background: 'rgba(0, 242, 255, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>{item.industry || item.industry_a || item.source || 'Tech'}</span>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', marginBottom: 0 }}>{((item.signal || item.inefficiency || item.description || "")).substring(0, 120)}...</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ flex: 1.5 }}>
                    {selectedGap ? (
                        <div>
                            <div className="glass-panel" style={{ padding: '2.5rem' }}>
                                <h2 style={{ marginBottom: '1rem', color: 'white', fontSize: '1.8rem' }}>{selectedGap.title || "External Gap Analysis"}</h2>
                                <p style={{ color: 'var(--text-main)', fontSize: '1rem', lineHeight: '1.6' }}>{selectedGap.signal || selectedGap.inefficiency}</p>

                                <div style={{ marginTop: '2.5rem' }}>
                                    <h4 style={{ color: 'var(--neon-orange)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fas fa-microscope"></i> Root Cause Identified
                                    </h4>
                                    <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1.2rem', borderRadius: '12px', borderLeft: '4px solid var(--neon-orange)', color: 'var(--text-main)' }}>
                                        {selectedGap.root_cause}
                                    </div>
                                </div>

                                <div style={{ marginTop: '2.5rem' }}>
                                    <h4 style={{ color: 'var(--neon-green)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <i className="fas fa-layer-group"></i> Recommended MVP Feature Set
                                    </h4>
                                    <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', listStyle: 'none', padding: 0 }}>
                                        {selectedGap.mvp_features?.map(f => (
                                            <li key={f} style={{ fontSize: '0.9rem', color: 'white', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderRadius: '6px' }}>
                                                <i className="fas fa-check-circle" style={{ color: 'var(--neon-green)', marginRight: '8px' }}></i> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {selectedGap.job_roles && (
                                    <div style={{ marginTop: '2.5rem' }}>
                                        <h4 style={{ color: 'var(--neon-blue)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <i className="fas fa-user-tie"></i> High-Demand Job Roles Created
                                        </h4>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {selectedGap.job_roles.map(role => (
                                                <span key={role} style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '6px 15px', borderRadius: '20px', border: '1px solid var(--neon-blue)', color: 'var(--neon-blue)', fontSize: '0.8rem' }}>
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {pitchDeck && renderPitchDeck()}
                            {analysisMap && renderRequirementMap(analysisMap)}
                            {renderBuildPathways(selectedGap)}
                        </div>
                    ) : (
                        <div className="glass-panel" style={{ padding: '6rem 4rem', textAlign: 'center', borderStyle: 'dashed' }}>
                            <i className="fas fa-brain fa-pulse" style={{ fontSize: '4rem', color: 'var(--neon-blue)', marginBottom: '2rem', opacity: 0.5 }}></i>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Select a Signal to Initialize Discovery</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>GapStart AI will expand the identified friction into a comprehensive digital transformation roadmap and buildable product idea.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GapStartDashboard;
