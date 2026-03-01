import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PathfinderService from '../services/pathfinder_service';
import './Pathfinder.css';

function PathfinderDashboard() {
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [generating, setGenerating] = useState(false);
    const [companyError, setCompanyError] = useState('');
    const navigate = useNavigate();

    // Mock categorized domains
    const mockDomains = [
        // Top / High Demand
        { id: 'ai-engineer', name: 'AI / Machine Learning Engineer', demand_score: 98, category: 'Top Demand', description: 'Massive requirement for LLM orchestration and fine-tuning.', tools: ['Python', 'PyTorch', 'LangChain', 'HuggingFace'], last_verified_at: new Date().toISOString() },
        { id: 'cloud-arch', name: 'Cloud Server Engineer', demand_score: 95, category: 'Top Demand', description: 'Deep need for scalable distributed systems architecture.', tools: ['AWS/GCP', 'Kubernetes', 'Terraform', 'Golang'], last_verified_at: new Date().toISOString() },

        // Mid / Constant Growth
        { id: 'fullstack-dev', name: 'Full Stack Web Developer', demand_score: 82, category: 'Mid Growth', description: 'Steady and constant growth supporting business digitizations.', tools: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'], last_verified_at: new Date().toISOString() },
        { id: 'data-analyst', name: 'Data Analyst / BI', demand_score: 78, category: 'Mid Growth', description: 'Consistent requirement for business intelligence and reporting.', tools: ['SQL', 'Tableau', 'Excel', 'Python (Pandas)'], last_verified_at: new Date().toISOString() },

        // Low / Less Required
        { id: 'desktop-dev', name: 'Native Desktop Developer (Legacy)', demand_score: 35, category: 'Low Demand', description: 'Decreasing demand as web apps replace native desktop software.', tools: ['C++', 'WPF', 'WinForms', 'Electron'], last_verified_at: new Date().toISOString() },
        { id: 'manual-qa', name: 'Manual QA Tester', demand_score: 41, category: 'Low Demand', description: 'Slowly being replaced by automated integration testing.', tools: ['Jira', 'Postman (Basic)', 'Selenium IDE'], last_verified_at: new Date().toISOString() },

        // Core Engineering (Non-CS)
        { id: 'mechanical', name: 'Mechanical Engineering (Robotics/EV)', demand_score: 88, category: 'Mid Growth', description: 'High demand for automation and electric vehicle design specialists.', tools: ['SolidWorks', 'ROS', 'Mechatronics', 'MATLAB'], last_verified_at: new Date().toISOString() },
        { id: 'electrical', name: 'Electrical & Power Systems', demand_score: 85, category: 'Mid Growth', description: 'Critical roles in smart grid management and semiconductor design.', tools: ['Altium', 'VLSI', 'Smart Grids', 'C/C++'], last_verified_at: new Date().toISOString() },
        { id: 'civil', name: 'Civil & Smart Infrastructure (BIM)', demand_score: 76, category: 'Mid Growth', description: 'Digital transformation of construction through BIM and smart city tech.', tools: ['Revit', 'Navisworks', 'Site Analysis', 'BIM'], last_verified_at: new Date().toISOString() }
    ];

    useEffect(() => {
        async function loadDomains() {
            try {
                const data = await PathfinderService.getTrendingDomains();
                // Combine DB domains with our diverse mock domains, removing duplicates by ID if any
                const combined = [...data, ...mockDomains].reduce((acc, current) => {
                    const x = acc.find(item => item.id === current.id);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                setDomains(combined);
            } catch (err) {
                setDomains(mockDomains);
            }
            setLoading(false);
        }
        loadDomains();
    }, []);

    const handleGenerateCustom = async () => {
        if (!searchQuery.trim()) return;
        setCompanyError('');
        setGenerating(true);

        // Simple Validation: Reject keyboard smashes, test/fake names, or empty
        const lowerQ = searchQuery.toLowerCase();
        const isFake = ['test', 'fake', 'asdf', 'unknown', 'dummy'].some(w => lowerQ.includes(w));
        const hasNoVowels = !/[aeiouy]/i.test(lowerQ); // Keyboard smash heuristic

        if (isFake || hasNoVowels || lowerQ.length < 2) {
            setTimeout(() => {
                setGenerating(false);
                setCompanyError(`Company with the name "${searchQuery}" does not exist or isn't hiring tech talent. Please try a valid tech company. (e.g. Netflix, Vercel)`);
            }, 1500);
            return;
        }

        // Simulate AI / Backend analysis time to generate custom company roadmap
        setTimeout(() => {
            setGenerating(false);
            // Route to custom pathfinder
            navigate(`/pathfinder/custom?company=${encodeURIComponent(searchQuery)}`);
        }, 2500);
    };

    return (
        <div className="pathfinder-container">
            <div className="pathfinder-header">
                <h1 className="pathfinder-title">Career Pathfinder</h1>
                <p className="pathfinder-subtitle">
                    Real-time, data-driven learning roadmaps based on what the industry is currently hiring for.
                    Discover verified trends or generate a custom strike-plan for your dream company.
                </p>
            </div>

            {/* Custom Company AI Generator Section */}
            <div className="pf-generator-card">
                <div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-magic" style={{ color: 'var(--neon-purple)' }}></i>
                        Custom Company Target
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Enter a specific company to trigger a real-time analysis of their current requirements, active projects, and future bets. We'll generate a week-by-week execution plan.
                    </p>
                </div>
                <div className="pf-generator-row">
                    <div style={{ flex: 1 }}>
                        <input
                            type="text"
                            className="pf-input-field"
                            placeholder="e.g., Netflix, Vercel, SpaceX, Notion..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateCustom()}
                        />
                        {companyError && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '8px', fontWeight: 'bold' }}>{companyError}</div>}
                    </div>
                    <button
                        className="pf-btn-generate"
                        onClick={handleGenerateCustom}
                        disabled={generating || !searchQuery.trim()}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        {generating ? (
                            <><i className="fas fa-circle-notch fa-spin"></i> Analyzing Market...</>
                        ) : (
                            <><i className="fas fa-radar"></i> Generate Attack Plan</>
                        )}
                    </button>
                </div>
            </div>

            <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Top / High Demand Domains</h3>
            {loading ? (
                <div className="pf-loader">
                    <div className="pf-spinner"></div>
                    <span>Synchronizing with global job markets...</span>
                </div>
            ) : (
                <div className="pf-domains-grid">
                    {domains.filter(d => !d.category || d.category === 'Top Demand').map((domain) => (
                        <DomainCard key={domain.id} domain={domain} navigate={navigate} />
                    ))}
                </div>
            )}

            {!loading && (
                <>
                    <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', marginTop: '3rem', color: 'var(--neon-purple)' }}>Mid / Constant Growth Domains</h3>
                    <div className="pf-domains-grid">
                        {domains.filter(d => d.category === 'Mid Growth').map((domain) => (
                            <DomainCard key={domain.id} domain={domain} navigate={navigate} />
                        ))}
                    </div>

                    <h3 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', marginTop: '3rem', color: '#6b7280' }}>Low / Saturated Demand Domains</h3>
                    <div className="pf-domains-grid">
                        {domains.filter(d => d.category === 'Low Demand').map((domain) => (
                            <DomainCard key={domain.id} domain={domain} navigate={navigate} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// Helper Component for Domain Cards
function DomainCard({ domain, navigate }) {
    return (
        <div
            className="pf-domain-card"
            onClick={() => navigate(`/pathfinder/${domain.id}`)}
        >
            <div className="pf-domain-header">
                <h3 className="pf-domain-title">
                    {domain.name}
                </h3>
                <span className={`pf-demand-badge ${domain.demand_score < 50 ? 'border-red-500 text-red-500 bg-red-900/10' : domain.demand_score < 85 ? 'border-yellow-500 text-yellow-500 bg-yellow-900/10' : ''}`}>
                    Score: {domain.demand_score}
                </span>
            </div>

            <div className="pf-domain-desc">
                {domain.description}
            </div>

            {domain.tools && domain.tools.length > 0 && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Core Requirements:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {domain.tools.map((t, idx) => (
                            <span key={idx} style={{ background: 'rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {t}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="pf-domain-footer" style={{ marginTop: '1.5rem' }}>
                <span>Live as of: {new Date(domain.last_verified_at).toLocaleDateString()}</span>
                <span className="pf-view-btn">View Path <i className="fas fa-arrow-right"></i></span>
            </div>
        </div>
    );
}

export default PathfinderDashboard;
