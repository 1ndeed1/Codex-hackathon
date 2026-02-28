import React, { useState, useEffect } from 'react';
import { fetchLiveDomainData, fetchLiveDomainDetails } from '../services/liveDataService';

const Pathfinder = () => {
    const [domains, setDomains] = useState([]);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [domainDetails, setDomainDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fetchingDetails, setFetchingDetails] = useState(false);

    useEffect(() => {
        const loadDomains = async () => {
            setLoading(true);
            try {
                const data = await fetchLiveDomainData();
                setDomains(data);
            } catch (err) {
                console.error("Failed to fetch domain data", err);
            } finally {
                setLoading(false);
            }
        };
        loadDomains();
    }, []);

    const handleSelectDomain = async (domainId) => {
        setSelectedDomain(domainId);
        setFetchingDetails(true);
        try {
            const details = await fetchLiveDomainDetails(domainId);
            setDomainDetails(details);
        } catch (err) {
            console.error("Failed to fetch domain details", err);
        } finally {
            setFetchingDetails(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-satellite-dish fa-spin" style={{ fontSize: '3rem', color: 'var(--neon-blue)', marginBottom: '1rem' }}></i>
                <h3>Scraping Live Industry Signals...</h3>
                <p>Analyzing global market data for high-growth sectors.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
            <section style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1.5px' }}>Pathfinder: Career Guidance Engine</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Stop applying to generic "software engineer" roles. Pick a high-growth domain and combine it with technical execution.
                </p>
            </section>

            {!selectedDomain ? (
                <div>
                    <h2 style={{ marginBottom: '1.5rem', color: 'var(--text-main)' }}>1. Select Your Target Sector</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {domains.map(domain => (
                            <div
                                key={domain.id}
                                onClick={() => handleSelectDomain(domain.id)}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    border: `1px solid ${domain.color}`,
                                    borderRadius: '16px',
                                    padding: '2rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    boxShadow: `0 4px 20px ${domain.color}20`
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1rem' }}>
                                    <div style={{
                                        width: '50px', height: '50px', borderRadius: '12px',
                                        background: `${domain.color}20`, color: domain.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1.5rem'
                                    }}>
                                        <i className={`fas ${domain.icon}`}></i>
                                    </div>
                                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-main)' }}>{domain.title}</h3>
                                </div>

                                <div style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                    <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Live Market Size:</p>
                                    <p style={{ margin: 0, fontWeight: 'bold', color: domain.color }}>{domain.liveStats.marketSize}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                fetchingDetails ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--neon-purple)', marginBottom: '1rem' }}></i>
                        <h3>Extracting Specific Domain Architecture...</h3>
                    </div>
                ) : domainDetails && (
                    <div>
                        <button
                            onClick={() => { setSelectedDomain(null); setDomainDetails(null); }}
                            style={{
                                background: 'rgba(255,255,255,0.8)', border: '1px solid var(--glass-border)',
                                color: 'var(--text-main)', padding: '8px 16px', borderRadius: '8px',
                                cursor: 'pointer', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            <i className="fas fa-arrow-left"></i> Change Domain
                        </button>

                        <div style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            border: `1px solid ${domainDetails.color}`,
                            borderRadius: '20px',
                            padding: '3rem',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Abstract decorative background */}
                            <div style={{
                                position: 'absolute', top: '-50%', right: '-10%',
                                width: '500px', height: '500px', borderRadius: '50%',
                                background: `radial-gradient(circle, ${domainDetails.color}20 0%, transparent 70%)`,
                                zIndex: 0, pointerEvents: 'none'
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '2rem' }}>
                                    <i className={`fas ${domainDetails.icon}`} style={{ fontSize: '3rem', color: domainDetails.color }}></i>
                                    <div>
                                        <h2 style={{ fontSize: '2rem', margin: '0 0 5px 0', color: 'var(--text-main)' }}>{domainDetails.title} Roadmap</h2>
                                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Evidence-backed 6-month acceleration plan.</p>
                                    </div>
                                </div>

                                {/* Live Stats Bar */}
                                <div style={{
                                    display: 'flex', gap: '2rem', background: 'rgba(240,240,240,0.8)', border: '1px solid var(--glass-border)',
                                    padding: '1.5rem', borderRadius: '12px', marginBottom: '3rem', flexWrap: 'wrap'
                                }}>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Market Target</p>
                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--text-main)' }}>{domainDetails.liveStats.marketSize}</p>
                                    </div>
                                    <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Growth (CAGR)</p>
                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: domainDetails.color }}>{domainDetails.liveStats.cagr}</p>
                                    </div>
                                    <div style={{ width: '1px', background: 'var(--glass-border)' }}></div>
                                    <div>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Hiring Signal</p>
                                        <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--neon-green)' }}>{domainDetails.liveStats.hiringIntent}</p>
                                    </div>
                                    <div style={{ flex: 1, textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Scraped via: {domainDetails.sources.join(', ')}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>

                                    {/* Left Column: Timeline */}
                                    <div>
                                        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                                            <i className="fas fa-calendar-alt" style={{ marginRight: '10px', color: 'var(--accent)' }}></i>
                                            Strict Execution Timeline
                                        </h3>

                                        {[
                                            { label: 'Months 1-2', data: domainDetails.roadmap.month1_2 },
                                            { label: 'Months 3-4', data: domainDetails.roadmap.month3_4 },
                                            { label: 'Months 5-6', data: domainDetails.roadmap.month5_6 }
                                        ].map((phase, i) => (
                                            <div key={i} style={{ marginBottom: '2rem', position: 'relative', paddingLeft: '20px', borderLeft: `2px solid ${domainDetails.color}50` }}>
                                                <div style={{
                                                    position: 'absolute', left: '-6px', top: '0',
                                                    width: '10px', height: '10px', borderRadius: '50%',
                                                    background: domainDetails.color
                                                }}></div>
                                                <h4 style={{ margin: '0 0 5px 0', color: 'var(--text-main)' }}>{phase.label}: {phase.data.focus}</h4>
                                                <ul style={{ margin: 0, paddingLeft: '20px', color: 'var(--text-muted)' }}>
                                                    {phase.data.skills.map((skill, j) => (
                                                        <li key={j} style={{ marginBottom: '5px' }}>{skill}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right Column: Projects & Certs */}
                                    <div>
                                        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                                            <i className="fas fa-hammer" style={{ marginRight: '10px', color: 'var(--neon-orange)' }}></i>
                                            Mandatory Proof of Work
                                        </h3>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                                            {domainDetails.projects.map((proj, i) => (
                                                <div key={i} style={{ background: 'rgba(255,255,255,0.8)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                                    <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-main)' }}>🏗️ {proj.name}</h4>
                                                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>{proj.desc}</p>
                                                </div>
                                            ))}
                                        </div>

                                        <h3 style={{ color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                                            <i className="fas fa-certificate" style={{ marginRight: '10px', color: 'var(--neon-green)' }}></i>
                                            Target Certifications
                                        </h3>
                                        <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
                                            {domainDetails.certifications.map((cert, i) => (
                                                <li key={i} style={{ marginBottom: '10px' }}>{cert}</li>
                                            ))}
                                        </ul>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default Pathfinder;
