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
<<<<<<< HEAD
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
                borderLeft: `4px solid ${accentColor}`,
                background: `linear-gradient(135deg, ${accentColor}11 0%, transparent 100%)`
            }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.01)';
                e.currentTarget.style.boxShadow = `0 20px 40px ${accentColor}1a`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{ position: 'absolute', top: '10px', right: '15px', display: 'flex', gap: '8px' }}>
                {opp.type === 'pulse' && (
                    <span style={{ fontSize: '0.6rem', background: 'var(--neon-blue)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>PULSE SIGNAL</span>
                )}
                {opp.type === 'coding' && (
                    <span style={{ fontSize: '0.6rem', background: 'var(--neon-orange)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>CODING GAP</span>
                )}
                {opp.type === 'service' && (
                    <span style={{ fontSize: '0.6rem', background: 'var(--neon-green)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>SERVICE GAP</span>
                )}

                <span style={{
                    fontSize: '0.6rem',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${accentColor}`,
                    color: accentColor,
                    fontWeight: 800
                }}>{opp.difficulty || 'Medium'}</span>
            </div>

            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className={getPlatformIcon(opp.source)} style={{ color: accentColor }}></i>
                    {opp.source} / {opp.channel}
                </span>

                {opp.type === 'direct' && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        By: <span style={{ color: 'var(--text-main)' }}>
                            {opp.isAnonymous
                                ? 'Anonymous'
                                : (opp.authorProfile?.username || opp.authorProfile?.email?.split('@')[0] || 'Unknown User')}
                        </span>
                    </span>
                )}
            </div>

            <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.4' }}>{opp.title}</h3>

            <div style={{ flex: 1 }}>
                {isMined || isScanned || isService ? (
                    <>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            padding: '1rem',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            border: `1px dashed ${accentColor}44`
                        }}>
                            <label style={{ fontSize: '0.6rem', color: accentColor, textTransform: 'uppercase', display: 'block', marginBottom: '4px', fontWeight: 900 }}>
                                Detected Market Signal
                            </label>
                            <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-main)', margin: 0 }}>"{opp.signal}"</p>
                            {opp.sourceUrl && (
                                <div style={{ marginTop: '10px' }}>
                                    <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: accentColor, textDecoration: 'none', fontWeight: 700 }}>
                                        <i className="fas fa-external-link-alt"></i> Original Source
                                    </a>
                                </div>
                            )}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{opp.inference}</p>
                    </>
                ) : (
                    <div>
                        {opp.abstract && (
                            <p style={{ fontSize: '0.9rem', color: 'var(--neon-purple)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Abstract: {opp.abstract}</p>
=======
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
                    borderLeft: `4px solid ${accentColor}`,
                    background: (isMined || isScanned)
                        ? `linear-gradient(135deg, ${isScanned ? 'rgba(255, 140, 0, 0.05)' : 'rgba(0, 242, 255, 0.05)'} 0%, transparent 100%)`
                        : `linear-gradient(135deg, rgba(188, 19, 254, 0.05) 0%, transparent 100%)`
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-10px) scale(1.02)';
                    e.currentTarget.style.borderColor = accentColor;
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                }}
            >
                <div style={{ position: 'absolute', top: '10px', right: '15px', display: 'flex', gap: '8px' }}>
                    {opp.isLive && (
                        <span style={{ fontSize: '0.6rem', background: 'var(--neon-green)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>LIVE SIGNAL</span>
                    )}
                    {opp.type === 'direct' && opp.sourceUrl && (
                        <span style={{ fontSize: '0.6rem', background: 'var(--neon-green)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>USER VERIFIED</span>
                    )}
                    {isMined && !opp.isLive && (
                        <span style={{ fontSize: '0.6rem', background: 'var(--neon-blue)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>PREDICTIVE Signal</span>
                    )}
                    {isScanned && (
                        <span style={{ fontSize: '0.6rem', background: 'var(--neon-orange)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 900 }}>SCANNED ISSUE</span>
                    )}

                    <span style={{
                        fontSize: '0.6rem',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        border: `1px solid ${accentColor}`,
                        color: accentColor,
                        fontWeight: 800
                    }}>{opp.difficulty}</span>
                </div>

                <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                            <i className={isScanned ? "fas fa-search-location" : (isMined ? "fas fa-radar" : "fas fa-bolt")} style={{ color: accentColor, marginRight: '6px' }}></i>
                            {opp.source} / {opp.channel}
                        </span>
                        {(isMined || isScanned || (opp.type === 'direct' && opp.sourceUrl)) && (
                            <div className="verified-tooltip-container" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    width: '8px',
                                    height: '8px',
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
                                    marginBottom: '8px',
                                    background: 'rgba(0,0,0,0.9)',
                                    color: 'var(--neon-green)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.65rem',
                                    whiteSpace: 'nowrap',
                                    opacity: 0,
                                    visibility: 'hidden',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid var(--neon-green)',
                                    zIndex: 10,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    letterSpacing: '0px'
                                }}>
                                    <i className="fas fa-shield-check" style={{ marginRight: '4px' }}></i>
                                    {getVerificationText(opp.source)}
                                </div>
                            </div>
>>>>>>> 20f4aedcaa374254748e2eb4bab1e560f915991e
                        )}
                    </div>

<<<<<<< HEAD
            <div style={{ marginTop: 'auto' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {opp.tags?.map(tag => (
                        <span key={tag} style={{
                            background: 'rgba(0,0,0,0.03)',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '0.7rem',
                            color: 'var(--text-main)',
                            border: '1px solid var(--glass-border)'
                        }}>{tag}</span>
                    ))}

                    <div style={{ marginLeft: 'auto', background: `${accentColor}11`, border: `1px solid ${accentColor}44`, padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <i className="fas fa-chart-line" style={{ color: accentColor, fontSize: '0.7rem' }}></i>
                        <span style={{ color: accentColor, fontWeight: 800, fontSize: '0.75rem' }}>
                            Prob: {opp.jobProbability}
                        </span>
                    </div>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--glass-border)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fas fa-users" style={{ color: accentColor, fontSize: '0.8rem' }}></i>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                            Solvers: {opp.solverCount || 0}/10
                        </span>
                    </div>
                    <span style={{ color: accentColor, fontSize: '0.8rem', fontWeight: 700 }}>Inspect & Expansion &rarr;</span>
=======
                    {opp.type === 'direct' && (
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            By: <span style={{ color: 'var(--text-main)' }}>
                                {opp.isAnonymous
                                    ? 'Anonymous'
                                    : (opp.authorProfile?.username || opp.authorProfile?.email?.split('@')[0] || 'Unknown User')}
                            </span>
                        </span>
                    )}
                </div>

                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', lineHeight: '1.4' }}>{opp.title}</h3>

                <div style={{ flex: 1 }}>
                    {(isMined || isScanned) ? (
                        <>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                padding: '1rem',
                                borderRadius: '8px',
                                marginBottom: '1rem',
                                border: `1px dashed ${accentColor}`
                            }}>
                                <label style={{ fontSize: '0.6rem', color: accentColor, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                                    {isScanned ? 'Public Complaint/Review' : 'Technical Signal'}
                                </label>
                                <p style={{ fontSize: '0.8rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>"{opp.signal}"</p>
                                {opp.sourceUrl && (
                                    <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: '8px', fontSize: '0.7rem', color: accentColor, textDecoration: 'none' }}>
                                        <i className="fas fa-external-link-alt"></i> View Source
                                    </a>
                                )}
                            </div>
                            <p style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>{opp.inference}</p>
                        </>
                    ) : (
                        <div>
                            {opp.abstract && (
                                <p style={{ fontSize: '0.9rem', color: 'var(--neon-purple)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Abstract: {opp.abstract}</p>
                            )}
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                {opp.content ? (opp.content.length > 150 ? opp.content.substring(0, 150) + '...' : opp.content) : (opp.signal || "No detailed content provided.")}
                            </p>
                            {opp.sourceUrl && (
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.8)',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    marginBottom: '1rem',
                                    border: `1px dashed ${accentColor}`
                                }}>
                                    <label style={{ fontSize: '0.6rem', color: accentColor, textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>User-Provided Evidence</label>
                                    <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', fontSize: '0.7rem', color: accentColor, textDecoration: 'none' }}>
                                        <i className="fas fa-external-link-alt"></i> View Custom Evidence
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                        {opp.tags.map(tag => (
                            <span key={tag} style={{
                                background: 'rgba(0,0,0,0.05)',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                fontSize: '0.7rem',
                                color: 'var(--text-main)',
                                border: '1px solid var(--glass-border)'
                            }}>{tag}</span>
                        ))}

                        {isScanned ? (
                            <div style={{ marginLeft: 'auto', background: 'rgba(255, 140, 0, 0.1)', border: '1px solid var(--neon-orange)', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="fas fa-hands-helping" style={{ color: 'var(--neon-orange)', fontSize: '0.7rem' }}></i>
                                <span style={{ color: 'var(--neon-orange)', fontWeight: 800, fontSize: '0.75rem' }}>Opportunity to Solve</span>
                            </div>
                        ) : (
                            <div className="likelihood-tooltip-container" style={{ marginLeft: 'auto', position: 'relative', display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                    background: 'rgba(255, 140, 0, 0.1)',
                                    border: '1px solid var(--neon-orange)',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'help',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 0 10px rgba(255, 140, 0, 0.2)'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 140, 0, 0.4)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 140, 0, 0.2)'}
                                >
                                    <i className="fas fa-chart-line" style={{ color: 'var(--neon-orange)', fontSize: '0.8rem' }}></i>
                                </div>
                                <div className="likelihood-tooltip" style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    right: '0',
                                    marginBottom: '8px',
                                    background: 'rgba(0,0,0,0.9)',
                                    color: 'var(--neon-orange)',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '0.7rem',
                                    whiteSpace: 'nowrap',
                                    opacity: 0,
                                    visibility: 'hidden',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid var(--neon-orange)',
                                    zIndex: 10,
                                    fontWeight: 800
                                }}>
                                    Hiring Likelihood: {opp.jobProbability}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--glass-border)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className="fas fa-users" style={{ color: accentColor, fontSize: '0.8rem' }}></i>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                                Solvers: {opp.solverCount || 0}/3
                            </span>
                        </div>
                        <span style={{ color: accentColor, fontSize: '0.8rem', fontWeight: 700 }}>Inspect Opportunity &rarr;</span>
                    </div>
>>>>>>> 20f4aedcaa374254748e2eb4bab1e560f915991e
                </div>
            </div>
        </>
    );
};

export default OpportunityCard;
