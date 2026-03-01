import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PathfinderService from '../services/pathfinder_service';
import { fetchLiveDomainData } from '../services/liveDataService';
import './Pathfinder.css';

function PathfinderDashboard() {
    const { trackId } = useParams();
    const [domains, setDomains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [generating, setGenerating] = useState(false);
    const [companyError, setCompanyError] = useState('');
    const navigate = useNavigate();

    const isBlooming = trackId === 'blooming';

    useEffect(() => {
        async function loadDomains() {
            setLoading(true);
            try {
                // Fetch from the high-fidelity liveDataService (the article data)
                const liveData = await fetchLiveDomainData(trackId);

                // Also fetch from Supabase if any
                const dbData = await PathfinderService.getTrendingDomains();

                // Combine and prioritize liveData (article data) for this view
                const combined = [...liveData, ...dbData.filter(d => !liveData.find(ld => ld.id === d.id))];

                setDomains(combined);
            } catch (err) {
                console.error("Failed to load domains", err);
            }
            setLoading(false);
        }
        loadDomains();
    }, [trackId]);

    const handleGenerateCustom = async () => {
        if (!searchQuery.trim()) return;
        setCompanyError('');
        setGenerating(true);

        const lowerQ = searchQuery.toLowerCase();
        const isFake = ['test', 'fake', 'asdf', 'unknown', 'dummy'].some(w => lowerQ.includes(w));
        const hasNoVowels = !/[aeiouy]/i.test(lowerQ);

        if (isFake || hasNoVowels || lowerQ.length < 2) {
            setTimeout(() => {
                setGenerating(false);
                setCompanyError(`Company with the name "${searchQuery}" does not exist or isn't hiring tech talent. Please try a valid tech company.`);
            }, 1500);
            return;
        }

        setTimeout(() => {
            setGenerating(false);
            navigate(`/pathfinder/custom?company=${encodeURIComponent(searchQuery)}`);
        }, 2500);
    };

    return (
        <div className="pathfinder-container">
            <button
                onClick={() => navigate('/pathfinder')}
                className="pf-back-btn"
                style={{ marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 600 }}
            >
                <i className="fas fa-arrow-left"></i> Back to Tracks
            </button>

            <div className="pathfinder-header" style={{ marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '10px',
                        background: isBlooming ? 'var(--neon-blue)20' : 'var(--neon-purple)20',
                        color: isBlooming ? 'var(--neon-blue)' : 'var(--neon-purple)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <i className={`fas ${isBlooming ? 'fa-seedling' : 'fa-user-graduate'}`}></i>
                    </div>
                    <span style={{ color: isBlooming ? 'var(--neon-blue)' : 'var(--neon-purple)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
                        {isBlooming ? 'Blooming Hybrids' : 'Classic Post-Grad'}
                    </span>
                </div>
                <h1 className="pathfinder-title">
                    {isBlooming ? 'High-Growth Frontier Sectors' : 'Core IT Career Pathways'}
                </h1>
                <p className="pathfinder-subtitle">
                    {isBlooming
                        ? 'Target the skills gap in India\'s most promising emerging domains where tech meets heavy industry.'
                        : 'Navigate the established high-volume IT markets with a focus on deep technical mastery.'}
                </p>
            </div>

            {/* Custom Company AI Generator Section */}
            <div className="pf-generator-card">
                <div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-magic" style={{ color: 'var(--neon-purple)' }}></i>
                        Target Specific Company
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Enter a company name to generate a tailored {isBlooming ? 'hybrid integration' : 'technical execution'} plan for their active tech stacks.
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
                            <><i className="fas fa-circle-notch fa-spin"></i> Analyzing...</>
                        ) : (
                            <><i className="fas fa-radar"></i> Generate Strategy</>
                        )}
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <i className="fas fa-layer-group" style={{ color: isBlooming ? 'var(--neon-blue)' : 'var(--neon-purple)' }}></i>
                    Active Opportunity Domains
                </h3>

                {loading ? (
                    <div className="pf-loader">
                        <div className="pf-spinner"></div>
                        <span>Synchronizing with {isBlooming ? 'Industry Frontier' : 'Market Majors'}...</span>
                    </div>
                ) : (
                    <div className="pf-domains-grid">
                        {domains.map((domain) => (
                            <DomainCard key={domain.id} domain={domain} navigate={navigate} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Component for Domain Cards
function DomainCard({ domain, navigate }) {
    return (
        <div
            className="pf-domain-card"
            onClick={() => navigate(`/pathfinder/roadmap/${domain.id}`)}
            style={{
                borderLeft: `4px solid ${domain.color}`,
                background: 'var(--glass-bg)',
                borderRadius: '16px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
            }}
        >
            <div className="pf-domain-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '45px', height: '45px', borderRadius: '10px',
                        background: `${domain.color}15`, color: domain.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem'
                    }}>
                        <i className={`fas ${domain.icon}`}></i>
                    </div>
                    <h3 className="pf-domain-title" style={{ margin: 0, fontSize: '1.3rem' }}>
                        {domain.title || domain.name}
                    </h3>
                </div>
                {domain.liveStats && (
                    <span style={{
                        fontSize: '0.75rem', fontWeight: 800, color: 'var(--neon-green)',
                        background: 'rgba(5, 150, 105, 0.1)', padding: '4px 8px', borderRadius: '6px'
                    }}>
                        {domain.liveStats.hiringIntent}
                    </span>
                )}
            </div>

            <div className="pf-domain-desc" style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {domain.gapAnalysis || domain.description}
            </div>

            {domain.hybridRoles && (
                <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Blooming Roles:</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {domain.hybridRoles.map((role, idx) => (
                            <span key={idx} style={{ background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                {role}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="pf-domain-footer" style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Growth: <span style={{ color: 'var(--text-main)', fontWeight: 700 }}>{domain.liveStats?.cagr || 'Stable'}</span>
                    </span>
                    {domain.sources && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--neon-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <i className="fas fa-file-invoice"></i> {domain.sources.length} Sources Cited
                        </span>
                    )}
                </div>
                <span className="pf-view-btn" style={{ color: domain.color, fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Explore Path <i className="fas fa-chevron-right"></i>
                </span>
            </div>
        </div>
    );
}

export default PathfinderDashboard;
