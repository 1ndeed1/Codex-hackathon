/* src/components/OpportunityCard.jsx */
import React from 'react';
import { getPlatformIcon } from '../services/background_scanner';

const OpportunityCard = ({ opp, onClick }) => {
    const isMined = opp.type === 'mined' || opp.type === 'pulse';
    const isScanned = opp.type === 'scanned' || opp.type === 'coding';
    const isService = opp.type === 'service';

    let accentColor = 'var(--neon-purple)';
    if (isMined) accentColor = 'var(--neon-blue)';
    if (isScanned) accentColor = 'var(--neon-orange)';
    if (isService) accentColor = 'var(--neon-green)';

    const getVerificationText = (source) => {
        if (!source) return "Verified Source";
        const s = source.toLowerCase();
        if (s.includes('stackoverflow')) return "Verified via 10k+ developer upvotes & accepted answers.";
        if (s.includes('reddit')) return "Genuine site with millions of active developers.";
        if (s.includes('aws')) return "Verified AWS architecture discussion board.";
        if (s.includes('github')) return "Verified via active issue tracking and repository stars.";
        if (s.includes('medium')) return "Verified engineering blog with high technical rigor.";
        if (s.includes('direct')) return "User-authenticated signal with provided evidence link.";
        return "Verified Technical Source";
    };

    return (
        <>
            <style>{`
            .verified-tooltip-container:hover .verified-tooltip {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateX(-50%) translateY(-5px) !important;
            }
            .likelihood-tooltip-container:hover .likelihood-tooltip {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(-5px) !important;
            }
            @keyframes pulse {
                0% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.5); opacity: 0.3; }
                100% { transform: scale(1); opacity: 0.8; }
            }
        `}</style>
            <div
                className="glass-panel animate-fade"
                onClick={onClick}
                style={{
                    padding: '2rem',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    background: `linear-gradient(135deg, white 0%, color-mix(in srgb, ${accentColor}, transparent 90%) 100%)`,
                    borderRadius: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    border: `1px solid color-mix(in srgb, ${accentColor}, transparent 85%)`,
                    borderLeft: `6px solid ${accentColor}`
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.01)';
                    e.currentTarget.style.borderColor = accentColor;
                    e.currentTarget.style.boxShadow = `0 20px 40px color-mix(in srgb, ${accentColor}, transparent 80%)`;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = `color-mix(in srgb, ${accentColor}, transparent 88%)`;
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                }}
            >
                <div style={{ position: 'absolute', top: '15px', right: '20px', display: 'flex', gap: '8px' }}>
                    {opp.isLive && (
                        <span style={{ fontSize: '0.6rem', background: 'var(--neon-green)', color: '#000', padding: '3px 10px', borderRadius: '6px', fontWeight: 900 }}>LIVE SIGNAL</span>
                    )}
                    {!opp.isLive && isMined && (
                        <span style={{ fontSize: '0.6rem', background: 'var(--neon-blue)', color: '#000', padding: '3px 10px', borderRadius: '6px', fontWeight: 900 }}>PREDICTIVE</span>
                    )}
                    <span style={{
                        fontSize: '0.6rem',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${accentColor}`,
                        color: accentColor,
                        fontWeight: 800,
                        background: `color-mix(in srgb, ${accentColor}, transparent 95%)`
                    }}>{opp.difficulty || 'Medium'}</span>
                </div>

                <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                            <i className={getPlatformIcon(opp.source)} style={{ color: accentColor, marginRight: '8px' }}></i>
                            {opp.source} / {opp.channel}
                        </span>
                        {(isMined || isScanned || (opp.type === 'direct' && opp.sourceUrl)) && (
                            <div className="verified-tooltip-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '10px',
                                    height: '10px',
                                    background: 'var(--neon-green)',
                                    borderRadius: '50%',
                                    boxShadow: '0 0 8px var(--neon-green)',
                                    animation: 'pulse 2s infinite',
                                    cursor: 'help'
                                }}></div>
                                <div className="verified-tooltip" style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    marginBottom: '10px',
                                    background: 'rgba(0,0,0,0.9)',
                                    color: 'white',
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    fontSize: '0.7rem',
                                    whiteSpace: 'nowrap',
                                    opacity: 0,
                                    visibility: 'hidden',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid var(--neon-green)',
                                    zIndex: 10,
                                    fontWeight: 500,
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                                }}>
                                    <i className="fas fa-shield-check" style={{ marginRight: '6px', color: 'var(--neon-green)' }}></i>
                                    {getVerificationText(opp.source)}
                                </div>
                            </div>
                        )}
                    </div>
                    {opp.type === 'direct' && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                            By: <span style={{ color: 'var(--text-main)' }}>
                                {opp.isAnonymous
                                    ? 'Anonymous'
                                    : (opp.authorProfile?.username || opp.authorProfile?.email?.split('@')[0] || 'Unknown User')}
                            </span>
                        </span>
                    )}
                </div>

                <h3 style={{ fontSize: '1.3rem', marginBottom: '1.2rem', lineHeight: '1.4', color: 'var(--text-main)', fontWeight: 700 }}>{opp.title}</h3>

                <div style={{ flex: 1 }}>
                    <div style={{
                        padding: '1.2rem',
                        borderRadius: '16px',
                        marginBottom: '1.2rem',
                        border: `1px dashed color-mix(in srgb, ${accentColor}, transparent 70%)`,
                        background: `color-mix(in srgb, ${accentColor}, transparent 95%)`
                    }}>
                        <label style={{ fontSize: '0.65rem', color: accentColor, textTransform: 'uppercase', display: 'block', marginBottom: '6px', fontWeight: 900 }}>
                            {isMined ? 'Detected Market Signal' : (isScanned ? 'Issue Report' : 'Problem Abstract')}
                        </label>
                        <p style={{ fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--text-main)', margin: 0, lineHeight: '1.6' }}>
                            "{opp.signal || opp.abstract || "No detailed signal metadata available."}"
                        </p>
                        {opp.sourceUrl && (
                            <div style={{ marginTop: '12px' }}>
                                <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: accentColor, textDecoration: 'none', fontWeight: 700 }}>
                                    <i className="fas fa-external-link-alt"></i> Trace Source Signal
                                </a>
                            </div>
                        )}
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>{opp.inference}</p>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {opp.tags?.map(tag => (
                            <span key={tag} style={{
                                background: 'rgba(0,0,0,0.03)',
                                padding: '5px 12px',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                color: 'var(--text-main)',
                                border: '1px solid var(--glass-border)',
                                fontWeight: 500
                            }}>{tag}</span>
                        ))}

                        <div className="likelihood-tooltip-container" style={{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <div style={{
                                background: `color-mix(in srgb, ${accentColor}, transparent 90%)`,
                                border: `1px solid color-mix(in srgb, ${accentColor}, transparent 70%)`,
                                padding: '6px 14px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'help'
                            }}>
                                <i className="fas fa-chart-line" style={{ color: accentColor, fontSize: '0.8rem' }}></i>
                                <span style={{ color: accentColor, fontWeight: 800, fontSize: '0.8rem' }}>
                                    {opp.jobProbability}
                                </span>
                            </div>
                            <div className="likelihood-tooltip" style={{
                                position: 'absolute',
                                bottom: '100%',
                                right: '0',
                                marginBottom: '10px',
                                background: 'rgba(0,0,0,0.9)',
                                color: 'white',
                                padding: '8px 14px',
                                borderRadius: '10px',
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap',
                                opacity: 0,
                                visibility: 'hidden',
                                transition: 'all 0.3s ease',
                                border: `1px solid ${accentColor}`,
                                zIndex: 10,
                                fontWeight: 600,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}>
                                <span style={{ color: accentColor }}>Hiring Likelihood</span> Benchmarked by AI
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '1.2rem',
                        borderTop: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="fas fa-users" style={{ color: accentColor, fontSize: '0.9rem' }}></i>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                                    Solvers: {opp.solverCount || 0}/{opp.maxSolvers || 10}
                                </span>
                            </div>
                        </div>
                        <span style={{ color: accentColor, fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            Inspect & Solve <i className="fas fa-chevron-right"></i>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OpportunityCard;
